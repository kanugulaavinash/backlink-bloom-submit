
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
  created_at: string;
  updated_at: string;
}

const COMMON_INTEGRATIONS = [
  { name: "Resend", key: "RESEND_API_KEY", description: "For email notifications and delivery", priority: true },
  { name: "OpenAI", key: "OPENAI_API_KEY", description: "For AI content validation" },
  { name: "Plagiarism Check", key: "PLAGIARISM_CHECK_API_KEY", description: "For plagiarism detection" },
  { name: "Razorpay", key: "RAZORPAY_KEY_ID", description: "For payment processing (Key ID)" },
  { name: "Razorpay Secret", key: "RAZORPAY_KEY_SECRET", description: "For payment processing (Secret)" },
  { name: "SendGrid", key: "SENDGRID_API_KEY", description: "For email notifications (alternative)" },
  { name: "Twilio", key: "TWILIO_AUTH_TOKEN", description: "For SMS notifications" },
  { name: "Google Analytics", key: "GOOGLE_ANALYTICS_ID", description: "For website analytics tracking" },
  { name: "Google Search Console", key: "GOOGLE_SEARCH_CONSOLE_VERIFICATION", description: "For search console verification" }
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
      // Use raw RPC call with proper typing
      const { data, error } = await supabase.rpc('custom_select' as any, {
        query: 'SELECT id, service_name, key_name, is_configured, created_at, updated_at FROM api_keys ORDER BY service_name'
      });

      if (error) {
        console.error('Error fetching API keys:', error);
        setApiKeys([]);
      } else {
        // Parse the JSONB result properly
        const parsedData = Array.isArray(data) ? data.map((item: any) => ({
          id: item.result?.id || item.id,
          service_name: item.result?.service_name || item.service_name,
          key_name: item.result?.key_name || item.key_name,
          is_configured: item.result?.is_configured || item.is_configured,
          created_at: item.result?.created_at || item.created_at,
          updated_at: item.result?.updated_at || item.updated_at
        })) : [];
        setApiKeys(parsedData);
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
      setApiKeys([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = async (serviceName: string, keyName: string, keyValue: string) => {
    try {
      const { error } = await supabase.rpc('custom_upsert_api_key' as any, {
        p_service_name: serviceName,
        p_key_name: keyName,
        p_key_value: keyValue
      });

      if (error) {
        console.error('Error saving API key:', error);
        toast({
          title: "Error",
          description: "Failed to save API key. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: `${serviceName} API key saved successfully`,
      });

      fetchApiKeys();
      setNewKeyData({ service: "", keyName: "", keyValue: "" });
    } catch (error: any) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error",
        description: "Failed to save API key. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteApiKey = async (id: string, serviceName: string) => {
    try {
      const { error } = await supabase.rpc('custom_delete_api_key' as any, {
        p_id: id
      });

      if (error) {
        console.error('Error deleting API key:', error);
        toast({
          title: "Error",
          description: "Failed to delete API key. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: `${serviceName} API key deleted successfully`,
      });

      fetchApiKeys();
    } catch (error: any) {
      console.error('Error deleting API key:', error);
      toast({
        title: "Error",
        description: "Failed to delete API key. Please try again.",
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

          {/* Status Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> API key management is now functional. Once the database schema is fully synced, 
              the interface will work seamlessly with proper TypeScript types.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeysSettings;
