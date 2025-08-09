import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, X, ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { MediaSelector } from "@/components/media/MediaSelector";
import { addCustomQuillButtons, getQuillModulesWithMedia, useQuillMediaHandler } from "@/components/media/ReactQuillMediaHandler";
interface ImportedPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  categories: string[];
  tags: string[];
  status: string;
  published_date: string;
  featured_image_url: string;
}

const ImportedPostEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<ImportedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    categories: [] as string[],
    tags: [] as string[],
    status: 'imported',
    published_date: '',
    featured_image_url: ''
  });

  // Editor and media states
  const quillRef = useRef<any>(null);
  const { openMediaSelector, MediaSelectorComponent } = useQuillMediaHandler(quillRef as any);
  useEffect(() => {
    addCustomQuillButtons();
  }, []);
  const quillModules = getQuillModulesWithMedia(openMediaSelector);

  const [newTag, setNewTag] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [featuredSelectorOpen, setFeaturedSelectorOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('imported_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setPost(data);
      setFormData({
        title: data.title || '',
        content: data.content || '',
        excerpt: data.excerpt || '',
        categories: data.categories || [],
        tags: data.tags || [],
        status: data.status || 'imported',
        published_date: data.published_date || '',
        featured_image_url: data.featured_image_url || ''
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: "Error",
        description: "Failed to fetch post details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('imported_posts')
        .update({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          categories: formData.categories,
          tags: formData.tags,
          status: formData.status,
          published_date: formData.published_date || null,
          featured_image_url: formData.featured_image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post updated successfully",
      });
      
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCategoriesChange = (value: string) => {
    const categories = value.split(',').map(cat => cat.trim()).filter(cat => cat);
    setFormData(prev => ({ ...prev, categories }));
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  // Enhanced category/tag handlers (badge-style)
  const addTag = () => {
    if (!newTag.trim()) return;
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(newTag.trim()) ? prev.tags : [...prev.tags, newTag.trim()]
    }));
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(newCategory.trim()) ? prev.categories : [...prev.categories, newCategory.trim()]
    }));
    setNewCategory("");
  };

  const removeCategory = (category: string) => {
    setFormData(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }));
  };

  type MediaFile = {
    file_path: string;
    bucket_id: string;
    mime_type: string;
    original_filename: string;
    alt_text?: string;
    caption?: string;
  };

  const handleFeaturedSelect = (file: MediaFile) => {
    const { data } = supabase.storage.from(file.bucket_id).getPublicUrl(file.file_path);
    if (data?.publicUrl) {
      setFormData(prev => ({ ...prev, featured_image_url: data.publicUrl }));
    }
    setFeaturedSelectorOpen(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">Post not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin-dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin
        </Button>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Imported Post</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Post title"
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <ReactQuill
              ref={quillRef as any}
              theme="snow"
              value={formData.content}
              onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
              modules={quillModules}
            />
            <MediaSelectorComponent />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief description of the post"
              rows={3}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2 mb-2 mt-2">
                {formData.categories.map((cat) => (
                  <Badge key={cat} variant="secondary" className="gap-1">
                    {cat}
                    <button type="button" onClick={() => removeCategory(cat)} className="ml-1 inline-flex">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Add category"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCategory(); } }}
                />
                <Button type="button" variant="outline" onClick={addCategory}>Add</Button>
              </div>
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 inline-flex">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                />
                <Button type="button" variant="outline" onClick={addTag}>Add</Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Publishing Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="imported">Imported</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="published_date">Published Date</Label>
                <Input
                  id="published_date"
                  type="datetime-local"
                  value={formData.published_date ? new Date(formData.published_date).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, published_date: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <Label htmlFor="featured_image_url">Featured Image</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="featured_image_url"
                value={formData.featured_image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
              <Button type="button" variant="outline" className="gap-2" onClick={() => setFeaturedSelectorOpen(true)}>
                <ImagePlus className="h-4 w-4" /> Choose from Library
              </Button>
            </div>
            {formData.featured_image_url && (
              <div className="mt-3">
                <img
                  src={formData.featured_image_url}
                  alt="Featured image preview"
                  loading="lazy"
                  className="max-h-48 rounded-md object-cover"
                />
              </div>
            )}
            <MediaSelector
              open={featuredSelectorOpen}
              onClose={() => setFeaturedSelectorOpen(false)}
              onSelect={handleFeaturedSelect}
              allowedTypes={['image/jpeg','image/png','image/gif','image/webp','image/svg+xml']}
              bucketFilter="featured-images"
              title="Select Featured Image"
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 sticky bottom-4">
        <Card className="border-2 border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardContent className="p-4 flex justify-end">
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImportedPostEdit;