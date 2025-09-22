# Deploy Edge Function Instructions

## Step 1: Login to Supabase CLI
Open your terminal and run:
```bash
supabase login
```
This will open your browser to authenticate.

## Step 2: Link to Your Project
You'll need your Supabase project reference ID (found in your dashboard URL):
```bash
supabase link --project-ref YOUR_PROJECT_REF_ID
```

## Step 3: Deploy the Function
```bash
supabase functions deploy insert-posts
```

## What We Fixed:
1. ✅ **Updated function to use Service Role Key** - bypasses RLS policies
2. ✅ **Disabled JWT verification** in config.toml (`verify_jwt = false`)
3. ✅ **Fixed TypeScript errors** in the function code

## Test After Deployment:
**URL**: `https://YOUR_PROJECT_ID.supabase.co/functions/v1/insert-posts`
**Method**: POST
**Headers**: `Content-Type: application/json`
**Body**:
```json
[
  {
    "skip": false,
    "headline": "Test Post from CLI Deploy",
    "summary": "Testing the deployed function",
    "whyItMatters": "We need to verify the deployment works",
    "url": "https://example.com/test",
    "source": "CLI Test",
    "tags": ["Technology", "Testing"]
  }
]
```

## Expected Response:
```json
{
  "success": true,
  "processed": 1,
  "inserted": 1,
  "skipped": 0,
  "errors": 0,
  "results": [
    {
      "post_id": "some-uuid",
      "headline": "Test Post from CLI Deploy",
      "status": "inserted"
    }
  ]
}
```

The function should now work without any authorization headers!