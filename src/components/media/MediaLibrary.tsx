import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Upload, 
  Search, 
  Grid3X3, 
  List, 
  FolderPlus, 
  Tag, 
  Trash2, 
  Edit, 
  Download,
  Eye,
  FileImage,
  FileVideo,
  FileText,
  X,
  Plus,
  Filter
} from 'lucide-react';

interface MediaFile {
  id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  bucket_id: string;
  folder_id?: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  duration?: number;
  thumbnail_path?: string;
  alt_text?: string;
  caption?: string;
  tags: string[];
  usage_count: number;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

interface MediaFolder {
  id: string;
  name: string;
  parent_id?: string;
  bucket_id: string;
  created_by: string;
  created_at: string;
}

interface MediaTag {
  id: string;
  name: string;
  color: string;
  created_by: string;
}

interface MediaLibraryProps {
  onSelect?: (file: MediaFile) => void;
  selectionMode?: boolean;
  allowedTypes?: string[];
  bucketFilter?: string;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  onSelect,
  selectionMode = false,
  allowedTypes,
  bucketFilter
}) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [tags, setTags] = useState<MediaTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBucket, setSelectedBucket] = useState<string>(bucketFilter || 'all');
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [showUpload, setShowUpload] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null);
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);

  const { toast } = useToast();

  const buckets = [
    { id: 'all', name: 'All Files' },
    { id: 'blog-images', name: 'Blog Images' },
    { id: 'featured-images', name: 'Featured Images' },
    { id: 'videos', name: 'Videos' },
    { id: 'documents', name: 'Documents' }
  ];

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedBucket !== 'all') {
        query = query.eq('bucket_id', selectedBucket);
      }

      if (selectedFolder) {
        query = query.eq('folder_id', selectedFolder);
      }

      if (searchTerm) {
        query = query.or(
          `original_filename.ilike.%${searchTerm}%,alt_text.ilike.%${searchTerm}%,caption.ilike.%${searchTerm}%`
        );
      }

      if (allowedTypes && allowedTypes.length > 0) {
        query = query.in('mime_type', allowedTypes);
      }

      const { data, error } = await query;
      if (error) throw error;

      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: "Error",
        description: "Failed to load media files",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [selectedBucket, selectedFolder, searchTerm, allowedTypes, toast]);

  const fetchFolders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('media_folders')
        .select('*')
        .order('name');

      if (error) throw error;
      setFolders(data || []);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('media_tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  useEffect(() => {
    fetchFolders();
    fetchTags();
  }, [fetchFolders, fetchTags]);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <FileImage className="h-4 w-4" />;
    if (mimeType.startsWith('video/')) return <FileVideo className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileUrl = (file: MediaFile) => {
    const { data } = supabase.storage
      .from(file.bucket_id)
      .getPublicUrl(file.file_path);
    return data.publicUrl;
  };

  const handleFileSelect = (file: MediaFile) => {
    if (selectionMode && onSelect) {
      onSelect(file);
      return;
    }

    if (selectedFiles.has(file.id)) {
      setSelectedFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(file.id);
        return newSet;
      });
    } else {
      setSelectedFiles(prev => new Set([...prev, file.id]));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.size === 0) return;

    try {
      const filesToDelete = files.filter(f => selectedFiles.has(f.id));
      
      // Delete from storage
      for (const file of filesToDelete) {
        await supabase.storage.from(file.bucket_id).remove([file.file_path]);
      }

      // Delete from database
      const { error } = await supabase
        .from('media_library')
        .delete()
        .in('id', Array.from(selectedFiles));

      if (error) throw error;

      toast({
        title: "Success",
        description: `Deleted ${selectedFiles.size} file(s)`
      });

      setSelectedFiles(new Set());
      fetchFiles();
    } catch (error) {
      console.error('Error deleting files:', error);
      toast({
        title: "Error",
        description: "Failed to delete files",
        variant: "destructive"
      });
    }
  };

  const filteredFiles = files.filter(file => {
    if (selectedTag && !file.tags.includes(selectedTag)) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Media Library</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateFolder(true)}
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            Folder
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateTag(true)}
          >
            <Tag className="h-4 w-4 mr-2" />
            Tag
          </Button>
          <Button onClick={() => setShowUpload(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        
        <Select value={selectedBucket} onValueChange={setSelectedBucket}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {buckets.map(bucket => (
              <SelectItem key={bucket.id} value={bucket.id}>
                {bucket.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {folders.length > 0 && (
          <Select value={selectedFolder} onValueChange={setSelectedFolder}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Folders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Folders</SelectItem>
              {folders.map(folder => (
                <SelectItem key={folder.id} value={folder.id}>
                  {folder.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {tags.length > 0 && (
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Tags</SelectItem>
              {tags.map(tag => (
                <SelectItem key={tag.id} value={tag.id}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {selectedFiles.size > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete ({selectedFiles.size})
          </Button>
        )}
      </div>

      {/* File Grid/List */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No files found
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
            : "space-y-2"
        }>
          {filteredFiles.map(file => (
            <Card 
              key={file.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedFiles.has(file.id) ? 'ring-2 ring-primary' : ''
              } ${selectionMode ? 'hover:ring-1 hover:ring-primary' : ''}`}
              onClick={() => handleFileSelect(file)}
            >
              <CardContent className={viewMode === 'grid' ? "p-2" : "p-4"}>
                {viewMode === 'grid' ? (
                  <div className="space-y-2">
                    <div className="aspect-square bg-muted rounded-md overflow-hidden">
                      {file.mime_type.startsWith('image/') ? (
                        <img
                          src={getFileUrl(file)}
                          alt={file.alt_text || file.original_filename}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getFileIcon(file.mime_type)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs truncate font-medium">
                        {file.original_filename}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.file_size)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                      {file.mime_type.startsWith('image/') ? (
                        <img
                          src={getFileUrl(file)}
                          alt={file.alt_text || file.original_filename}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getFileIcon(file.mime_type)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.original_filename}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.file_size)} • {file.bucket_id}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewFile(file);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFile(file);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      {showUpload && (
        <MediaUpload
          open={showUpload}
          onClose={() => setShowUpload(false)}
          onUploadComplete={() => {
            fetchFiles();
            setShowUpload(false);
          }}
          bucketId={selectedBucket !== 'all' ? selectedBucket : 'blog-images'}
          folderId={selectedFolder || undefined}
        />
      )}

      {/* Create Folder Dialog */}
      <CreateFolderDialog
        open={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        onSuccess={() => {
          fetchFolders();
          setShowCreateFolder(false);
        }}
        bucketId={selectedBucket !== 'all' ? selectedBucket : 'blog-images'}
      />

      {/* Create Tag Dialog */}
      <CreateTagDialog
        open={showCreateTag}
        onClose={() => setShowCreateTag(false)}
        onSuccess={() => {
          fetchTags();
          setShowCreateTag(false);
        }}
      />

      {/* Edit File Dialog */}
      {editingFile && (
        <EditFileDialog
          file={editingFile}
          open={!!editingFile}
          onClose={() => setEditingFile(null)}
          onSuccess={() => {
            fetchFiles();
            setEditingFile(null);
          }}
          availableTags={tags}
        />
      )}

      {/* Preview Dialog */}
      {previewFile && (
        <FilePreviewDialog
          file={previewFile}
          open={!!previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
};

// Additional components will be defined in separate files
interface MediaUploadProps {
  open: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
  bucketId: string;
  folderId?: string;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ open, onClose, onUploadComplete, bucketId, folderId }) => {
  // Component implementation will be in MediaUpload.tsx
  return null;
};

interface CreateFolderDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bucketId: string;
}

const CreateFolderDialog: React.FC<CreateFolderDialogProps> = ({ open, onClose, onSuccess, bucketId }) => {
  // Component implementation will be in CreateFolderDialog.tsx
  return null;
};

interface CreateTagDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateTagDialog: React.FC<CreateTagDialogProps> = ({ open, onClose, onSuccess }) => {
  // Component implementation will be in CreateTagDialog.tsx
  return null;
};

interface EditFileDialogProps {
  file: MediaFile;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  availableTags: MediaTag[];
}

const EditFileDialog: React.FC<EditFileDialogProps> = ({ file, open, onClose, onSuccess, availableTags }) => {
  // Component implementation will be in EditFileDialog.tsx
  return null;
};

interface FilePreviewDialogProps {
  file: MediaFile;
  open: boolean;
  onClose: () => void;
}

const FilePreviewDialog: React.FC<FilePreviewDialogProps> = ({ file, open, onClose }) => {
  // Component implementation will be in FilePreviewDialog.tsx
  return null;
};