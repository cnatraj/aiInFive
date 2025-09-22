#!/bin/bash

# Deploy Updated Edge Function with Weekly Workflow Support
# Run this script to deploy the updated insert-posts function

echo "🚀 Deploying updated Edge Function with weekly workflow support..."

# Login to Supabase (will open browser)
echo "Step 1: Logging in to Supabase..."
supabase login

# Check if project is linked
if [ ! -f .supabase/config.toml ]; then
    echo "Step 2: Linking to your Supabase project..."
    echo "Please enter your Supabase project reference ID:"
    read project_ref
    supabase link --project-ref $project_ref
else
    echo "Step 2: Project already linked ✅"
fi

# Deploy the function
echo "Step 3: Deploying insert-posts function..."
supabase functions deploy insert-posts

echo "✅ Deployment complete!"
echo ""
echo "🧪 Test your updated function with:"
echo "POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/insert-posts"
echo ""
echo "📝 Example JSON body:"
echo '['
echo '  {'
echo '    "run_id": "week-2024-01-15",'
echo '    "status": "pending",'
echo '    "skip": false,'
echo '    "headline": "Test Post with Workflow",'
echo '    "summary": "Testing the updated function",'
echo '    "whyItMatters": "We need to verify workflow fields work",'
echo '    "url": "https://example.com/test",'
echo '    "source": "Test Source",'
echo '    "tags": ["Technology", "Testing"]'
echo '  }'
echo ']'