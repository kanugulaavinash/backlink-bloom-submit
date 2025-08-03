import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, FileImage, FileVideo, FileText } from 'lucide-react';

interface MediaUploadProps {
  open: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
  bucketId: string;
  folderId?: string;
}

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  altText?: string;
  caption?: string;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  open,
  onClose,
  onUploadComplete,
  bucketId,
  folderId
}) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const resetUpload = () => {
    setUploadFiles([]);
    setIsUploading(false);
    setIsDragOver(false);
  };

  const handleClose = () => {
    if (!isUploading) {
      resetUpload();
      onClose();
    }
  };

  const generateFileId = () => Math.random().toString(36).substring(2, 15);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <FileImage className="h-8 w-8" />;
    if (file.type.startsWith('video/')) return <FileVideo className="h-8 w-8" />;
    return <FileText className="h-8 w-8" />;
  };

  const validateFile = (file: File): string | null => {
    const bucketLimits = {
      'blog-images': { maxSize: 50 * 1024 * 1024, types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'] },
      'featured-images': { maxSize: 50 * 1024 * 1024, types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] },
      'videos': { maxSize: 500 * 1024 * 1024, types: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'] },
      'documents': { maxSize: 100 * 1024 * 1024, types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'] }
    };

    const limits = bucketLimits[bucketId as keyof typeof bucketLimits];
    if (!limits) return 'Invalid bucket';

    if (file.size > limits.maxSize) {
      return `File too large. Maximum size: ${Math.round(limits.maxSize / 1024 / 1024)}MB`;
    }

    if (!limits.types.includes(file.type)) {
      return 'File type not allowed for this bucket';
    }

    return null;
  };

  const handleFileSelect = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newUploadFiles: UploadFile[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      newUploadFiles.push({
        file,
        id: generateFileId(),
        progress: 0,
        status: error ? 'error' : 'pending',
        error
      });
    });

    setUploadFiles(prev => [...prev, ...newUploadFiles]);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, []);

  const removeFile = (fileId: string) => {
    if (isUploading) return;
    setUploadFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const updateFileMetadata = (fileId: string, field: 'altText' | 'caption', value: string) => {
    setUploadFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, [field]: value } : f
    ));
  };

  const uploadFile = async (uploadFile: UploadFile): Promise<void> => {
    const { file } = uploadFile;
    
    // Update status to uploading
    setUploadFiles(prev => prev.map(f => 
      f.id === uploadFile.id ? { ...f, status: 'uploading' as const } : f
    ));

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to storage with progress tracking
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketId)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get image dimensions if it's an image
      let width: number | undefined;
      let height: number | undefined;
      let duration: number | undefined;

      if (file.type.startsWith('image/')) {
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = () => {
            width = img.width;
            height = img.height;
            resolve(null);
          };
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });
      } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        await new Promise((resolve, reject) => {
          video.onloadedmetadata = () => {
            width = video.videoWidth;
            height = video.videoHeight;
            duration = video.duration;
            resolve(null);
          };
          video.onerror = reject;
          video.src = URL.createObjectURL(file);
        });
      }

      // Save to media_library table
      const { error: dbError } = await supabase
        .from('media_library')
        .insert({
          filename: uploadData.path,
          original_filename: file.name,
          file_path: uploadData.path,
          bucket_id: bucketId,
          folder_id: folderId || null,
          file_size: file.size,
          mime_type: file.type,
          width,
          height,
          duration,
          alt_text: uploadFile.altText || null,
          caption: uploadFile.caption || null,
          uploaded_by: user.id
        });

      if (dbError) throw dbError;

      // Update status to success
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'success' as const, progress: 100 } : f
      ));

    } catch (error) {
      console.error('Upload error:', error);
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { 
          ...f, 
          status: 'error' as const, 
          error: error instanceof Error ? error.message : 'Upload failed' 
        } : f
      ));
    }
  };

  const handleUploadAll = async () => {
    const validFiles = uploadFiles.filter(f => f.status === 'pending');
    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      // Upload files in parallel (but limit concurrency)
      const uploadPromises = validFiles.map(uploadFile);
      await Promise.all(uploadPromises);

      const successCount = uploadFiles.filter(f => f.status === 'success').length;
      const errorCount = uploadFiles.filter(f => f.status === 'error').length;

      if (successCount > 0) {
        toast({
          title: "Upload Complete",
          description: `${successCount} file(s) uploaded successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`
        });
      }

      if (errorCount === 0) {
        onUploadComplete();
        handleClose();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Error",
        description: "Some files failed to upload",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const hasValidFiles = uploadFiles.some(f => f.status === 'pending');
  const hasErrors = uploadFiles.some(f => f.status === 'error');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Media Files</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Uploading to: {bucketId}
            </p>
            <Input
              type="file"
              multiple
              className="hidden"
              id="file-upload"
              onChange={(e) => {
                if (e.target.files) {
                  handleFileSelect(e.target.files);
                }
              }}
            />
            <Label htmlFor="file-upload">
              <Button variant="outline" asChild>
                <span>Select Files</span>
              </Button>
            </Label>
          </div>

          {/* File List */}
          {uploadFiles.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Selected Files ({uploadFiles.length})</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {uploadFiles.map(uploadFile => (
                  <div
                    key={uploadFile.id}
                    className="flex items-start gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {getFileIcon(uploadFile.file)}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{uploadFile.file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(uploadFile.file.size)} • {uploadFile.file.type}
                          </p>
                        </div>
                        {!isUploading && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(uploadFile.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {uploadFile.status === 'error' && (
                        <p className="text-sm text-destructive">{uploadFile.error}</p>
                      )}

                      {uploadFile.status === 'uploading' && (
                        <Progress value={uploadFile.progress} className="w-full" />
                      )}

                      {uploadFile.status === 'success' && (
                        <p className="text-sm text-green-600">✓ Upload complete</p>
                      )}

                      {/* Metadata fields for images */}
                      {uploadFile.file.type.startsWith('image/') && uploadFile.status === 'pending' && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`alt-${uploadFile.id}`} className="text-xs">
                              Alt Text
                            </Label>
                            <Input
                              id={`alt-${uploadFile.id}`}
                              placeholder="Alternative text for image"
                              value={uploadFile.altText || ''}
                              onChange={(e) => updateFileMetadata(uploadFile.id, 'altText', e.target.value)}
                              disabled={isUploading}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`caption-${uploadFile.id}`} className="text-xs">
                              Caption
                            </Label>
                            <Input
                              id={`caption-${uploadFile.id}`}
                              placeholder="Image caption"
                              value={uploadFile.caption || ''}
                              onChange={(e) => updateFileMetadata(uploadFile.id, 'caption', e.target.value)}
                              disabled={isUploading}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleClose} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Cancel'}
            </Button>
            <div className="space-x-2">
              {hasErrors && (
                <Button
                  variant="outline"
                  onClick={() => setUploadFiles(prev => prev.filter(f => f.status !== 'error'))}
                  disabled={isUploading}
                >
                  Remove Errors
                </Button>
              )}
              <Button
                onClick={handleUploadAll}
                disabled={!hasValidFiles || isUploading}
              >
                {isUploading ? 'Uploading...' : `Upload ${uploadFiles.filter(f => f.status === 'pending').length} Files`}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};