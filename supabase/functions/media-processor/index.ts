import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessRequest {
  mediaId: string;
  operation: 'resize' | 'thumbnail' | 'optimize' | 'convert';
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { mediaId, operation, options = {} }: ProcessRequest = await req.json();

    console.log(`Processing media ${mediaId} with operation: ${operation}`);

    // Get the media file details
    const { data: mediaFile, error: fetchError } = await supabaseClient
      .from('media_library')
      .select('*')
      .eq('id', mediaId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch media file: ${fetchError.message}`);
    }

    // Download the original file
    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from(mediaFile.bucket_id)
      .download(mediaFile.file_path);

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    let processedFile: Uint8Array;
    let newFileName: string;
    let mimeType: string = mediaFile.mime_type;

    switch (operation) {
      case 'thumbnail':
        // Generate thumbnail (placeholder - would use image processing library)
        processedFile = new Uint8Array(await fileData.arrayBuffer());
        newFileName = `thumb_${mediaFile.filename}`;
        break;

      case 'resize':
        // Resize image (placeholder - would use image processing library)
        processedFile = new Uint8Array(await fileData.arrayBuffer());
        newFileName = `resized_${options.width}x${options.height}_${mediaFile.filename}`;
        break;

      case 'optimize':
        // Optimize image (placeholder - would compress image)
        processedFile = new Uint8Array(await fileData.arrayBuffer());
        newFileName = `opt_${mediaFile.filename}`;
        break;

      case 'convert':
        // Convert format (placeholder - would convert image format)
        processedFile = new Uint8Array(await fileData.arrayBuffer());
        const newExt = options.format || 'webp';
        newFileName = mediaFile.filename.replace(/\.[^/.]+$/, `.${newExt}`);
        mimeType = `image/${newExt}`;
        break;

      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    // Upload processed file
    const processedPath = `processed/${newFileName}`;
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from(mediaFile.bucket_id)
      .upload(processedPath, processedFile, {
        contentType: mimeType,
        cacheControl: '3600'
      });

    if (uploadError) {
      throw new Error(`Failed to upload processed file: ${uploadError.message}`);
    }

    // Update media library record with processed file info
    const updateData: any = {};
    
    if (operation === 'thumbnail') {
      updateData.thumbnail_path = uploadData.path;
    }

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabaseClient
        .from('media_library')
        .update(updateData)
        .eq('id', mediaId);

      if (updateError) {
        console.error('Failed to update media record:', updateError);
      }
    }

    // Get public URL for the processed file
    const { data: urlData } = supabaseClient.storage
      .from(mediaFile.bucket_id)
      .getPublicUrl(uploadData.path);

    return new Response(
      JSON.stringify({
        success: true,
        processedUrl: urlData.publicUrl,
        processedPath: uploadData.path,
        operation,
        options
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error processing media:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});