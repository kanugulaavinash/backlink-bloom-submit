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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
            <CardDescription className="text-gray-600">
              Join our community of writers and start submitting guest posts
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`pl-10 h-12 ${fieldErrors.name ? 'border-red-500' : ''}`}
                    required
                    disabled={isLoading}
                  />
                </div>
                {fieldErrors.name && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {fieldErrors.name}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 h-12 ${fieldErrors.email ? 'border-red-500' : ''}`}
                    required
                    disabled={isLoading}
                  />
                </div>
                {fieldErrors.email && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {fieldErrors.email}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 h-12 ${fieldErrors.password ? 'border-red-500' : ''}`}
                    required
                    disabled={isLoading}
                  />
                </div>
                {fieldErrors.password && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {fieldErrors.password}
                  </div>
                )}
                {!fieldErrors.password && (
                  <p className="text-xs text-gray-500">
                    Password must be at least 8 characters with uppercase, lowercase, number and special character
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pl-10 h-12 ${fieldErrors.confirmPassword ? 'border-red-500' : ''}`}
                    required
                    disabled={isLoading}
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {fieldErrors.confirmPassword}
                  </div>
                )}
              </div>
              
              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox" 
                  className="mt-1 rounded border-gray-300" 
                  required 
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-700">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
                    Privacy Policy
                  </Link>
                </span>
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
