
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Shield, Bot, CheckCircle, XCircle } from "lucide-react";

const PricingSettings = () => {
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
              <Input id="basePrice" type="number" defaultValue="5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" defaultValue="USD" />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch id="dynamicPricing" />
            <Label htmlFor="dynamicPricing">Enable dynamic pricing based on category</Label>
          </div>
          
          <Button className="bg-blue-600 hover:bg-blue-700">
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
              <Input id="plagiarismThreshold" type="number" defaultValue="5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aiContentThreshold">Max AI Content Score (%)</Label>
              <Input id="aiContentThreshold" type="number" defaultValue="20" />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minBacklinks">Minimum Backlinks</Label>
              <Input id="minBacklinks" type="number" defaultValue="1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxBacklinks">Maximum Backlinks</Label>
              <Input id="maxBacklinks" type="number" defaultValue="2" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="minImages">Minimum Images Required</Label>
            <Input id="minImages" type="number" defaultValue="2" />
          </div>
          
          <Button className="bg-blue-600 hover:bg-blue-700">
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
          {/* PayPal Integration */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">PayPal</h4>
                <Badge variant="outline" className="text-blue-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paypalClientId">Client ID</Label>
                <Input id="paypalClientId" placeholder="PayPal Client ID" defaultValue="AeA..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paypalClientSecret">Client Secret</Label>
                <Input id="paypalClientSecret" type="password" placeholder="PayPal Client Secret" defaultValue="••••••••" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paypalMode">Environment</Label>
              <Select defaultValue="sandbox">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                  <SelectItem value="live">Live (Production)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stripe Integration */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Stripe</h4>
                <Badge variant="destructive" className="text-red-600">
                  <XCircle className="h-3 w-3 mr-1" />
                  Not Connected
                </Badge>
              </div>
              <Switch />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stripePublishableKey">Publishable Key</Label>
                <Input id="stripePublishableKey" placeholder="pk_test_..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripeSecretKey">Secret Key</Label>
                <Input id="stripeSecretKey" type="password" placeholder="sk_test_..." />
              </div>
            </div>
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
              <Switch defaultChecked />
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
              <Switch />
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
