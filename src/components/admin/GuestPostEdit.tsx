import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

interface GuestPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author_name: string;
  author_bio?: string;
  author_website?: string;
  category: string;
  tags?: string[];
  status: string;
}

const GuestPostEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<GuestPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState("");

  const categories = ["Technology", "Health", "Lifestyle", "Business", "Education", "Entertainment"];
  const statuses = ["pending", "approved", "rejected"];

  const fetchPost = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("guest_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
      toast({
        title: "Error",
        description: "Failed to fetch post details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleSave = async () => {
    if (!post) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from("guest_posts")
        .update({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          author_name: post.author_name,
          author_bio: post.author_bio,
          author_website: post.author_website,
          category: post.category,
          tags: post.tags,
          status: post.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post updated successfully.",
      });

      navigate(`/admin/posts/view/${post.id}`);
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: "Failed to update post.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (!newTag.trim() || !post) return;
    
    const tags = post.tags || [];
    if (!tags.includes(newTag.trim())) {
      setPost({ ...post, tags: [...tags, newTag.trim()] });
    }
    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    if (!post) return;
    const tags = post.tags || [];
    setPost({ ...post, tags: tags.filter(tag => tag !== tagToRemove) });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
              <div className="h-12 bg-muted rounded mb-6"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The post you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate("/admin")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => navigate(`/admin/posts/view/${post.id}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to View
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(post.status)}>
                {post.status}
              </Badge>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>Edit Post</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={post.title}
                    onChange={(e) => setPost({ ...post, title: e.target.value })}
                    placeholder="Post title"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={post.category} onValueChange={(value) => setPost({ ...post, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={post.status} onValueChange={(value) => setPost({ ...post, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={post.excerpt || ""}
                  onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                  placeholder="Brief description of the post"
                  rows={3}
                />
              </div>

              {/* Author Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">Author Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author_name">Author Name</Label>
                    <Input
                      id="author_name"
                      value={post.author_name}
                      onChange={(e) => setPost({ ...post, author_name: e.target.value })}
                      placeholder="Author name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="author_website">Author Website</Label>
                    <Input
                      id="author_website"
                      value={post.author_website || ""}
                      onChange={(e) => setPost({ ...post, author_website: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="author_bio">Author Bio</Label>
                  <Textarea
                    id="author_bio"
                    value={post.author_bio || ""}
                    onChange={(e) => setPost({ ...post, author_bio: e.target.value })}
                    placeholder="Brief author biography"
                    rows={3}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <h3 className="font-semibold">Tags</h3>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={post.content}
                  onChange={(e) => setPost({ ...post, content: e.target.value })}
                  placeholder="Post content"
                  rows={20}
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Word count: {post.content.split(/\s+/).length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GuestPostEdit;