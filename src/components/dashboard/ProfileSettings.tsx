
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { profileSettingsSchema, passwordChangeSchema, validateAndSanitize, sanitizeInput } from "@/lib/validationSchemas";
import { sanitizer } from "@/lib/sanitization";

const ProfileSettings = () => {
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    bio: "Content writer and marketing enthusiast with 5+ years of experience in digital marketing."
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setFieldErrors({});
    
    // Validate form data
    const validation = validateAndSanitize(profileSettingsSchema, profileData);
    
    if (!validation.success) {
      const errors: Record<string, string> = {};
      const validationErrors = (validation as { success: false; errors: string[] }).errors;
      validationErrors.forEach(error => {
        if (error.includes("First name")) errors.firstName = error;
        if (error.includes("Last name")) errors.lastName = error;
        if (error.includes("Email")) errors.email = error;
        if (error.includes("Bio")) errors.bio = error;
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    
    try {
      // Sanitize inputs
      const sanitizedData = {
        firstName: sanitizeInput(validation.data.firstName),
        lastName: sanitizeInput(validation.data.lastName),
        email: validation.data.email.toLowerCase().trim(),
        bio: validation.data.bio ? sanitizer.sanitizeText(validation.data.bio) : ""
      };

      // Here you would typically make an API call to update the profile
      console.log("Updating profile with:", sanitizedData);
      
      toast({
        title: "Success!",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setFieldErrors({});
    
    // Validate form data
    const validation = validateAndSanitize(passwordChangeSchema, passwordData);
    
    if (!validation.success) {
      const errors: Record<string, string> = {};
      const validationErrors = (validation as { success: false; errors: string[] }).errors;
      validationErrors.forEach(error => {
        if (error.includes("Current password")) errors.currentPassword = error;
        if (error.includes("New password") && !error.includes("match")) errors.newPassword = error;
        if (error.includes("match")) errors.confirmNewPassword = error;
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    
    try {
      // Here you would typically make an API call to change the password
      console.log("Changing password...");
      
      toast({
        title: "Success!",
        description: "Password updated successfully.",
      });
      
      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
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

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
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
    <div className="space-y-6">
      {/* Profile Photo */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>Update your profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div className="space-y-2">
              <Button variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
              <p className="text-sm text-gray-500">
                JPG, GIF or PNG. Max size of 800K
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileInputChange}
                  className={fieldErrors.firstName ? 'border-red-500' : ''}
                />
                {fieldErrors.firstName && (
                  <p className="text-sm text-red-600">{fieldErrors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileInputChange}
                  className={fieldErrors.lastName ? 'border-red-500' : ''}
                />
                {fieldErrors.lastName && (
                  <p className="text-sm text-red-600">{fieldErrors.lastName}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                value={profileData.email}
                onChange={handleProfileInputChange}
                className={fieldErrors.email ? 'border-red-500' : ''}
              />
              {fieldErrors.email && (
                <p className="text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                name="bio"
                placeholder="Tell us about yourself..."
                className={`min-h-[100px] ${fieldErrors.bio ?  'border-red-500' : ''}`}
                value={profileData.bio}
                onChange={handleProfileInputChange}
              />
              {fieldErrors.bio && (
                <p className="text-sm text-red-600">{fieldErrors.bio}</p>
              )}
              <p className="text-xs text-gray-500">
                Maximum 500 characters. HTML tags will be removed.
              </p>
            </div>
            
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input 
                id="currentPassword" 
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
                className={fieldErrors.currentPassword ? 'border-red-500' : ''}
              />
              {fieldErrors.currentPassword && (
                <p className="text-sm text-red-600">{fieldErrors.currentPassword}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input 
                id="newPassword" 
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                className={fieldErrors.newPassword ? 'border-red-500' : ''}
              />
              {fieldErrors.newPassword && (
                <p className="text-sm text-red-600">{fieldErrors.newPassword}</p>
              )}
              {!fieldErrors.newPassword && (
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters with uppercase, lowercase, number and special character
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input 
                id="confirmNewPassword" 
                name="confirmNewPassword"
                type="password"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordInputChange}
                className={fieldErrors.confirmNewPassword ? 'border-red-500' : ''}
              />
              {fieldErrors.confirmNewPassword && (
                <p className="text-sm text-red-600">{fieldErrors.confirmNewPassword}</p>
              )}
            </div>
            
            <Button 
              type="submit"
              variant="outline"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
