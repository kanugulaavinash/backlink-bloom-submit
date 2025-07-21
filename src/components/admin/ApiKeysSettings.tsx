import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Key, Eye, EyeOff, Plus, Trash2, CheckCircle, XCircle, AlertCircle, 
  ExternalLink, TestTube, Settings, Shield, CreditCard, Search,
  Loader2
} from "lucide-react";

interface ApiKey {
  id: string;
  service_name: string;
  key_name: string;
  is_configured: boolean;
  integration_status?: string;
  last_test_at?: string;
  test_result?: any;
  service_type?: string;
  created_at: string;
  updated_at: string;
}

interface IntegrationConfig {
  [key: string]: string;
}

const INTEGRATION_SERVICES = [
  {
    id: 'plagiarism_check',
    name: 'PlagiarismCheck.org',
    type: 'plagiarism',
    description: 'Professional plagiarism detection service',
    icon: Search,
    color: 'bg-purple-500',
    priority: true,
    setupUrl: 'https://plagiarismcheck.org/for-developers/',
    fields: [
      { key: 'api_token', label: 'API Token', type: 'password', required: true },
      { key: 'api_type', label: 'API Type', type: 'select', required: true, options: [
        { value: 'single', label: 'Single-user API' },
        { value: 'multi', label: 'Multi-user API' }
      ]},
      { key: 'threshold', label: 'Plagiarism Threshold (%)', type: 'number', defaultValue: '15' }
    ],
    instructions: [
      'Create an account at plagiarismcheck.org',
      'Navigate to Developer section in your account',
      'Generate an API token',
      'Choose between Single-user or Multi-user API based on your needs',
      'Test the integration with sample content'
    ]
  },
  {
    id: 'paypal',
    name: 'PayPal',
    type: 'payment',
    description: 'Global payment processing platform',
    icon: CreditCard,
    color: 'bg-blue-600',
    priority: true,
    setupUrl: 'https://developer.paypal.com/developer/applications/',
    fields: [
      { key: 'client_id', label: 'Client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', type: 'password', required: true },
      { key: 'environment', label: 'Environment', type: 'select', required: true, options: [
        { value: 'sandbox', label: 'Sandbox (Testing)' },
        { value: 'live', label: 'Live (Production)' }
      ]},
      { key: 'currency', label: 'Default Currency', type: 'select', defaultValue: 'USD', options: [
        { value: 'USD', label: 'USD - US Dollar' },
        { value: 'EUR', label: 'EUR - Euro' },
        { value: 'GBP', label: 'GBP - British Pound' },
        { value: 'INR', label: 'INR - Indian Rupee' }
      ]}
    ],
    instructions: [
      'Create a PayPal Developer account',
      'Create a new application in your developer dashboard',
      'Copy the Client ID and Client Secret',
      'Choose Sandbox for testing or Live for production',
      'Configure webhook endpoints if needed',
      'Test with a sample payment'
    ]
  }
];

const OTHER_INTEGRATIONS = [
  { name: "OpenAI", key: "OPENAI_API_KEY", description: "For AI content validation" },
  { name: "Resend", key: "RESEND_API_KEY", description: "For email notifications" },
  { name: "SendGrid", key: "SENDGRID_API_KEY", description: "Alternative email service" },
  { name: "Twilio", key: "TWILIO_AUTH_TOKEN", description: "For SMS notifications" },
  { name: "Google Analytics", key: "GOOGLE_ANALYTICS_ID", description: "Website analytics" }
];

