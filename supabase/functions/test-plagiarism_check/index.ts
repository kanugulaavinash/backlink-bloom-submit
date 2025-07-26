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

    // Test PlagiarismCheck.org API
    const apiToken = apiKey.key_value
    const apiType = configMap.api_type || 'single'
    
    // Test with longer sample text to ensure minimum 80 alphanumeric characters
    const testText = "The modern digital landscape requires sophisticated content analysis tools to maintain academic integrity and original writing standards. Plagiarism detection systems utilize advanced algorithms to compare submitted text against vast databases of published works, identifying potential similarities and ensuring proper attribution of sources. These technological solutions have become essential components in educational institutions and professional publishing environments worldwide."
    
    // Count alphanumeric characters (excluding spaces and special characters)
    const alphanumericCount = testText.replace(/[^a-zA-Z0-9]/g, '').length
    console.log(`Test text alphanumeric character count: ${alphanumericCount}`)
    
    if (alphanumericCount < 80) {
      throw new Error(`Test text too short: ${alphanumericCount} characters (minimum 80 required)`)
    }
    
    // Prepare form data
    const formData = new URLSearchParams()
    formData.append('text', testText)
    formData.append('language', 'en')
    formData.append('type', apiType === 'multi' ? 'multi' : 'single')

    const plagiarismResponse = await fetch('https://plagiarismcheck.org/api/v1/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-API-TOKEN': apiToken
      },
      body: formData.toString()
    })

    if (!plagiarismResponse.ok) {
      const errorText = await plagiarismResponse.text()
      throw new Error(`PlagiarismCheck API error: ${plagiarismResponse.status} - ${errorText}`)
    }

    const result = await plagiarismResponse.json()

    return new Response(
      JSON.stringify({
        success: true,
        message: 'PlagiarismCheck.org integration test successful',
        data: {
          status: result.status || 'success',
          text_id: result.text_id || null,
          plagiarism_percent: result.percent || 0,
          api_type: apiType,
          timestamp: new Date().toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error testing PlagiarismCheck integration:', error)
    
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