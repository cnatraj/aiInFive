# Deploy Edge Function Instructions

## Prerequisites
1. Make sure you have the tables created in your Supabase database (categories, sources, posts, post_categories)

## Deployment Steps

1. **Login to Supabase CLI:**
   ```bash
   supabase login
   ```

2. **Link to your project** (replace YOUR_PROJECT_ID with your actual project ID):
   ```bash
   supabase link --project-ref YOUR_PROJECT_ID
   ```

3. **Deploy the function:**
   ```bash
   supabase functions deploy insert-posts
   ```

## Testing the Function

Once deployed, your function will be available at:
```
https://YOUR_PROJECT_ID.supabase.co/functions/v1/insert-posts
```

### Test with curl:
```bash
curl -i --location --request POST 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/insert-posts' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '[
    {
      "skip": false,
      "headline": "Test Post from API",
      "summary": "This is a test summary to verify the API works",
      "whyItMatters": "Testing is important for ensuring our API functions correctly",
      "url": "https://example.com/test-post",
      "source": "Test Source",
      "tags": ["Technology", "Testing"]
    }
  ]'
```

### For Make.com Integration:
- **Method**: POST
- **URL**: `https://YOUR_PROJECT_ID.supabase.co/functions/v1/insert-posts`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_ANON_KEY` (optional, but recommended)
- **Body**: JSON array of posts

## Function Features

✅ **Auto-creates missing sources** when they don't exist
✅ **Auto-creates missing categories** when they don't exist
✅ **Handles the skip field** - posts with skip: true are counted but not inserted
✅ **Proper error handling** - individual post failures don't stop the batch
✅ **Detailed response** - shows exactly what happened with each post
✅ **CORS support** - can be called from web applications

## Response Format
```json
{
  "success": true,
  "processed": 1,
  "inserted": 1,
  "skipped": 0,
  "errors": 0,
  "results": [
    {
      "post_id": "uuid-here",
      "headline": "Test Post from API",
      "status": "inserted"
    }
  ]
}
```