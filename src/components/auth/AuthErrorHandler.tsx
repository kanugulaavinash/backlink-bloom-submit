
import { useToast } from "@/hooks/use-toast";

interface AuthError {
  message: string;
  status?: number;
}

export const useAuthErrorHandler = () => {
  const { toast } = useToast();

  const handleAuthError = (error: AuthError | any) => {
    console.error('Auth error:', error);
    
    let title = "Authentication Error";
    let description = "An unexpected error occurred. Please try again.";

    if (error?.message) {
      // Handle specific Supabase auth errors
      if (error.message.includes("User already registered")) {
        title = "Account Already Exists";
        description = "An account with this email already exists. Please sign in instead.";
      } else if (error.message.includes("Invalid email")) {
        title = "Invalid Email";
        description = "Please enter a valid email address.";
      } else if (error.message.includes("Password")) {
        title = "Password Error";
        description = "Password must be at least 6 characters long.";
      } else if (error.message.includes("Database error")) {
        title = "Registration Error";
        description = "There was an issue creating your account. Please try again in a moment.";
      } else if (error.message.includes("Email not confirmed")) {
        title = "Email Verification Required";
        description = "Please check your email and click the confirmation link.";
      } else if (error.message.includes("Database error saving new user")) {
        title = "Account Setup Error";
        description = "Your account was created but there was an issue setting up your profile. Please contact support if this persists.";
      } else if (error.message.includes("Failed to create user profile")) {
        title = "Profile Creation Failed";
        description = "There was an issue creating your user profile. Please try again or contact support.";
      } else {
        description = error.message;
      }
    }

    toast({
      title,
      description,
      variant: "destructive"
    });
  };

  const handleSuccess = (message: string) => {
    toast({
      title: "Success!",
      description: message,
    });
  };

  return { handleAuthError, handleSuccess };
};
