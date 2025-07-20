import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Eye, X, Plus } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

const CreateBlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    visibility: 'public',
    meta_title: '',
    meta_description: '',
    featured_image_alt: ''
  });

  useEffect(() => {
    fetchCategories();
    fetchTags();
    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.rpc('custom_select', { 
        query: 'SELECT id, name, slug FROM categories ORDER BY name' 
      });
      if (error) throw error;
      if (data) {
        const categoryData = data.map((item: any) => item.result);
        setCategories(categoryData);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase.rpc('custom_select', { 
        query: 'SELECT id, name, slug FROM tags ORDER BY usage_count DESC' 
      });
      if (error) throw error;
      if (data) {
        const tagData = data.map((item: any) => item.result);
        setTags(tagData);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchBlogPost = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase.rpc('custom_select', { 
        query: `SELECT bp.*, 
                array_agg(DISTINCT bpc.category_id) as category_ids,
                array_agg(DISTINCT bpt.tag_id) as tag_ids
                FROM blog_posts bp
                LEFT JOIN blog_post_categories bpc ON bp.id = bpc.blog_post_id
                LEFT JOIN blog_post_tags bpt ON bp.id = bpt.blog_post_id
                WHERE bp.id = '${id}'
                GROUP BY bp.id` 
      });
      
      if (error) throw error;
      if (data && data.length > 0) {
        const post = data[0].result;
        setFormData({
          title: post.title || '',
          content: post.content || '',
          excerpt: post.excerpt || '',
          status: post.status || 'draft',
          visibility: post.visibility || 'public',
          meta_title: post.meta_title || '',
          meta_description: post.meta_description || '',
          featured_image_alt: post.featured_image_alt || ''
        });
        setFeaturedImageUrl(post.featured_image_url || '');
        setSelectedCategories(post.category_ids || []);
        setSelectedTags(post.tag_ids || []);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
    }
  };

  const uploadFeaturedImage = async () => {
    if (!featuredImage) return '';

    const fileExt = featuredImage.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `featured-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('blog-media')
      .upload(filePath, featuredImage);

    if (uploadError) {
      toast({
        title: "Upload failed",
        description: uploadError.message,
        variant: "destructive"
      });
      return '';
    }

    const { data } = supabase.storage.from('blog-media').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const createTag = async () => {
    if (!newTag.trim()) return;

    const slug = newTag.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    try {
      const { data, error } = await supabase.rpc('custom_select', { 
        query: `INSERT INTO tags (name, slug) VALUES ('${newTag.trim()}', '${slug}') RETURNING *` 
      });

      if (error) throw error;
      
      if (data && data.length > 0) {
        const newTagData = data[0].result;
        setTags([...tags, newTagData]);
        setSelectedTags([...selectedTags, newTagData.id]);
        setNewTag('');
        toast({
          title: "Tag created",
          description: `Tag "${newTag}" has been created.`
        });
      }
    } catch (error: any) {
      toast({
        title: "Error creating tag",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const saveBlogPost = async (status: string) => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let imageUrl = featuredImageUrl;
      if (featuredImage) {
        imageUrl = await uploadFeaturedImage();
      }

      const slug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      const wordCount = formData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200);

      const postData = {
        ...formData,
        status,
        slug,
        featured_image_url: imageUrl,
        word_count: wordCount,
        reading_time: readingTime,
        published_at: status === 'published' ? new Date().toISOString() : null,
        user_id: user.id
      };

      let postId = id;
      let query = '';

      if (id) {
        // Update existing post
        query = `UPDATE blog_posts SET 
                 title = '${postData.title}',
                 content = '${postData.content.replace(/'/g, "''")}',
                 excerpt = '${postData.excerpt}',
                 status = '${postData.status}',
                 visibility = '${postData.visibility}',
                 featured_image_url = '${postData.featured_image_url}',
                 featured_image_alt = '${postData.featured_image_alt}',
                 meta_title = '${postData.meta_title}',
                 meta_description = '${postData.meta_description}',
                 word_count = ${postData.word_count},
                 reading_time = ${postData.reading_time},
                 updated_at = now()
                 WHERE id = '${id}'`;
      } else {
        // Create new post
        query = `INSERT INTO blog_posts (title, content, excerpt, status, visibility, featured_image_url, featured_image_alt, meta_title, meta_description, word_count, reading_time, user_id, slug, published_at)
                 VALUES ('${postData.title}', '${postData.content.replace(/'/g, "''")}', '${postData.excerpt}', '${postData.status}', '${postData.visibility}', '${postData.featured_image_url}', '${postData.featured_image_alt}', '${postData.meta_title}', '${postData.meta_description}', ${postData.word_count}, ${postData.reading_time}, '${postData.user_id}', '${postData.slug}', ${postData.published_at ? `'${postData.published_at}'` : 'NULL'})
                 RETURNING id`;
      }

      const { data, error } = await supabase.rpc('custom_select', { query });
      if (error) throw error;

      if (!id && data && data.length > 0) {
        postId = data[0].result.id;
      }

      // Update categories and tags
      if (postId) {
        // Clear existing relationships
        await supabase.rpc('custom_select', { 
          query: `DELETE FROM blog_post_categories WHERE blog_post_id = '${postId}'` 
        });
        await supabase.rpc('custom_select', { 
          query: `DELETE FROM blog_post_tags WHERE blog_post_id = '${postId}'` 
        });

        // Add new category relationships
        if (selectedCategories.length > 0) {
          const categoryValues = selectedCategories.map(catId => `('${postId}', '${catId}')`).join(', ');
          await supabase.rpc('custom_select', { 
            query: `INSERT INTO blog_post_categories (blog_post_id, category_id) VALUES ${categoryValues}` 
          });
        }

        // Add new tag relationships
        if (selectedTags.length > 0) {
          const tagValues = selectedTags.map(tagId => `('${postId}', '${tagId}')`).join(', ');
          await supabase.rpc('custom_select', { 
            query: `INSERT INTO blog_post_tags (blog_post_id, tag_id) VALUES ${tagValues}` 
          });
        }
      }

      toast({
        title: status === 'published' ? "Post published!" : "Post saved!",
        description: `Your blog post has been ${status === 'published' ? 'published' : 'saved as draft'}.`
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error saving post",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {id ? 'Edit Blog Post' : 'Create New Blog Post'}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => saveBlogPost('draft')}
                      disabled={loading}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button
                      onClick={() => saveBlogPost('published')}
                      disabled={loading}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Publish
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter your blog post title..."
                    className="text-lg"
                  />
                </div>

                <div>
                  <Label>Content</Label>
                  <div className="border rounded-md">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                      modules={modules}
                      style={{ minHeight: '400px' }}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Write a short excerpt..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO Section */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    placeholder="SEO title (leave blank to use post title)"
                  />
                </div>
                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    placeholder="SEO description (leave blank to use excerpt)"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Visibility</Label>
                  <Select value={formData.visibility} onValueChange={(value) => setFormData({ ...formData, visibility: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {featuredImageUrl && (
                  <div className="relative">
                    <img src={featuredImageUrl} alt="Featured" className="w-full h-32 object-cover rounded" />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setFeaturedImageUrl('')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <div>
                  <Label htmlFor="featured-image">Upload Image</Label>
                  <Input
                    id="featured-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFeaturedImage(e.target.files?.[0] || null)}
                  />
                </div>
                <div>
                  <Label htmlFor="featured_image_alt">Alt Text</Label>
                  <Input
                    id="featured_image_alt"
                    value={formData.featured_image_alt}
                    onChange={(e) => setFormData({ ...formData, featured_image_alt: e.target.value })}
                    placeholder="Describe the image..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCategories([...selectedCategories, category.id]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                          }
                        }}
                      />
                      <Label className="text-sm">{category.name}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map((tagId) => {
                    const tag = tags.find(t => t.id === tagId);
                    return tag ? (
                      <Badge key={tagId} variant="secondary" className="flex items-center gap-1">
                        {tag.name}
                        <button
                          onClick={() => setSelectedTags(selectedTags.filter(id => id !== tagId))}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
                
                <div className="space-y-2">
                  <Label>Popular Tags</Label>
                  <div className="flex flex-wrap gap-1">
                    {tags.filter(tag => !selectedTags.includes(tag.id)).slice(0, 10).map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="cursor-pointer hover:bg-secondary"
                        onClick={() => setSelectedTags([...selectedTags, tag.id])}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add new tag..."
                    onKeyPress={(e) => e.key === 'Enter' && createTag()}
                  />
                  <Button onClick={createTag} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPost;