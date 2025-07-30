
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Shield, Bot, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const PricingSettings = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    basePrice: 5,
    currency: "USD",
    dynamicPricing: false,
    plagiarismThreshold: 5,
    aiContentThreshold: 20,
    minBacklinks: 1,
    maxBacklinks: 2,
    minImages: 2
  });

  // Fetch current API keys and settings
  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('custom_select', { query: 'api_keys' });
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch system settings
  const { data: systemSettings } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value');
      if (error) throw error;
      
      const settings: Record<string, string> = {};
      data?.forEach(setting => {
        settings[setting.setting_key] = setting.setting_value;
      });
      return settings;
    }
  });

  // Update system settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Record<string, string>) => {
      const promises = Object.entries(newSettings).map(([key, value]) =>
        supabase
          .from('system_settings')
          .upsert({ setting_key: key, setting_value: value })
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
      toast({
        title: "Settings Updated",
        description: "System settings have been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate({
      base_price: formData.basePrice.toString(),
      currency: formData.currency,
      dynamic_pricing: formData.dynamicPricing.toString(),
      plagiarism_threshold: formData.plagiarismThreshold.toString(),
      ai_content_threshold: formData.aiContentThreshold.toString(),
      min_backlinks: formData.minBacklinks.toString(),
      max_backlinks: formData.maxBacklinks.toString(),
      min_images: formData.minImages.toString()
    });
  };

  const getApiKeyStatus = (serviceName: string, keyName: string) => {
    if (!apiKeys) return false;
    
    const key = apiKeys.find((k: any) => {
      const result = k.result;
      if (typeof result === 'object' && result !== null && !Array.isArray(result)) {
        return (result as any).service_name === serviceName && (result as any).key_name === keyName;
      }
      return false;
    });
    
    if (key && typeof key.result === 'object' && key.result !== null && !Array.isArray(key.result)) {
      return (key.result as any).is_configured || false;
    }
    
    return false;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pricing Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Submission Pricing</CardTitle>
          <CardDescription>Configure guest post submission costs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Submission Price</Label>
              <Input 
                id="basePrice" 
                type="number" 
                value={formData.basePrice}
                onChange={(e) => setFormData({...formData, basePrice: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input 
                id="currency" 
                value={formData.currency}
                onChange={(e) => setFormData({...formData, currency: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="dynamicPricing" 
              checked={formData.dynamicPricing}
              onCheckedChange={(checked) => setFormData({...formData, dynamicPricing: checked})}
            />
            <Label htmlFor="dynamicPricing">Enable dynamic pricing based on category</Label>
          </div>
          
          <Button 
            onClick={handleSaveSettings}
            disabled={updateSettingsMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {updateSettingsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Pricing Settings
          </Button>
        </CardContent>
      </Card>

      {/* Validation Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Content Validation Rules</CardTitle>
          <CardDescription>Configure automatic validation thresholds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plagiarismThreshold">Max Plagiarism Score (%)</Label>
              <Input 
                id="plagiarismThreshold" 
                type="number" 
                value={formData.plagiarismThreshold}
                onChange={(e) => setFormData({...formData, plagiarismThreshold: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aiContentThreshold">Max AI Content Score (%)</Label>
              <Input 
                id="aiContentThreshold" 
                type="number" 
                value={formData.aiContentThreshold}
                onChange={(e) => setFormData({...formData, aiContentThreshold: Number(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minBacklinks">Minimum Backlinks</Label>
              <Input 
                id="minBacklinks" 
                type="number" 
                value={formData.minBacklinks}
                onChange={(e) => setFormData({...formData, minBacklinks: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxBacklinks">Maximum Backlinks</Label>
              <Input 
                id="maxBacklinks" 
                type="number" 
                value={formData.maxBacklinks}
                onChange={(e) => setFormData({...formData, maxBacklinks: Number(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="minImages">Minimum Images Required</Label>
            <Input 
              id="minImages" 
              type="number" 
              value={formData.minImages}
              onChange={(e) => setFormData({...formData, minImages: Number(e.target.value)})}
            />
          </div>
          
          <Button 
            onClick={handleSaveSettings}
            disabled={updateSettingsMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {updateSettingsMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Validation Rules
          </Button>
        </CardContent>
      </Card>

      {/* Payment Platform Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Platform Integrations
          </CardTitle>
          <CardDescription>Configure payment gateways for guest post submissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Razorpay Integration - Priority */}
          <div className="border rounded-lg p-4 space-y-4 bg-gradient-to-r from-indigo-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-lg">Razorpay</h4>
                <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-300">
                  Primary Gateway
                </Badge>
                <Badge variant={getApiKeyStatus('Razorpay', 'key_id') ? "outline" : "destructive"} 
                       className={getApiKeyStatus('Razorpay', 'key_id') ? "text-green-600" : "text-red-600"}>
                  {getApiKeyStatus('Razorpay', 'key_id') ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                  {getApiKeyStatus('Razorpay', 'key_id') ? 'Connected' : 'Not Connected'}
                </Badge>
              </div>
              <Switch defaultChecked />
            </div>
            <p className="text-sm text-muted-foreground">
              Primary payment gateway for India. Supports INR payments, UPI, cards, and digital wallets.
            </p>
          </div>

          {/* PayPal Integration - Secondary */}
          <div className="border rounded-lg p-4 space-y-4 opacity-75">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">PayPal</h4>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant={getApiKeyStatus('PayPal', 'client_id') ? "outline" : "destructive"} 
                       className={getApiKeyStatus('PayPal', 'client_id') ? "text-green-600" : "text-red-600"}>
                  {getApiKeyStatus('PayPal', 'client_id') ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                  {getApiKeyStatus('PayPal', 'client_id') ? 'Connected' : 'Not Connected'}
                </Badge>
              </div>
              <Switch />
            </div>
            <p className="text-sm text-muted-foreground">
              Alternative global payment gateway for international submissions.
            </p>
          </div>

          {/* Stripe Integration - Secondary */}
          <div className="border rounded-lg p-4 space-y-4 opacity-75">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Stripe</h4>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant={getApiKeyStatus('Stripe', 'secret_key') ? "outline" : "destructive"} 
                       className={getApiKeyStatus('Stripe', 'secret_key') ? "text-green-600" : "text-red-600"}>
                  {getApiKeyStatus('Stripe', 'secret_key') ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                  {getApiKeyStatus('Stripe', 'secret_key') ? 'Connected' : 'Not Connected'}
                </Badge>
              </div>
              <Switch />
            </div>
            <p className="text-sm text-muted-foreground">
              Credit card processing for global payments.
            </p>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700">
            Save Payment Settings
          </Button>
        </CardContent>
      </Card>

      {/* Plagiarism Checker Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Plagiarism Checker Tools
          </CardTitle>
          <CardDescription>Configure plagiarism detection services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Copyscape Integration */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Copyscape</h4>
                <Badge variant="outline" className="text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <Switch checked={getApiKeyStatus('paypal', 'client_id')} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="copyscapeUsername">Username</Label>
                <Input id="copyscapeUsername" placeholder="Copyscape Username" defaultValue="user123" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="copyscapeApiKey">API Key</Label>
                <Input id="copyscapeApiKey" type="password" placeholder="Copyscape API Key" defaultValue="••••••••" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="copyscapeCredits">Current Credits</Label>
              <div className="p-2 bg-muted rounded text-sm">245 credits remaining</div>
            </div>
          </div>

          {/* Grammarly Integration */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Grammarly Business API</h4>
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Inactive
                </Badge>
              </div>
              <Switch checked={getApiKeyStatus('stripe', 'publishable_key')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grammarlyApiKey">API Key</Label>
              <Input id="grammarlyApiKey" type="password" placeholder="Grammarly API Key" />
            </div>
          </div>

          {/* Turnitin Integration */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Turnitin</h4>
                <Badge variant="secondary">
                  Setup Required
                </Badge>
              </div>
              <Switch />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="turnitinAccountId">Account ID</Label>
                <Input id="turnitinAccountId" placeholder="Turnitin Account ID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="turnitinSecretKey">Secret Key</Label>
                <Input id="turnitinSecretKey" type="password" placeholder="Turnitin Secret Key" />
              </div>
            </div>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700">
            Save Plagiarism Settings
          </Button>
        </CardContent>
      </Card>

      {/* AI Content Detector Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Content Detector Tools
          </CardTitle>
          <CardDescription>Configure AI-generated content detection services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* GPTZero Integration */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">GPTZero</h4>
                <Badge variant="outline" className="text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gptzeroApiKey">API Key</Label>
              <Input id="gptzeroApiKey" type="password" placeholder="GPTZero API Key" defaultValue="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gptzeroModel">Detection Model</Label>
              <Select defaultValue="base">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="base">Base Model</SelectItem>
                  <SelectItem value="plus">Plus Model</SelectItem>
                  <SelectItem value="premium">Premium Model</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Originality.ai Integration */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Originality.ai</h4>
                <Badge variant="outline" className="text-blue-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalityApiKey">API Key</Label>
              <Input id="originalityApiKey" type="password" placeholder="Originality.ai API Key" defaultValue="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalityCredits">Current Credits</Label>
              <div className="p-2 bg-muted rounded text-sm">1,247 credits remaining</div>
            </div>
          </div>

          {/* Writer.com Integration */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Writer.com AI Detector</h4>
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Not Connected
                </Badge>
              </div>
              <Switch />
            </div>
            <div className="space-y-2">
              <Label htmlFor="writerApiKey">API Key</Label>
              <Input id="writerApiKey" type="password" placeholder="Writer.com API Key" />
            </div>
          </div>

          {/* Custom AI Detector */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Custom AI Detector</h4>
                <Badge variant="secondary">
                  Custom
                </Badge>
              </div>
              <Switch />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customDetectorUrl">API Endpoint URL</Label>
              <Input id="customDetectorUrl" placeholder="https://api.yourdetector.com/v1/detect" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customDetectorHeaders">Headers (JSON)</Label>
              <Textarea 
                id="customDetectorHeaders" 
                placeholder='{"Authorization": "Bearer YOUR_TOKEN", "Content-Type": "application/json"}'
                rows={3}
              />
            </div>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700">
            Save AI Detection Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingSettings;