const ApiKeysSettings = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [testingIntegration, setTestingIntegration] = useState<string | null>(null);
  const [integrationConfigs, setIntegrationConfigs] = useState<{ [key: string]: IntegrationConfig }>({});
  const [newKeyData, setNewKeyData] = useState({ service: "", keyName: "", keyValue: "" });
  const { toast } = useToast();

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase.rpc('custom_select' as any, {
        query: 'SELECT * FROM api_keys ORDER BY service_name'
      });

      if (error) {
        console.error('Error fetching API keys:', error);
        setApiKeys([]);
      } else {
        const parsedData = Array.isArray(data) ? data.map((item: any) => ({
          id: item.result?.id || item.id,
          service_name: item.result?.service_name || item.service_name,
          key_name: item.result?.key_name || item.key_name,
          is_configured: item.result?.is_configured || item.is_configured,
          integration_status: item.result?.integration_status || item.integration_status,
          last_test_at: item.result?.last_test_at || item.last_test_at,
          test_result: item.result?.test_result || item.test_result,
          service_type: item.result?.service_type || item.service_type,
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

  const saveIntegration = async (serviceId: string, configs: IntegrationConfig) => {
    try {
      const service = INTEGRATION_SERVICES.find(s => s.id === serviceId);
      if (!service) return;

      // Extract main API key
      const mainKey = service.fields.find(f => f.required)?.key;
      const mainValue = configs[mainKey || ''];

      if (!mainValue) {
        toast({
          title: "Error",
          description: "Main API key is required",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.rpc('custom_upsert_api_key_with_config' as any, {
        p_service_name: service.name,
        p_key_name: mainKey,
        p_key_value: mainValue,
        p_service_type: service.type,
        p_configurations: configs
      });

      if (error) {
        console.error('Error saving integration:', error);
        toast({
          title: "Error",
          description: "Failed to save integration. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: `${service.name} integration saved successfully`,
      });

      fetchApiKeys();
      setIntegrationConfigs(prev => ({ ...prev, [serviceId]: {} }));
    } catch (error: any) {
      console.error('Error saving integration:', error);
      toast({
        title: "Error",
        description: "Failed to save integration. Please try again.",
        variant: "destructive"
      });
    }
  };

  const testIntegration = async (serviceId: string) => {
    setTestingIntegration(serviceId);
    try {
      const service = INTEGRATION_SERVICES.find(s => s.id === serviceId);
      const apiKey = apiKeys.find(key => key.service_name === service?.name);
      
      if (!apiKey) {
        toast({
          title: "Error",
          description: "Please configure the integration first",
          variant: "destructive"
        });
        return;
      }

      // Call appropriate edge function for testing
      const { data, error } = await supabase.functions.invoke(`test-${serviceId}`, {
        body: { apiKeyId: apiKey.id }
      });

      if (error) {
        await supabase.rpc('update_api_key_test_result', {
          p_id: apiKey.id,
          p_status: 'failed',
          p_result: { error: error.message }
        });
        
        toast({
          title: "Test Failed",
          description: error.message || "Integration test failed",
          variant: "destructive"
        });
      } else {
        await supabase.rpc('update_api_key_test_result', {
          p_id: apiKey.id,
          p_status: 'success',
          p_result: data
        });
        
        toast({
          title: "Test Successful",
          description: `${service?.name} integration is working correctly`,
        });
      }

      fetchApiKeys();
    } catch (error: any) {
      console.error('Error testing integration:', error);
      toast({
        title: "Test Failed",
        description: "Failed to test integration",
        variant: "destructive"
      });
    } finally {
      setTestingIntegration(null);
    }
  };

  const deleteApiKey = async (id: string, serviceName: string) => {
    try {
      const { error } = await supabase.rpc('custom_delete_api_key' as any, {
        p_id: id
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete API key",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: `${serviceName} integration removed`,
      });

      fetchApiKeys();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Working</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case 'not_tested':
      default:
        return <Badge className="bg-gray-100 text-gray-800"><AlertCircle className="w-3 h-3 mr-1" />Not Tested</Badge>;
    }
  };

  const renderIntegrationCard = (service: typeof INTEGRATION_SERVICES[0]) => {
    const existingKey = apiKeys.find(key => key.service_name === service.name);
    const config = integrationConfigs[service.id] || {};
    const Icon = service.icon;

    return (
      <Card key={service.id} className="relative">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`${service.color} p-2 rounded-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {existingKey && getStatusBadge(existingKey.integration_status)}
              {existingKey ? (
                <Badge variant="default">Configured</Badge>
              ) : (
                <Badge variant="secondary">Not Set</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!existingKey ? (
            <>
              {/* Setup Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Setup Instructions</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  {service.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-blue-200 text-blue-900 text-xs rounded-full w-4 h-4 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      {instruction}
                    </li>
                  ))}
                </ol>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => window.open(service.setupUrl, '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Open Developer Portal
                </Button>
              </div>

              {/* Configuration Form */}
              <div className="space-y-4">
                <h4 className="font-medium">Configuration</h4>
                {service.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={`${service.id}-${field.key}`}>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    
                    {field.type === 'select' ? (
                      <Select
                        value={config[field.key] || field.defaultValue || ''}
                        onValueChange={(value) => setIntegrationConfigs(prev => ({
                          ...prev,
                          [service.id]: { ...prev[service.id], [field.key]: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.key === 'api_type' ? (
                      <RadioGroup
                        value={config[field.key] || ''}
                        onValueChange={(value) => setIntegrationConfigs(prev => ({
                          ...prev,
                          [service.id]: { ...prev[service.id], [field.key]: value }
                        }))}
                      >
                        {field.options?.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={`${service.id}-${field.key}-${option.value}`} />
                            <Label htmlFor={`${service.id}-${field.key}-${option.value}`}>{option.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <Input
                        id={`${service.id}-${field.key}`}
                        type={field.type}
                        placeholder={`Enter ${field.label}`}
                        value={config[field.key] || field.defaultValue || ''}
                        onChange={(e) => setIntegrationConfigs(prev => ({
                          ...prev,
                          [service.id]: { ...prev[service.id], [field.key]: e.target.value }
                        }))}
                      />
                    )}
                  </div>
                ))}
                
                <Button
                  onClick={() => saveIntegration(service.id, config)}
                  disabled={!service.fields.filter(f => f.required).every(f => config[f.key])}
                  className="w-full"
                >
                  Save Integration
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Configured Integration */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  {getStatusBadge(existingKey.integration_status)}
                </div>
                
                {existingKey.last_test_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Tested</span>
                    <span className="text-sm text-gray-600">
                      {new Date(existingKey.last_test_at).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testIntegration(service.id)}
                    disabled={testingIntegration === service.id}
                  >
                    {testingIntegration === service.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <TestTube className="w-4 h-4 mr-2" />
                    )}
                    Test Connection
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(service.setupUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteApiKey(existingKey.id, existingKey.service_name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading integrations...</div>
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
            API Keys & Integrations
          </CardTitle>
          <CardDescription>
            Configure third-party services and API integrations for your application
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="priority" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="priority">Priority Integrations</TabsTrigger>
          <TabsTrigger value="other">Other Services</TabsTrigger>
          <TabsTrigger value="custom">Custom Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="priority" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {INTEGRATION_SERVICES.map(renderIntegrationCard)}
          </div>
        </TabsContent>

        <TabsContent value="other" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {OTHER_INTEGRATIONS.map((integration) => {
              const existingKey = apiKeys.find(key => key.key_name === integration.key);
              return (
                <Card key={integration.key}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                      {existingKey ? (
                        <Badge variant="default">Configured</Badge>
                      ) : (
                        <Badge variant="secondary">Not Set</Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm">{integration.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
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
                          onClick={() => saveIntegration('custom', { [integration.key]: newKeyData.keyValue })}
                          disabled={!newKeyData.keyValue || newKeyData.keyName !== integration.key}
                          className="w-full"
                        >
                          Save Key
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="password"
                          value="••••••••••••"
                          readOnly
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteApiKey(existingKey.id, existingKey.service_name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          {/* Custom API Keys */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custom API Keys</CardTitle>
              <CardDescription>Add custom API keys for other services not listed above</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing custom keys */}
              {apiKeys.filter(key => !INTEGRATION_SERVICES.some(s => s.name === key.service_name) && !OTHER_INTEGRATIONS.some(i => i.key === key.key_name)).map((apiKey) => (
                <div key={apiKey.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{apiKey.service_name}</div>
                    <div className="text-sm text-gray-600">{apiKey.key_name}</div>
                  </div>
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
              <Separator />
              <div className="space-y-4">
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
                  onClick={() => saveIntegration('custom', { [newKeyData.keyName]: newKeyData.keyValue })}
                  disabled={!newKeyData.service || !newKeyData.keyName || !newKeyData.keyValue}
                >
                  Add API Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiKeysSettings;
