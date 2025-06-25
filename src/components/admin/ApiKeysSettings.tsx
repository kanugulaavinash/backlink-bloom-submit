
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Key, Eye, EyeOff, Plus, Trash2 } from "lucide-react";

interface ApiKey {
  id: string;
  service_name: string;
  key_name: string;
  is_configured: boolean;
  last_updated: string;
}

const COMMON_INTEGRATIONS = [
  { name: "OpenAI", key: "OPENAI_API_KEY", description: "For AI chat functionality" },
  { name: "Stripe", key: "STRIPE_SECRET_KEY", description: "For payment processing" },
  { name: "SendGrid", key: "SENDGRID_API_KEY", description: "For email notifications" },
  { name: "Twilio", key: "TWILIO_AUTH_TOKEN", description: "For SMS notifications" },
  { name: "Google Maps", key: "GOOGLE_MAPS_API_KEY", description: "For location services" },
  { name: "Resend", key: "RESEND_API_KEY", description: "For email delivery" }
];

const ApiKeysSettings = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [newKeyData, setNewKeyData] = useState({ service: "", keyName: "", keyValue: "" });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('service_name');

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = async (serviceName: string, keyName: string, keyValue: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .upsert({
          service_name: serviceName,
          key_name: keyName,
          key_value: keyValue, // In production, this should be encrypted
          is_configured: true,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${serviceName} API key saved successfully`,
      });

      fetchApiKeys();
      setNewKeyData({ service: "", keyName: "", keyValue: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save API key",
        variant: "destructive"
      });
    }
  };

  const deleteApiKey = async (id: string, serviceName: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${serviceName} API key deleted successfully`,
      });

      fetchApiKeys();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete API key",
        variant: "destructive"
      });
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading API keys...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            API Keys Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Common Integrations */}
          <div>
            <h3 className="text-lg font-medium mb-4">Common Integrations</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {COMMON_INTEGRATIONS.map((integration) => {
                const existingKey = apiKeys.find(key => key.key_name === integration.key);
                return (
                  <div key={integration.key} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{integration.name}</h4>
                      {existingKey ? (
                        <Badge variant="default">Configured</Badge>
                      ) : (
                        <Badge variant="secondary">Not Set</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                    
                    {!existingKey ? (
                      <div className="space-y-2">
                        <Input
                          placeholder={`Enter ${integration.name} API key`}
                          type="password"
                          value={newKeyData.keyName === integration.key ? newKeyData.keyValue : ""}
                          onChange={(e) => setNewKeyData({
                            service: integration.name,
                            keyName: integration.key,
                            keyValue: e.target.value
                          })}
                        />
                        <Button
                          size="sm"
                          onClick={() => saveApiKey(integration.name, integration.key, newKeyData.keyValue)}
                          disabled={!newKeyData.keyValue || newKeyData.keyName !== integration.key}
                        >
                          Save Key
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Input
                          type={showKeys[existingKey.id] ? "text" : "password"}
                          value={showKeys[existingKey.id] ? "sk-...configured" : "••••••••••••"}
                          readOnly
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleKeyVisibility(existingKey.id)}
                        >
                          {showKeys[existingKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteApiKey(existingKey.id, existingKey.service_name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom API Keys */}
          <div>
            <h3 className="text-lg font-medium mb-4">Custom API Keys</h3>
            <div className="space-y-4">
              {apiKeys.filter(key => !COMMON_INTEGRATIONS.some(int => int.key === key.key_name)).map((apiKey) => (
                <div key={apiKey.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{apiKey.service_name}</div>
                    <div className="text-sm text-gray-600">{apiKey.key_name}</div>
                  </div>
                  <Input
                    type={showKeys[apiKey.id] ? "text" : "password"}
                    value={showKeys[apiKey.id] ? "configured" : "••••••••••••"}
                    readOnly
                    className="w-32"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                  >
                    {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteApiKey(apiKey.id, apiKey.service_name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {/* Add Custom Key Form */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom API Key
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="service">Service Name</Label>
                    <Input
                      id="service"
                      placeholder="e.g., Custom Service"
                      value={newKeyData.service}
                      onChange={(e) => setNewKeyData(prev => ({ ...prev, service: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="keyName">Key Name</Label>
                    <Input
                      id="keyName"
                      placeholder="e.g., CUSTOM_API_KEY"
                      value={newKeyData.keyName}
                      onChange={(e) => setNewKeyData(prev => ({ ...prev, keyName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="keyValue">API Key</Label>
                    <Input
                      id="keyValue"
                      type="password"
                      placeholder="Enter API key value"
                      value={newKeyData.keyValue}
                      onChange={(e) => setNewKeyData(prev => ({ ...prev, keyValue: e.target.value }))}
                    />
                  </div>
                </div>
                <Button
                  onClick={() => saveApiKey(newKeyData.service, newKeyData.keyName, newKeyData.keyValue)}
                  disabled={!newKeyData.service || !newKeyData.keyName || !newKeyData.keyValue}
                >
                  Add API Key
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeysSettings;
