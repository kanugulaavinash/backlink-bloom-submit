import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MediaLibrary } from './MediaLibrary';

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

interface MediaSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (file: MediaFile) => void;
  allowedTypes?: string[];
  bucketFilter?: string;
  title?: string;
}

export const MediaSelector: React.FC<MediaSelectorProps> = ({
  open,
  onClose,
  onSelect,
  allowedTypes,
  bucketFilter,
  title = "Select Media"
}) => {
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

  const handleSelect = (file: MediaFile) => {
    setSelectedFile(file);
  };

  const handleConfirm = () => {
    if (selectedFile) {
      onSelect(selectedFile);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <MediaLibrary
            onSelect={handleSelect}
            selectionMode={true}
            allowedTypes={allowedTypes}
            bucketFilter={bucketFilter}
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.original_filename}
              </p>
            )}
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!selectedFile}>
              Select File
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};