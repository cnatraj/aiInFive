import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

interface SubscribeRequest {
  email: string
}

interface ButtondownResponse {
  id: string
  email: string
  created: string
}

// Declare Deno as global to fix TypeScript error
declare const Deno: any

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const buttondownApiKey = Deno.env.get('BUTTONDOWN_API_KEY')

    if (!supabaseUrl || !supabaseServiceKey || !buttondownApiKey) {
      throw new Error('Missing required environment variables')
    }

    // Parse request body
    const { email }: SubscribeRequest = await req.json()

    if (!email || !email.trim()) {
      throw new Error('Email is required')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format')
    }

    console.log(`Processing newsletter subscription for: ${email}`)

    // Step 1: Subscribe to Buttondown first
    const buttondownResponse = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${buttondownApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email_address: email.trim() })
    })

    if (!buttondownResponse.ok) {
      const errorText = await buttondownResponse.text()
      console.error('Buttondown API error:', errorText)

      // Handle common Buttondown errors
      if (buttondownResponse.status === 400 && errorText.includes('already exists')) {
        throw new Error('Email is already subscribed to our newsletter')
      }

      throw new Error('Failed to subscribe to newsletter service')
    }

    const buttondownData: ButtondownResponse = await buttondownResponse.json()
    console.log('Buttondown subscription successful:', buttondownData.id)

    // Step 2: Store in Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.trim(),
        buttondown_id: buttondownData.id,
        source: 'website',
        status: 'active'
      })
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      // Don't throw here - user is already subscribed to Buttondown
      // This is just for our records
    } else {
      console.log('Supabase record created successfully')
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully subscribed to our newsletter!',
        email: email.trim()
      }),
      {
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('Newsletter subscription error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'Something went wrong. Please try again.'
      }),
      {
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*'
        },
        status: 400
      }
    )
  }
})