
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
    </div>
  );
};

export default PricingSettings;
