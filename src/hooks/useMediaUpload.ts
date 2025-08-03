import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadOptions {
  bucketId: string;
  folderId?: string;
  altText?: string;
  caption?: string;
}

interface UploadResult {
  success: boolean;
  fileId?: string;
  filePath?: string;
  publicUrl?: string;
  error?: string;
}

export const useMediaUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const uploadFile = async (file: File, options: UploadOptions): Promise<UploadResult> => {
    setIsUploading(true);
    setProgress(0);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Validate file
      const validation = validateFile(file, options.bucketId);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      setProgress(25);

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(options.bucketId)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      setProgress(50);

      // Get file dimensions/metadata
      const metadata = await getFileMetadata(file);

      setProgress(75);

      // Save to media_library table
      const { data: mediaData, error: dbError } = await supabase
        .from('media_library')
        .insert({
          filename: uploadData.path,
          original_filename: file.name,
          file_path: uploadData.path,
          bucket_id: options.bucketId,
          folder_id: options.folderId || null,
          file_size: file.size,
          mime_type: file.type,
          width: metadata.width,
          height: metadata.height,
          duration: metadata.duration,
          alt_text: options.altText || null,
          caption: options.caption || null,
          uploaded_by: user.id
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setProgress(100);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(options.bucketId)
        .getPublicUrl(uploadData.path);

      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded successfully`
      });

      return {
        success: true,
        fileId: mediaData.id,
        filePath: uploadData.path,
        publicUrl: urlData.publicUrl
      };

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive"
      });

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const uploadMultipleFiles = async (
    files: File[], 
    options: UploadOptions
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await uploadFile(file, options);
      results.push(result);
      
      // Update overall progress
      setProgress((i + 1) / files.length * 100);
    }

    return results;
  };

  const deleteFile = async (fileId: string): Promise<boolean> => {
    try {
      // Get file details
      const { data: fileData, error: fetchError } = await supabase
        .from('media_library')
        .select('*')
        .eq('id', fileId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(fileData.bucket_id)
        .remove([fileData.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('media_library')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      toast({
        title: "File Deleted",
        description: "File has been deleted successfully"
      });

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : 'Failed to delete file',
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    isUploading,
    progress
  };
};

// Helper functions
const validateFile = (file: File, bucketId: string): { valid: boolean; error?: string } => {
  const bucketLimits = {
    'blog-images': { 
      maxSize: 50 * 1024 * 1024, 
      types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'] 
    },
    'featured-images': { 
      maxSize: 50 * 1024 * 1024, 
      types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] 
    },
    'videos': { 
      maxSize: 500 * 1024 * 1024, 
      types: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'] 
    },
    'documents': { 
      maxSize: 100 * 1024 * 1024, 
      types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'] 
    }
  };

  const limits = bucketLimits[bucketId as keyof typeof bucketLimits];
  if (!limits) return { valid: false, error: 'Invalid bucket' };

  if (file.size > limits.maxSize) {
    return { 
      valid: false, 
      error: `File too large. Maximum size: ${Math.round(limits.maxSize / 1024 / 1024)}MB` 
    };
  }

  if (!limits.types.includes(file.type)) {
    return { valid: false, error: 'File type not allowed for this bucket' };
  }

  return { valid: true };
};

const getFileMetadata = async (file: File): Promise<{
  width?: number;
  height?: number;
  duration?: number;
}> => {
  return new Promise((resolve) => {
    if (file.type.startsWith('image/')) {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      img.onerror = () => resolve({});
      img.src = URL.createObjectURL(file);
    } else if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        resolve({
          width: video.videoWidth,
          height: video.videoHeight,
          duration: video.duration
        });
      };
      video.onerror = () => resolve({});
      video.src = URL.createObjectURL(file);
    } else {
      resolve({});
    }
  });
};