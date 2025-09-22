# Deploy Updated Edge Function

## ✅ **What's Been Updated:**

### **Edge Function Changes:**
1. **Added `status` field** - Defaults to 'pending' for new posts
2. **Supports workflow states** - pending, selected, published, archived
3. **Updated example** - Shows weekly run_id format

### **Database Schema:**
- Run the SQL in `/sql/weekly_publishing_workflow.sql` first
- Adds run_id, status, published_at, archived_at fields

## 🚀 **Deployment Options:**

### **Option 1: Use the Script**
```bash
./deploy-updated-function.sh
```

### **Option 2: Manual Steps**
```bash
# Login
supabase login

# Link project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# Deploy function
supabase functions deploy insert-posts
```

## 🧪 **Test Updated Function:**

**URL**: `https://YOUR_PROJECT_ID.supabase.co/functions/v1/insert-posts`

**Sample JSON** (with new workflow fields):
```json
[
  {
    "run_id": "week-2024-01-15",
    "status": "pending",
    "skip": false,
    "headline": "AI Revolutionizes Content Creation",
    "summary": "New AI tools are transforming how content creators work",
    "whyItMatters": "This affects millions of content creators worldwide",
    "url": "https://example.com/ai-content",
    "source": "Tech News",
    "tags": ["Technology", "AI", "Content Creation"]
  }
]
```

## 🔄 **Weekly Workflow Ready:**

1. **Make.com imports** with `status: "pending"`
2. **You review** pending posts in your dashboard
3. **Select 5 posts** and update status to `"selected"`
4. **Publish selected** and update status to `"published"`
5. **Archive remaining** and update status to `"archived"`

All database fields and Edge Function are now ready for your weekly publishing workflow! 🎉