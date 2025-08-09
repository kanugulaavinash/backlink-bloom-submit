import React, { useState } from 'react';
import { MediaSelector } from './MediaSelector';
import { supabase } from '@/integrations/supabase/client';

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

interface ReactQuillMediaHandlerProps {
  quillRef: React.RefObject<any>;
}

export const useQuillMediaHandler = (quillRef: React.RefObject<any>) => {
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [currentRange, setCurrentRange] = useState<any>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  const openMediaSelector = (type: 'image' | 'video' = 'image') => {
    if (!quillRef.current) return;

    const quill = quillRef.current.getEditor();
    const range = quill.getSelection();
    setCurrentRange(range);
    setMediaType(type);
    setShowMediaSelector(true);
  };

  const handleMediaSelect = async (file: MediaFile) => {
    if (!quillRef.current || !currentRange) return;

    const quill = quillRef.current.getEditor();
    
    // Get the public URL for the file
    const { data } = supabase.storage
      .from(file.bucket_id)
      .getPublicUrl(file.file_path);

    if (file.mime_type.startsWith('image/')) {
      // Insert image
      quill.insertEmbed(currentRange.index, 'image', data.publicUrl);
      
      // Set alt text if available
      if (file.alt_text) {
        const imageElement = quill.root.querySelector(`img[src="${data.publicUrl}"]`);
        if (imageElement) {
          imageElement.setAttribute('alt', file.alt_text);
          imageElement.setAttribute('title', file.caption || file.alt_text);
        }
      }
    } else if (file.mime_type.startsWith('video/')) {
      // Insert video
      const videoHtml = `
        <video controls style="max-width: 100%; height: auto;">
          <source src="${data.publicUrl}" type="${file.mime_type}">
          Your browser does not support the video tag.
        </video>
      `;
      
      quill.clipboard.dangerouslyPasteHTML(currentRange.index, videoHtml);
    }

    // Update usage tracking
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // This would need a content_id and content_type - you'll need to pass these in
        // For now, we'll skip usage tracking in the editor
        console.log('Media inserted:', file.original_filename);
      }
    } catch (error) {
      console.error('Error tracking media usage:', error);
    }

    // Move cursor after the inserted media
    quill.setSelection(currentRange.index + 1);
    setShowMediaSelector(false);
    setCurrentRange(null);
  };

  const MediaSelectorComponent = () => (
    <MediaSelector
      open={showMediaSelector}
      onClose={() => {
        setShowMediaSelector(false);
        setCurrentRange(null);
      }}
      onSelect={handleMediaSelect}
      allowedTypes={
        mediaType === 'image' 
          ? ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
          : ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov']
      }
      bucketFilter={mediaType === 'image' ? 'blog-images' : 'videos'}
      title={`Select ${mediaType === 'image' ? 'Image' : 'Video'}`}
    />
  );

  return {
    openMediaSelector,
    MediaSelectorComponent
  };
};

// Custom toolbar module for ReactQuill with media buttons
export const getQuillModulesWithMedia = (openMediaSelector: (type: 'image' | 'video') => void) => ({
  toolbar: {
    container: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
    handlers: {
      'image': () => openMediaSelector('image'),
      'video': () => openMediaSelector('video')
    }
  }
});

// Using default Quill icons; no custom registration needed in Vite/ESM
export const addCustomQuillButtons = () => {
  // No-op to avoid require in ESM environments
};