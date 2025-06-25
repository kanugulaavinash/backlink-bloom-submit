
import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Json } from "@/integrations/supabase/types";

interface ImportSession {
  id: string;
  filename: string;
  total_posts: number;
  successful_imports: number;
  failed_imports: number;
  status: string;
  created_at: string;
  completed_at: string | null;
  errors: Json;
}

const WordPressImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importSessions, setImportSessions] = useState<ImportSession[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/xml' || selectedFile.name.endsWith('.xml')) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a valid XML file exported from WordPress.",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  const handleImport = async () => {
    if (!file || !user) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Create import session
      const { data: session, error: sessionError } = await supabase
        .from('import_sessions')
        .insert({
          filename: file.name,
          imported_by: user.id,
          status: 'processing'
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Upload and process the XML file
      const response = await fetch('/api/wordpress-import', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Session-ID': session.id,
        }
      });

      if (!response.ok) {
        throw new Error('Import failed');
      }

      const result = await response.json();
      
      setUploadProgress(100);
      
      toast({
        title: "Import completed",
        description: `Successfully imported ${result.successful_imports} posts. ${result.failed_imports} posts failed.`,
      });

      // Refresh import sessions
      fetchImportSessions();
      
      // Reset form
      setFile(null);
      const input = document.getElementById('xml-file-input') as HTMLInputElement;
      if (input) input.value = '';

    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: "An error occurred while importing the WordPress file.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const fetchImportSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('import_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setImportSessions(data || []);
    } catch (error) {
      console.error('Error fetching import sessions:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Load import sessions on mount
  useEffect(() => {
    fetchImportSessions();
  }, []);

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import WordPress Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Upload WordPress XML Export</h3>
              <p className="text-gray-500 text-sm">
                Select the XML file exported from your WordPress admin dashboard
              </p>
            </div>
            <div className="mt-4">
              <Input
                id="xml-file-input"
                type="file"
                accept=".xml,text/xml"
                onChange={handleFileSelect}
                className="max-w-xs mx-auto"
              />
            </div>
            {file && (
              <div className="mt-4 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm text-blue-800">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          <div className="flex justify-center">
            <Button
              onClick={handleImport}
              disabled={!file || isUploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUploading ? "Processing..." : "Import Posts"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import History */}
      <Card>
        <CardHeader>
          <CardTitle>Import History</CardTitle>
        </CardHeader>
        <CardContent>
          {importSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No imports yet</p>
          ) : (
            <div className="space-y-3">
              {importSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(session.status)}
                    <div>
                      <p className="font-medium">{session.filename}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right text-sm">
                      <p>Total: {session.total_posts}</p>
                      <p className="text-green-600">Success: {session.successful_imports}</p>
                      {session.failed_imports > 0 && (
                        <p className="text-red-600">Failed: {session.failed_imports}</p>
                      )}
                    </div>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WordPressImport;
