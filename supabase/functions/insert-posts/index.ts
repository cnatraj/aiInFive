import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

interface PostData {
  skip: boolean
  headline: string
  summary: string
  whyItMatters: string
  url: string
  source: string
  tags: string[]
  run_id?: string // Optional run_id to group related posts
  status?: string // Optional status, defaults to 'pending'
}

interface ProcessedResult {
  post_id?: string
  headline: string
  status: 'inserted' | 'skipped' | 'error'
  error?: string
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
    // Use service role key to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Parse request body
    const postsData: PostData[] = await req.json()

    if (!Array.isArray(postsData)) {
      throw new Error('Request body must be an array of posts')
    }

    const results: ProcessedResult[] = []
    let insertedCount = 0
    let skippedCount = 0
    let errorCount = 0

    // Process each post
    for (const postData of postsData) {
      try {
        // Skip posts marked as skip: true
        if (postData.skip) {
          results.push({
            headline: postData.headline,
            status: 'skipped'
          })
          skippedCount++
          continue
        }

        // Find or create source
        let sourceId = null
        if (postData.source) {
          const { data: existingSource } = await supabase
            .from('sources')
            .select('id')
            .eq('name', postData.source)
            .single()

          if (existingSource) {
            sourceId = existingSource.id
          } else {
            // Create new source
            const { data: newSource, error: sourceError } = await supabase
              .from('sources')
              .insert([{
                name: postData.source,
                is_active: true
              }])
              .select('id')
              .single()

            if (sourceError) {
              console.error('Error creating source:', sourceError)
            } else {
              sourceId = newSource.id
            }
          }
        }

        // Insert post
        const { data: newPost, error: postError } = await supabase
          .from('posts')
          .insert([{
            run_id: postData.run_id,
            status: postData.status || 'pending', // Default to 'pending' if not provided
            skip: postData.skip,
            headline: postData.headline,
            summary: postData.summary,
            why_it_matters: postData.whyItMatters,
            url: postData.url,
            source_id: sourceId
          }])
          .select('id')
          .single()

        if (postError) {
          throw postError
        }

        const postId = newPost.id

        // Process tags/categories
        if (postData.tags && postData.tags.length > 0) {
          for (const tagName of postData.tags) {
            // Find or create category
            const { data: existingCategory } = await supabase
              .from('categories')
              .select('id')
              .eq('name', tagName)
              .single()

            let categoryId = null
            if (existingCategory) {
              categoryId = existingCategory.id
            } else {
              // Create new category
              const { data: newCategory, error: categoryError } = await supabase
                .from('categories')
                .insert([{
                  name: tagName,
                  description: `Auto-created category for ${tagName}`,
                  color: '#3B82F6' // Default blue color
                }])
                .select('id')
                .single()

              if (categoryError) {
                console.error('Error creating category:', categoryError)
              } else {
                categoryId = newCategory.id
              }
            }

            // Create post-category relationship
            if (categoryId) {
              await supabase
                .from('post_categories')
                .insert([{
                  post_id: postId,
                  category_id: categoryId
                }])
            }
          }
        }

        results.push({
          post_id: postId,
          headline: postData.headline,
          status: 'inserted'
        })
        insertedCount++

      } catch (error: any) {
        console.error('Error processing post:', error)
        results.push({
          headline: postData.headline,
          status: 'error',
          error: error?.message || 'Unknown error'
        })
        errorCount++
      }
    }

    // Return response
    const response = {
      success: errorCount === 0,
      processed: postsData.length,
      inserted: insertedCount,
      skipped: skippedCount,
      errors: errorCount,
      results: results
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    )

  } catch (error: any) {
    console.error('Function error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || 'Unknown error',
        processed: 0,
        inserted: 0,
        skipped: 0,
        errors: 1,
        results: []
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/insert-posts' \
    --header 'Content-Type: application/json' \
    --data '[{"run_id":"week-2024-01-15","status":"pending","skip":false,"headline":"Test Post","summary":"Test summary","whyItMatters":"Test why it matters","url":"https://example.com","source":"Test Source","tags":["Technology"]}]'

*/