import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MediaLibrary } from '@/components/media/MediaLibrary';

export const MediaManagement = () => {
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Media Management</CardTitle>
        </CardHeader>
        <CardContent>
          <MediaLibrary />
        </CardContent>
      </Card>
    </div>
  );
};