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
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Eye, X, Plus } from 'lucide-react';

// Pre-defined categories (can be moved to database later)
const CATEGORIES = [
  'Technology',
  'Business', 
  'Marketing',
  'Design',
  'Development',
  'Lifestyle',
  'Health',
  'Travel',
  'Food',
  'Fashion',
  'Sports',
  'Entertainment',
  'Education',
  'Finance',
  'Science',
  'Politics',
  'Art',
  'Music',
  'Photography',
  'Gaming'
];

const CreateBlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    author_name: '',
    author_bio: '',
    author_website: '',
    status: 'pending'
  });

  useEffect(() => {
    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  const fetchBlogPost = async () => {
    if (!id) return;
    
    try {
      const { data: postData, error: postError } = await supabase
        .from('guest_posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (postError) throw postError;

      if (postData) {
        setFormData({
          title: postData.title || '',
          content: postData.content || '',
          excerpt: postData.excerpt || '',
          category: postData.category || '',
          author_name: postData.author_name || '',
          author_bio: postData.author_bio || '',
          author_website: postData.author_website || '',
          status: postData.status || 'pending'
        });
        setSelectedTags(postData.tags || []);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast({
        title: "Error",
        description: "Failed to load blog post",
        variant: "destructive"
      });
    }
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    
    const tagToAdd = newTag.trim();
    if (!selectedTags.includes(tagToAdd)) {
      setSelectedTags([...selectedTags, tagToAdd]);
      setNewTag('');
      toast({
        title: "Tag added",
        description: `Tag "${tagToAdd}" has been added.`
      });
    } else {
      toast({
        title: "Tag exists",
        description: "This tag is already added.",
        variant: "destructive"
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const saveBlogPost = async (status: string) => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const postData: any = {
        ...formData,
        status,
        tags: selectedTags,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      if (status === 'published') {
        postData.published_at = new Date().toISOString();
      }

      if (id) {
        // Update existing post
        const { error } = await supabase
          .from('guest_posts')
          .update(postData)
          .eq('id', id);
        
        if (error) throw error;
      } else {
        // Create new post
        const { error } = await supabase
          .from('guest_posts')
          .insert(postData);
        
        if (error) throw error;
      }

      toast({
        title: status === 'published' ? "Post published!" : "Post saved!",
        description: `Your blog post has been ${status === 'published' ? 'published' : 'saved'}.`
      });

      navigate('/admin-dashboard');
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
                      onClick={() => saveBlogPost('pending')}
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

            {/* Author Information */}
            <Card>
              <CardHeader>
                <CardTitle>Author Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="author_name">Author Name</Label>
                  <Input
                    id="author_name"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="Author's full name"
                  />
                </div>
                <div>
                  <Label htmlFor="author_bio">Author Bio</Label>
                  <Textarea
                    id="author_bio"
                    value={formData.author_bio}
                    onChange={(e) => setFormData({ ...formData, author_bio: e.target.value })}
                    placeholder="Brief bio about the author"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="author_website">Author Website</Label>
                  <Input
                    id="author_website"
                    value={formData.author_website}
                    onChange={(e) => setFormData({ ...formData, author_website: e.target.value })}
                    placeholder="https://authorwebsite.com"
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
                      <SelectItem value="pending">Pending Review</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add new tag..."
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} size="sm">
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