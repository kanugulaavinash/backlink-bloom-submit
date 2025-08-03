import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar, Clock, Loader2, Plus, X, Eye, Save, Upload, Image, Edit, Globe, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactQuill from 'react-quill';
import Editor from '@monaco-editor/react';
import 'react-quill/dist/quill.snow.css';

interface Category {
  id: string;
  name: string;
  description: string | null;
  color: string;
}

interface PostData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author_name: string;
  author_bio: string;
  author_website: string;
  status: "draft" | "published" | "scheduled" | "pending";
  scheduled_for: string | null;
  timezone: string;
  auto_publish: boolean;
  featured_image_url?: string;
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  custom_permalink?: string;
}

const EnhancedPostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole } = useAuth();
  const isAdmin = userRole === 'admin';
  
  // Core states
  const [post, setPost] = useState<PostData>({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    author_name: "",
    author_bio: "",
    author_website: "",
    status: "draft",
    scheduled_for: null,
    timezone: "UTC",
    auto_publish: false,
    featured_image_url: "",
    meta_title: "",
    meta_description: "",
    focus_keyword: "",
    custom_permalink: "",
  });
  
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  
  // Editor states
  const [editorMode, setEditorMode] = useState<"visual" | "code">("visual");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingPermalink, setEditingPermalink] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  
  // Image upload states
  const [featuredImageUploading, setFeaturedImageUploading] = useState(false);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!post.title.trim() || !post.content.trim()) return;
    
    setAutoSaving(true);
    try {
      await saveBlogPost("draft", true);
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setAutoSaving(false);
    }
  }, [post, tags]);

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (id && (post.title.trim() || post.content.trim())) {
        autoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(timer);
  }, [post, tags, autoSave, id]);

  // Word count and reading time calculation
  useEffect(() => {
    const text = post.content.replace(/<[^>]*>/g, ''); // Strip HTML
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setReadingTime(Math.ceil(words.length / 200)); // 200 words per minute
  }, [post.content]);

  // Generate permalink from title
  useEffect(() => {
    if (!post.custom_permalink && post.title) {
      const slug = post.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
      setPost(prev => ({ ...prev, custom_permalink: slug }));
    }
  }, [post.title, post.custom_permalink]);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  };

  const fetchBlogPost = async () => {
    if (!id) return;
    
    try {
      // Try guest_posts first, then imported_posts
      let { data: guestData, error: guestError } = await supabase
        .from("guest_posts")
        .select("*")
        .eq("id", id)
        .single();

      let data: any = null;
      let isImportedPost = false;

      if (guestError && guestError.code === "PGRST116") {
        // Try imported_posts if not found in guest_posts
        const { data: importedData, error: importedError } = await supabase
          .from("imported_posts")
          .select("*")
          .eq("id", id)
          .single();
        
        if (importedError) throw importedError;
        data = importedData;
        isImportedPost = true;
      } else if (guestError) {
        throw guestError;
      } else {
        data = guestData;
      }

      if (data) {
        // Validate status or set default
        const validStatuses: ("draft" | "published" | "scheduled" | "pending")[] = ["draft", "published", "scheduled", "pending"];
        const status = validStatuses.includes(data.status) ? data.status : "draft";

        setPost({
          title: data.title || "",
          content: data.content || "",
          excerpt: data.excerpt || "",
          category: isImportedPost ? (Array.isArray(data.categories) ? data.categories[0] || "" : "") : (data.category || ""),
          author_name: data.author_name || (isImportedPost ? "Imported Author" : ""),
          author_bio: data.author_bio || "",
          author_website: data.author_website || "",
          status: status,
          scheduled_for: data.scheduled_for || null,
          timezone: data.timezone || "UTC",
          auto_publish: data.auto_publish || false,
          featured_image_url: data.featured_image_url || "",
          meta_title: data.meta_title || "",
          meta_description: data.meta_description || "",
          focus_keyword: data.focus_keyword || "",
          custom_permalink: data.custom_permalink || data.slug || "",
        });
        setTags(data.tags || []);
        
        if (data.scheduled_for) {
          setScheduledDateTime(data.scheduled_for);
          setIsScheduled(true);
        }
      }
    } catch (error) {
      console.error("Error fetching blog post:", error);
      toast({
        title: "Error",
        description: "Failed to fetch blog post",
        variant: "destructive",
      });
    }
  };

  const uploadFeaturedImage = async (file: File) => {
    setFeaturedImageUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `featured-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setPost(prev => ({ ...prev, featured_image_url: publicUrl }));
      
      toast({
        title: "Success",
        description: "Featured image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload featured image",
        variant: "destructive",
      });
    } finally {
      setFeaturedImageUploading(false);
    }
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    
    if (!tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const saveBlogPost = async (action: 'draft' | 'publish' | 'schedule', isAutoSave = false) => {
    if (!isAutoSave) setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please sign in to continue",
          variant: "destructive",
        });
        return;
      }

      // Validation
      if (!post.title.trim() || !post.content.trim() || !post.category.trim()) {
        if (!isAutoSave) {
          toast({
            title: "Error",
            description: "Please fill in all required fields",
            variant: "destructive",
          });
        }
        return;
      }

      let status = post.status;
      if (isAdmin) {
        if (action === "publish") {
          status = "published";
        } else if (action === "schedule") {
          status = "scheduled";
        } else {
          status = "draft";
        }
      }

      const postData = {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        category: post.category,
        tags: tags,
        user_id: user.id,
        status: status,
        author_name: post.author_name,
        author_bio: post.author_bio,
        author_website: post.author_website,
        featured_image_url: post.featured_image_url,
        meta_title: post.meta_title,
        meta_description: post.meta_description,
        focus_keyword: post.focus_keyword,
        custom_permalink: post.custom_permalink,
        ...(action === "schedule" && isScheduled && scheduledDateTime ? {
          scheduled_for: scheduledDateTime,
          timezone: post.timezone,
          auto_publish: post.auto_publish,
        } : {}),
      };

      let response;
      if (id) {
        response = await supabase
          .from("guest_posts")
          .update(postData)
          .eq("id", id)
          .select()
          .single();
      } else {
        response = await supabase
          .from("guest_posts")
          .insert(postData)
          .select()
          .single();
      }

      if (response.error) throw response.error;

      if (!isAutoSave) {
        toast({
          title: "Success",
          description: `Post ${action === 'publish' ? 'published' : action === 'schedule' ? 'scheduled' : 'saved'} successfully`,
        });

        if (!id) {
          navigate(`/admin/post/edit/${response.data.id}`, { replace: true });
        }
      }
    } catch (error) {
      console.error("Error saving blog post:", error);
      if (!isAutoSave) {
        toast({
          title: "Error",
          description: "Failed to save blog post",
          variant: "destructive",
        });
      }
    } finally {
      if (!isAutoSave) setLoading(false);
    }
  };

  // ReactQuill modules with enhanced toolbar
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  };

  const handleContentChange = (content: string) => {
    setPost(prev => ({ ...prev, content }));
  };

  const PreviewContent = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold mb-4">{post.title || "Untitled Post"}</h1>
        <div className="text-muted-foreground mb-6">
          <p>By {post.author_name || "Unknown Author"}</p>
          <p>{wordCount} words • {readingTime} min read</p>
        </div>
        {post.featured_image_url && (
          <img 
            src={post.featured_image_url} 
            alt="Featured" 
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/admin')}>
                ← Back to Admin
              </Button>
              <div className="flex items-center gap-2">
                {autoSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                <span className="text-sm text-muted-foreground">
                  {autoSaving ? "Auto-saving..." : "All changes saved"}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Post Preview</DialogTitle>
                  </DialogHeader>
                  <PreviewContent />
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => saveBlogPost("draft")}
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              
              {isAdmin && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => saveBlogPost("schedule")}
                    disabled={loading || !isScheduled}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={() => saveBlogPost("publish")}
                    disabled={loading}
                  >
                    Publish
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Title and Permalink */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Add title"
                      value={post.title}
                      onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
                      className="text-3xl font-bold border-0 p-0 focus-visible:ring-0 placeholder:text-muted-foreground"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <span>Permalink:</span>
                    {editingPermalink ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={post.custom_permalink}
                          onChange={(e) => setPost(prev => ({ ...prev, custom_permalink: e.target.value }))}
                          className="h-6 text-sm"
                        />
                        <Button size="sm" variant="ghost" onClick={() => setEditingPermalink(false)}>
                          OK
                        </Button>
                      </div>
                    ) : (
                      <button 
                        className="text-primary hover:underline"
                        onClick={() => setEditingPermalink(true)}
                      >
                        /blog/{post.custom_permalink || "your-post-url"}
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Content</CardTitle>
                  <Tabs value={editorMode} onValueChange={(value) => setEditorMode(value as "visual" | "code")}>
                    <TabsList className="grid w-[200px] grid-cols-2">
                      <TabsTrigger value="visual">Visual</TabsTrigger>
                      <TabsTrigger value="code">Code</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                {editorMode === "visual" ? (
                  <ReactQuill
                    theme="snow"
                    value={post.content}
                    onChange={handleContentChange}
                    modules={quillModules}
                    style={{ minHeight: '400px' }}
                  />
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <Editor
                      height="400px"
                      defaultLanguage="html"
                      value={post.content}
                      onChange={(value) => handleContentChange(value || "")}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: 'on',
                      }}
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>{wordCount} words</span>
                    <span>{readingTime} min read</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Add Media
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Excerpt */}
            <Card>
              <CardHeader>
                <CardTitle>Excerpt</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write an excerpt..."
                  value={post.excerpt}
                  onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* SEO Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  SEO Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta-title">Meta Title</Label>
                  <Input
                    id="meta-title"
                    placeholder="SEO title..."
                    value={post.meta_title}
                    onChange={(e) => setPost(prev => ({ ...prev, meta_title: e.target.value }))}
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {post.meta_title?.length || 0}/60 characters
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Textarea
                    id="meta-description"
                    placeholder="SEO description..."
                    value={post.meta_description}
                    onChange={(e) => setPost(prev => ({ ...prev, meta_description: e.target.value }))}
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {post.meta_description?.length || 0}/160 characters
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="focus-keyword">Focus Keyword</Label>
                  <Input
                    id="focus-keyword"
                    placeholder="Primary keyword..."
                    value={post.focus_keyword}
                    onChange={(e) => setPost(prev => ({ ...prev, focus_keyword: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Publishing Options */}
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Status</Label>
                  <Select value={post.status} onValueChange={(value) => setPost(prev => ({ ...prev, status: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending Review</SelectItem>
                      {isAdmin && <SelectItem value="published">Published</SelectItem>}
                      {isAdmin && <SelectItem value="scheduled">Scheduled</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>

                {isAdmin && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="schedule"
                        checked={isScheduled}
                        onCheckedChange={setIsScheduled}
                      />
                      <Label htmlFor="schedule">Schedule for later</Label>
                    </div>
                    
                    {isScheduled && (
                      <Input
                        type="datetime-local"
                        value={scheduledDateTime}
                        onChange={(e) => setScheduledDateTime(e.target.value)}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                {post.featured_image_url ? (
                  <div className="space-y-2">
                    <img 
                      src={post.featured_image_url} 
                      alt="Featured" 
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPost(prev => ({ ...prev, featured_image_url: "" }))}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadFeaturedImage(file);
                      }}
                      className="hidden"
                      id="featured-image"
                    />
                    <label htmlFor="featured-image">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={featuredImageUploading}
                        asChild
                      >
                        <span>
                          {featuredImageUploading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Image className="h-4 w-4 mr-2" />
                          )}
                          Set Featured Image
                        </span>
                      </Button>
                    </label>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={post.category} onValueChange={(value) => setPost(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
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
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button size="sm" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button onClick={() => removeTag(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Author Information */}
            <Card>
              <CardHeader>
                <CardTitle>Author</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="author-name">Name</Label>
                  <Input
                    id="author-name"
                    value={post.author_name}
                    onChange={(e) => setPost(prev => ({ ...prev, author_name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="author-bio">Bio</Label>
                  <Textarea
                    id="author-bio"
                    value={post.author_bio}
                    onChange={(e) => setPost(prev => ({ ...prev, author_bio: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="author-website">Website</Label>
                  <Input
                    id="author-website"
                    value={post.author_website}
                    onChange={(e) => setPost(prev => ({ ...prev, author_website: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <MediaSelectorComponent />
    </div>
  );
};

export default EnhancedPostEditor;