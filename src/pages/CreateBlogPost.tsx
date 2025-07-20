
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Save, Eye, X, Plus, Calendar as CalendarIcon, Clock, Send, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  description: string | null;
  color: string;
}

const CreateBlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [scheduledTime, setScheduledTime] = useState('');
  const [publishType, setPublishType] = useState('now');

  // Check if user is admin
  const isAdmin = userRole === 'admin';

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    author_name: '',
    author_bio: '',
    author_website: '',
    status: isAdmin ? 'published' : 'pending',
    timezone: 'UTC'
  });

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

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
          status: postData.status || 'pending',
          timezone: postData.timezone || 'UTC'
        });
        setSelectedTags(postData.tags || []);
        
        if (postData.scheduled_for) {
          const scheduledDate = new Date(postData.scheduled_for);
          setScheduledDate(scheduledDate);
          setScheduledTime(format(scheduledDate, 'HH:mm'));
          setPublishType('schedule');
        }
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

  const saveBlogPost = async (action: 'draft' | 'publish' | 'schedule' | 'submit') => {
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('User not authenticated');

      // Validation
      if (!formData.title || !formData.content || !formData.category || !formData.author_name) {
        throw new Error('Please fill in all required fields (title, content, category, and author name)');
      }

      // Determine status based on action and user role
      let status = 'pending';
      let scheduledFor = null;
      let publishedAt = null;

      if (action === 'draft') {
        status = 'pending';
      } else if (action === 'publish' && isAdmin) {
        status = 'published';
        publishedAt = new Date().toISOString();
      } else if (action === 'schedule' && isAdmin) {
        if (!scheduledDate || !scheduledTime) {
          throw new Error('Please select a date and time for scheduling');
        }
        
        const [hours, minutes] = scheduledTime.split(':');
        const combinedDateTime = new Date(scheduledDate);
        combinedDateTime.setHours(parseInt(hours), parseInt(minutes));
        
        if (combinedDateTime <= new Date()) {
          throw new Error('Scheduled time must be in the future');
        }
        
        status = 'pending';
        scheduledFor = combinedDateTime.toISOString();
      } else if (action === 'submit') {
        status = 'pending'; // Guest submissions always go to pending
      }

      const postData: any = {
        ...formData,
        status,
        tags: selectedTags,
        user_id: session.user.id,
        updated_at: new Date().toISOString(),
        scheduled_for: scheduledFor,
        auto_publish: action === 'schedule',
        excerpt: formData.excerpt || formData.content.substring(0, 200) + "..."
      };

      if (publishedAt) {
        postData.published_at = publishedAt;
      }

      if (id) {
        const { error } = await supabase
          .from('guest_posts')
          .update(postData)
          .eq('id', id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('guest_posts')
          .insert(postData);
        
        if (error) throw error;
      }

      let toastTitle = "Post saved!";
      let toastDescription = "Your blog post has been saved as draft.";
      
      if (action === 'publish') {
        if (isAdmin) {
          toastTitle = "Post published!";
          toastDescription = "Your blog post has been published.";
        } else {
          toastTitle = "Post submitted!";
          toastDescription = "Your post has been submitted for review.";
        }
      } else if (action === 'schedule') {
        toastTitle = "Post scheduled!";
        toastDescription = `Your blog post has been scheduled for ${format(scheduledDate!, 'PPP')} at ${scheduledTime}.`;
      } else if (action === 'submit') {
        toastTitle = "Post Submitted Successfully!";
        toastDescription = "Your guest post has been submitted for review. You'll be notified once it's approved.";
      }

      toast({
        title: toastTitle,
        description: toastDescription
      });

      navigate(isAdmin ? '/admin-dashboard' : '/dashboard');
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

  const getActionButtons = () => {
    if (isAdmin) {
      return (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => saveBlogPost('draft')}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          {publishType === 'now' ? (
            <Button
              onClick={() => saveBlogPost('publish')}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <Eye className="w-4 h-4 mr-2" />
              Publish Now
            </Button>
          ) : (
            <Button
              onClick={() => saveBlogPost('schedule')}
              disabled={loading || !scheduledDate || !scheduledTime}
              className="w-full sm:w-auto"
            >
              <Clock className="w-4 h-4 mr-2" />
              Schedule Post
            </Button>
          )}
        </div>
      );
    } else {
      return (
        <Button
          onClick={() => saveBlogPost('submit')}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </div>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Guest Post
            </>
          )}
        </Button>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(isAdmin ? "/admin-dashboard" : "/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {isAdmin 
              ? (id ? 'Edit Blog Post' : 'Create New Blog Post')
              : 'Submit Guest Post'
            }
          </h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? 'Create and manage blog posts with full publishing controls'
              : 'Share your expertise with our community'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {isAdmin ? 'Post Content' : 'Create Your Guest Post'}
                  {getActionButtons()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Post Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter an engaging title for your post"
                    className="text-lg"
                    required
                  />
                </div>

                <div>
                  <Label>Content *</Label>
                  <div className="border rounded-md">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                      modules={modules}
                      style={{ minHeight: '400px' }}
                      placeholder="Write your full post content here..."
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Minimum 500 words recommended. Use the rich editor for formatting.
                  </p>
                </div>

                <div>
                  <Label htmlFor="excerpt">Post Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Write a brief summary of your post (optional - will auto-generate if left empty)"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author_name">Author Name *</Label>
                    <Input
                      id="author_name"
                      value={formData.author_name}
                      onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="author_website">Website/Portfolio</Label>
                    <Input
                      id="author_website"
                      value={formData.author_website}
                      onChange={(e) => setFormData({ ...formData, author_website: e.target.value })}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="author_bio">Author Bio</Label>
                  <Textarea
                    id="author_bio"
                    value={formData.author_bio}
                    onChange={(e) => setFormData({ ...formData, author_bio: e.target.value })}
                    placeholder="Tell us about yourself in 2-3 sentences..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submission Guidelines for non-admin users */}
            {!isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">Submission Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Your post will be reviewed within 2-3 business days</li>
                      <li>• Original content only - no plagiarism</li>
                      <li>• Minimum 500 words for approval</li>
                      <li>• Include relevant examples and actionable advice</li>
                      <li>• Professional tone and proper grammar required</li>
                      <li>• Use the rich text editor for proper formatting</li>
                      <li>• Add relevant tags to help categorize your content</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Publish Settings - Admin Only */}
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle>Publish Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Publish Type</Label>
                    <Select value={publishType} onValueChange={setPublishType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="now">Publish Now</SelectItem>
                        <SelectItem value="schedule">Schedule for Later</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {publishType === 'schedule' && (
                    <div className="space-y-4">
                      <div>
                        <Label>Scheduled Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !scheduledDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={scheduledDate}
                              onSelect={setScheduledDate}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label htmlFor="scheduled-time">Scheduled Time</Label>
                        <Input
                          id="scheduled-time"
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label>Timezone</Label>
                        <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                            <SelectItem value="Europe/London">London Time</SelectItem>
                            <SelectItem value="Europe/Paris">Paris Time</SelectItem>
                            <SelectItem value="Asia/Tokyo">Tokyo Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {isAdmin && (
                    <div>
                      <Label>Current Status</Label>
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
                  )}
                </CardContent>
              </Card>
            )}

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle>Category *</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
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
                <p className="text-xs text-muted-foreground">
                  Add relevant tags to help categorize your content (e.g., technology, innovation, startup)
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPost;
