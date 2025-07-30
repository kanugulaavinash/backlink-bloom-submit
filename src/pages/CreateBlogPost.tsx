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
import { Calendar, Clock, Loader2, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ContentValidationResults } from "@/components/ContentValidationResults";
import { usePaymentSuccess } from "@/hooks/usePaymentSuccess";
import Footer from "@/components/Footer";
import React, { useState, useEffect } from "react";

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
  const isAdmin = userRole === 'admin';
  
  // Handle payment success/failure
  usePaymentSuccess();

  const [post, setPost] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    author_name: "",
    author_bio: "",
    author_website: "",
    status: "pending" as const,
    scheduled_for: null as string | null,
    timezone: "UTC",
    auto_publish: false,
  });
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  
  // New states for validation and payment flow
  const [submissionStep, setSubmissionStep] = useState(1); // 1=form, 2=validation, 3=payment, 4=complete
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [submissionFee, setSubmissionFee] = useState(500); // $5.00 in cents
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchSubmissionFee();
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

  const fetchSubmissionFee = async () => {
    try {
      const { data, error } = await supabase
        .from("system_settings")
        .select("setting_value")
        .eq("setting_key", "guest_post_submission_fee")
        .single();

      if (error) throw error;
      if (data) {
        setSubmissionFee(parseInt(data.setting_value));
      }
    } catch (error) {
      console.error("Error fetching submission fee:", error);
    }
  };

  const fetchBlogPost = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from("guest_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setPost({
          title: data.title || "",
          content: data.content || "",
          excerpt: data.excerpt || "",
          category: data.category || "",
          author_name: data.author_name || "",
          author_bio: data.author_bio || "",
          author_website: data.author_website || "",
          status: (data.status as "pending") || "pending",
          scheduled_for: data.scheduled_for,
          timezone: data.timezone || "UTC",
          auto_publish: data.auto_publish || false,
        });
        setTags(data.tags || []);
        setSubmissionStep(data.submission_step || 1);
        
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

  const validateContent = async (postId: string) => {
    setIsValidating(true);
    console.log(`Starting content validation for post: ${postId}`);
    
    try {
      // Run both plagiarism and AI detection in parallel
      const [plagiarismResponse, aiResponse] = await Promise.all([
        supabase.functions.invoke('plagiarism-check', {
          body: { postId, content: post.content }
        }),
        supabase.functions.invoke('ai-content-detection', {
          body: { postId, content: post.content }
        })
      ]);

      console.log('Validation responses:', { 
        plagiarism: plagiarismResponse, 
        ai: aiResponse 
      });

      // Check for function invocation errors
      if (plagiarismResponse.error) {
        console.error('Plagiarism check error:', plagiarismResponse.error);
        throw new Error(`Plagiarism check failed: ${plagiarismResponse.error.message}`);
      }
      if (aiResponse.error) {
        console.error('AI detection error:', aiResponse.error);
        throw new Error(`AI detection failed: ${aiResponse.error.message}`);
      }

      // Wait a moment for database updates to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Fetch combined validation results with retry
      let validationData = null;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts && !validationData) {
        const { data, error: fetchError } = await supabase
          .from('validation_results')
          .select('*')
          .eq('post_id', postId)
          .single();

        if (!fetchError && data) {
          validationData = data;
          break;
        }

        attempts++;
        if (attempts < maxAttempts) {
          console.log(`Retrying validation fetch (attempt ${attempts + 1})`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          throw new Error('Failed to fetch validation results after multiple attempts');
        }
      }

      console.log('Validation data fetched:', validationData);
      setValidationResult(validationData);
      
      // Check if validation passed
      const plagiarismPassed = (validationData.plagiarism_score || 0) <= 20;
      const aiContentPassed = (validationData.ai_content_score || 0) <= 30;
      
      if (plagiarismPassed && aiContentPassed) {
        setSubmissionStep(3); // Proceed to payment
        toast({
          title: "Validation Passed",
          description: "Your content is ready for payment and submission!",
        });
      } else {
        toast({
          title: "Content Issues Found",
          description: "Please review the highlighted content and make necessary edits.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast({
        title: "Validation Error",
        description: error instanceof Error ? error.message : "Failed to validate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const processPayment = async (postId: string) => {
    setPaymentProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          postId, 
          amount: submissionFee 
        }
      });

      if (error) throw error;

      // Redirect to Stripe checkout
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPaymentProcessing(false);
    }
  };

  const saveBlogPost = async (action: 'draft' | 'publish' | 'schedule' | 'submit') => {
    setLoading(true);
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
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      if (!isAdmin && (!post.author_name.trim() || !post.author_bio.trim())) {
        toast({
          title: "Error",
          description: "Please fill in author information",
          variant: "destructive",
        });
        return;
      }

      // For guest submission, start validation flow
      if (action === 'submit' && !isAdmin) {
        // Determine status based on user role and action
        let status = "pending";
        
        // Prepare post data for guest submission
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
          submission_step: 2, // Start at validation step
          validation_status: 'pending',
          payment_status: 'pending',
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

        const postId = response.data.id;
        setSubmissionStep(2);
        
        // If it's a new post, update the URL
        if (!id) {
          navigate(`/create-blog-post/${postId}`, { replace: true });
        }

        // Start content validation
        await validateContent(postId);
        return;
      }

      // Regular save/publish flow for admins
      let status = "pending";
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
        scheduled_for: action === "schedule" && scheduledDateTime ? 
          new Date(scheduledDateTime).toISOString() : null,
        timezone: post.timezone,
        auto_publish: post.auto_publish,
        published_at: action === "publish" && isAdmin ? new Date().toISOString() : null,
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

      const actionText = action === 'schedule' ? 'scheduled' : 
                        action === 'publish' ? 'published' : 'saved as draft';

      toast({
        title: "Success",
        description: `Blog post ${actionText} successfully!`,
      });

      if (action === 'publish') {
        navigate("/");
      } else if (!id) {
        navigate(`/create-blog-post/${response.data.id}`);
      }
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast({
        title: "Error",
        description: "Failed to save blog post. Please try again.",
        variant: "destructive",
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
        <div className="flex gap-2">
          <Button 
            onClick={() => saveBlogPost('draft')} 
            disabled={loading}
            variant="outline"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Draft
          </Button>
          <Button 
            onClick={() => saveBlogPost('publish')} 
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Publish Now
          </Button>
          {isScheduled && (
            <Button 
              onClick={() => saveBlogPost('schedule')} 
              disabled={loading}
              variant="secondary"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Schedule Post
            </Button>
          )}
        </div>
      );
    } else {
      // Guest submission flow based on step
      switch (submissionStep) {
        case 1:
          return (
            <Button 
              onClick={() => saveBlogPost('submit')} 
              disabled={loading}
              className="w-full"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit for Review
            </Button>
          );
        case 2:
          return (
            <Button 
              onClick={() => validateContent(id!)} 
              disabled={isValidating}
              className="w-full"
            >
              {isValidating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isValidating ? "Validating Content..." : "Retry Validation"}
            </Button>
          );
        case 3:
          const canProceedToPayment = validationResult && 
            (validationResult.plagiarism_score || 0) <= 20 && 
            (validationResult.ai_content_score || 0) <= 30;
          
          return (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Submission fee: <span className="font-semibold">${(submissionFee / 100).toFixed(2)}</span>
                </p>
              </div>
              <Button 
                onClick={() => processPayment(id!)} 
                disabled={paymentProcessing || !canProceedToPayment}
                className="w-full"
              >
                {paymentProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {paymentProcessing ? "Processing..." : `Pay $${(submissionFee / 100).toFixed(2)} & Submit`}
              </Button>
            </div>
          );
        default:
          return null;
      }
    }
  };

  return (
    <div>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>
              {id ? "Edit Blog Post" : "Create New Blog Post"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Content Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={post.title}
                  onChange={(e) => setPost({ ...post, title: e.target.value })}
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <ReactQuill
                  theme="snow"
                  value={post.content}
                  onChange={(content) => setPost({ ...post, content })}
                  modules={modules}
                  style={{ height: '300px', marginBottom: '50px' }}
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={post.excerpt}
                  onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                  placeholder="Brief description of the post"
                  rows={3}
                />
              </div>
            </div>

            <Separator />

            {/* Author Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Author Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author_name">Author Name *</Label>
                  <Input
                    id="author_name"
                    value={post.author_name}
                    onChange={(e) => setPost({ ...post, author_name: e.target.value })}
                    placeholder="Author name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="author_website">Author Website</Label>
                  <Input
                    id="author_website"
                    value={post.author_website}
                    onChange={(e) => setPost({ ...post, author_website: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="author_bio">Author Bio *</Label>
                <Textarea
                  id="author_bio"
                  value={post.author_bio}
                  onChange={(e) => setPost({ ...post, author_bio: e.target.value })}
                  placeholder="Brief bio of the author"
                  rows={3}
                  required
                />
              </div>
            </div>

            <Separator />

            {/* Publishing Settings */}
            {isAdmin && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Publishing Settings</h3>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="scheduled"
                    checked={isScheduled}
                    onCheckedChange={setIsScheduled}
                  />
                  <Label htmlFor="scheduled">Schedule for later</Label>
                </div>
                
                {isScheduled && (
                  <div>
                    <Label htmlFor="scheduled_datetime">Scheduled Date & Time</Label>
                    <Input
                      id="scheduled_datetime"
                      type="datetime-local"
                      value={scheduledDateTime}
                      onChange={(e) => setScheduledDateTime(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}

            <Separator />

            {/* Category and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={post.category} onValueChange={(value) => setPost({ ...post, category: value })}>
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
              </div>

              <div>
                <Label>Tags</Label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
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
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Validation Results - only for guest users after submission */}
            {!isAdmin && submissionStep >= 2 && (
              <div className="mt-6">
                <ContentValidationResults
                  validationResult={validationResult}
                  isValidating={isValidating}
                  onRetryValidation={() => id && validateContent(id)}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons at Bottom */}
        <div className="mt-6 sticky bottom-4">
          <Card className="border-2 border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <CardContent className="p-4">
              {getActionButtons()}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateBlogPost;
