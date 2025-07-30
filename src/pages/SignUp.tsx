import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowLeft, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { signUpSchema, validateAndSanitize, sanitizeInput } from "@/lib/validationSchemas";
import { useAuthErrorHandler } from "@/components/auth/AuthErrorHandler";
import Footer from "@/components/Footer";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { handleAuthError, handleSuccess } = useAuthErrorHandler();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setFieldErrors({});
    
    // Validate form data
    const validation = validateAndSanitize(signUpSchema, formData);
    
    if (!validation.success) {
      const errors: Record<string, string> = {};
      const validationErrors = (validation as { success: false; errors: string[] }).errors;
      validationErrors.forEach(error => {
        if (error.includes("Name")) errors.name = error;
        if (error.includes("Email")) errors.email = error;
        if (error.includes("Password") && !error.includes("confirm")) errors.password = error;
        if (error.includes("match")) errors.confirmPassword = error;
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      // Sanitize inputs
      const sanitizedData = {
        name: sanitizeInput(validation.data.name),
        email: validation.data.email.toLowerCase().trim(),
        password: validation.data.password
      };

      console.log('Attempting to create user with email:', sanitizedData.email);

      const { data, error } = await supabase.auth.signUp({
        email: sanitizedData.email,
        password: sanitizedData.password,
        options: {
          data: {
            full_name: sanitizedData.name,
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      console.log('SignUp response:', { data, error });

      if (error) {
        console.error('SignUp error details:', error);
        handleAuthError(error);
        return;
      }

      if (data.user && !data.session) {
        // Email confirmation required
        handleSuccess("Account created successfully! Please check your email for verification.");
        navigate("/signin");
      } else if (data.session) {
        // User logged in immediately - verify profile was created
        console.log('User signed up and logged in immediately');
        
        // Check if profile was created properly
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          console.error('Profile verification failed:', profileError);
          handleAuthError({ message: "Account created but profile setup incomplete. Please contact support." });
          return;
        }
        
        console.log('Profile verified:', profile);
        handleSuccess("Account created and signed in successfully!");
        navigate("/dashboard");
      }
      
    } catch (error) {
      console.error('Unexpected signup error:', error);
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ""
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-background to-muted flex items-center justify-center p-4 py-6 sm:py-8">
        <div className="w-full max-w-sm sm:max-w-md">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-4 sm:mb-6 transition-colors text-sm sm:text-base">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">Join Stuffedition</CardTitle>
              <CardDescription className="text-muted-foreground text-sm sm:text-base">
                Join our community of writers and start submitting guest posts
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-4 sm:px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground text-sm">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`pl-9 sm:pl-10 h-11 sm:h-12 text-sm sm:text-base ${fieldErrors.name ? 'border-destructive' : ''}`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {fieldErrors.name && (
                    <div className="flex items-center text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                      {fieldErrors.name}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground text-sm">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pl-9 sm:pl-10 h-11 sm:h-12 text-sm sm:text-base ${fieldErrors.email ? 'border-destructive' : ''}`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {fieldErrors.email && (
                    <div className="flex items-center text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                      {fieldErrors.email}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground text-sm">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-9 sm:pl-10 h-11 sm:h-12 text-sm sm:text-base ${fieldErrors.password ? 'border-destructive' : ''}`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {fieldErrors.password && (
                    <div className="flex items-center text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                      {fieldErrors.password}
                    </div>
                  )}
                  {!fieldErrors.password && (
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters with uppercase, lowercase, number and special character
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground text-sm">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`pl-9 sm:pl-10 h-11 sm:h-12 text-sm sm:text-base ${fieldErrors.confirmPassword ? 'border-destructive' : ''}`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {fieldErrors.confirmPassword && (
                    <div className="flex items-center text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                      {fieldErrors.confirmPassword}
                    </div>
                  )}
                </div>
                
                <div className="flex items-start space-x-3">
                  <input 
                    type="checkbox" 
                    className="mt-1 rounded border-border h-4 w-4 flex-shrink-0" 
                    required 
                    disabled={isLoading}
                  />
                  <span className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:text-primary/80 underline">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:text-primary/80 underline">
                      Privacy Policy
                    </Link>
                  </span>
                </div>
                
                <Button
                  type="submit"
                  className="w-full h-11 sm:h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm sm:text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
              
              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Already have an account?{" "}
                  <Link to="/signin" className="text-primary hover:text-primary/80 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SignUp;
