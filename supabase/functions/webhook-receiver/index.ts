import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Extract the endpoint key from the URL path
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const endpointKey = pathParts[pathParts.length - 1]

    console.log('Received webhook for endpoint:', endpointKey)

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Find the endpoint by key
    const { data: endpoint, error: endpointError } = await supabaseClient
      .from('webhook_endpoints')
      .select('id, user_id')
      .eq('endpoint_key', endpointKey)
      .single()

    if (endpointError || !endpoint) {
      console.error('Endpoint not found:', endpointKey)
      return new Response(
        JSON.stringify({ error: 'Endpoint not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    let body = null
    const contentType = req.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      try {
        body = await req.json()
      } catch (e) {
        body = await req.text()
      }
    } else {
      body = await req.text()
    }

    // Convert headers to object
    const headers: Record<string, string> = {}
    req.headers.forEach((value, key) => {
      headers[key] = value
    })

    // Parse query parameters
    const queryParams: Record<string, string> = {}
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value
    })

    // Get client IP
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown'

    // Store the webhook request
    const { error: insertError } = await supabaseClient
      .from('webhook_requests')
      .insert({
        endpoint_id: endpoint.id,
        method: req.method,
        headers,
        body,
        query_params: queryParams,
        ip_address: ipAddress,
      })

    if (insertError) {
      console.error('Failed to store webhook request:', insertError)
      throw insertError
    }

    console.log('Webhook request stored successfully')

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook received successfully',
        endpoint_key: endpointKey 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
