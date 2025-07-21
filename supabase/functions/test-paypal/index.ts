import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { apiKeyId } = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get API key details
    const { data: apiKey, error: keyError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', apiKeyId)
      .single()

    if (keyError || !apiKey) {
      throw new Error('API key not found')
    }

    // Get configurations
    const { data: configs } = await supabase
      .from('api_key_configurations')
      .select('*')
      .eq('api_key_id', apiKeyId)

    const configMap = configs?.reduce((acc: any, config: any) => {
      acc[config.configuration_key] = config.configuration_value
      return acc
    }, {}) || {}

    // Test PayPal API
    const clientId = apiKey.key_value
    const clientSecret = configMap.client_secret
    const environment = configMap.environment || 'sandbox'
    
    if (!clientSecret) {
      throw new Error('Client secret is required')
    }

    // Get PayPal access token
    const baseUrl = environment === 'live' 
      ? 'https://api.paypal.com' 
      : 'https://api.sandbox.paypal.com'

    const authResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
      },
      body: 'grant_type=client_credentials'
    })

    if (!authResponse.ok) {
      const errorText = await authResponse.text()
      throw new Error(`PayPal Auth error: ${authResponse.status} - ${errorText}`)
    }

    const authResult = await authResponse.json()

    // Test API access by getting a payment (this will fail but confirms auth works)
    const testResponse = await fetch(`${baseUrl}/v1/payments/payment`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authResult.access_token}`,
        'Content-Type': 'application/json'
      }
    })

    // Even if this fails, if we get a 401 it means auth didn't work
    // If we get other errors, auth is working
    const testResult = await testResponse.json()

    if (testResponse.status === 401) {
      throw new Error('PayPal authentication failed - check credentials')
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'PayPal integration test successful',
        data: {
          environment: environment,
          client_id: clientId.substring(0, 8) + '...',
          access_token_received: !!authResult.access_token,
          token_type: authResult.token_type,
          expires_in: authResult.expires_in,
          timestamp: new Date().toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error testing PayPal integration:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})