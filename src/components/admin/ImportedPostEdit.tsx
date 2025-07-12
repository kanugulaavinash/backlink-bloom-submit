import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
    <div className="container mx-auto p-6 max-w-4xl">
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
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief description of the post"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Post content"
              rows={12}
              className="font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categories">Categories (comma-separated)</Label>
              <Input
                id="categories"
                value={formData.categories.join(', ')}
                onChange={(e) => handleCategoriesChange(e.target.value)}
                placeholder="e.g., Technology, News"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="e.g., javascript, react"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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

          <div>
            <Label htmlFor="featured_image_url">Featured Image URL</Label>
            <Input
              id="featured_image_url"
              value={formData.featured_image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportedPostEdit;