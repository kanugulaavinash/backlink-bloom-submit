
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { useEffect } from "react";

interface Category {
  id: string;
  name: string;
  description: string | null;
  color: string;
}

const SubmitPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: "",
    authorName: "",
    authorBio: "",
    authorWebsite: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a guest post.",
        variant: "destructive"
      });
      navigate("/signin");
      return;
    }

    // Basic validation
    if (!formData.title || !formData.content || !formData.category || !formData.authorName) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const tagsArray = formData.tags 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      const { error } = await supabase
        .from('guest_posts')
        .insert({
          user_id: user.id,
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt || formData.content.substring(0, 200) + "...",
          category: formData.category,
          tags: tagsArray,
          author_name: formData.authorName,
          author_bio: formData.authorBio,
          author_website: formData.authorWebsite
        });

      if (error) {
        console.error('Error submitting post:', error);
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your post. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Post Submitted Successfully!",
        description: "Your guest post has been submitted for review. You'll be notified once it's approved.",
      });

      // Reset form
      setFormData({
        title: "",
        content: "",
        excerpt: "",
        category: "",
        tags: "",
        authorName: "",
        authorBio: "",
        authorWebsite: ""
      });

      // Redirect to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate("/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Submit Guest Post</h1>
            <p className="text-muted-foreground">Share your expertise with our community</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create Your Guest Post</CardTitle>
              <CardDescription>
                Fill out the form below to submit your guest post for review. All fields marked with * are required.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Post Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Enter an engaging title for your post"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={handleCategoryChange} disabled={isLoading}>
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
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Post Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    placeholder="Write a brief summary of your post (optional - will auto-generate if left empty)"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Post Content *</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Write your full post content here..."
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={12}
                    required
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">
                    Minimum 500 words recommended. You can use markdown formatting.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    name="tags"
                    type="text"
                    placeholder="Enter tags separated by commas (e.g., technology, innovation, startup)"
                    value={formData.tags}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                  <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Author Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="authorName">Author Name *</Label>
                      <Input
                        id="authorName"
                        name="authorName"
                        type="text"
                        placeholder="Your full name"
                        value={formData.authorName}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="authorWebsite">Website/Portfolio</Label>
                      <Input
                        id="authorWebsite"
                        name="authorWebsite"
                        type="url"
                        placeholder="https://yourwebsite.com"
                        value={formData.authorWebsite}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="authorBio">Author Bio</Label>
                    <Textarea
                      id="authorBio"
                      name="authorBio"
                      placeholder="Tell us about yourself in 2-3 sentences..."
                      value={formData.authorBio}
                      onChange={handleInputChange}
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <h4 className="font-medium text-primary mb-2">Submission Guidelines</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your post will be reviewed within 2-3 business days</li>
                    <li>• Original content only - no plagiarism</li>
                    <li>• Minimum 500 words for approval</li>
                    <li>• Include relevant examples and actionable advice</li>
                    <li>• Professional tone and proper grammar required</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
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
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubmitPost;
