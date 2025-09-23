# Weekly AI Digest 🤖

A modern Vue.js application for curating and publishing weekly AI news digests. Features a public-facing newsletter subscription and an admin dashboard for content management.

## ✨ Features

### Public Features

- **Weekly AI Digest Display** - Browse the latest AI news and insights
- **Newsletter Subscription** - Subscribe to weekly AI digest emails via Buttondown
- **Responsive Design** - Mobile-friendly interface with Tailwind CSS
- **Hero Section** - Dynamic image carousel from published posts

### Admin Features (Authentication Required)

- **Post Management** - Create, edit, and publish AI news posts
- **Categories Management** - Organize content by categories
- **Sources Management** - Track and manage news sources
- **Content Dashboard** - Overview of posts, publishing status, and analytics
- **Batch Operations** - Bulk insert posts via Edge Functions

## 🛠️ Tech Stack

- **Frontend**: Vue.js 3 + Composition API
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Backend**: Supabase (Database + Authentication + Edge Functions)
- **Email Service**: Buttondown.com integration
- **Routing**: Vue Router 4

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/           # Admin dashboard components
│   └── home/            # Public-facing components
│       ├── navigation/  # Navigation components
│       ├── home/        # Homepage components
│       ├── posts/       # Post display components
│       └── NewsletterSignup.vue
├── views/
│   ├── www/             # Public pages
│   │   └── Index.vue
│   ├── admin/           # Admin pages
│   │   ├── Dashboard.vue
│   │   ├── Posts.vue
│   │   ├── Categories.vue
│   │   └── Sources.vue
│   └── Auth/
│       └── LoginPage.vue
├── router/              # Vue Router configuration
├── lib/                 # Supabase client setup
└── composables/         # Reusable composition functions

supabase/
├── functions/           # Edge Functions
│   ├── insert-posts/    # Batch post insertion
│   └── subscribe-newsletter/  # Newsletter subscription
└── migrations/          # Database schema
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Buttondown.com account (for newsletter)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd AIIn5
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**

   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Login to Supabase
   supabase login

   # Link to your project
   supabase link --project-ref your_project_ref

   # Push database migrations
   supabase db push

   # Deploy Edge Functions
   supabase functions deploy insert-posts
   supabase functions deploy subscribe-newsletter

   # Set Buttondown API key
   supabase secrets set BUTTONDOWN_API_KEY=your_buttondown_api_key
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📧 Newsletter Integration

The newsletter system integrates with Buttondown.com:

1. **Subscription Flow**:

   - User submits email via frontend form
   - Supabase Edge Function processes subscription
   - Email is added to Buttondown subscriber list
   - Subscription details stored in local database
   - User receives confirmation email from Buttondown

2. **Data Storage**:
   - Subscriber emails stored in `newsletter_subscribers` table
   - Includes Buttondown subscriber ID for reference
   - Tracks subscription source and status

## 🔐 Authentication & Authorization

- **Public Access**: Homepage and newsletter subscription
- **Admin Access**: Requires Supabase authentication
- **Protected Routes**: Admin dashboard, content management
- **Row Level Security**: Enabled on all database tables

## 🗄️ Database Schema

### Main Tables

- `posts` - AI news articles and content
- `categories` - Content categorization
- `sources` - News source management
- `newsletter_subscribers` - Email subscription data

### Key Features

- UUID primary keys
- Timestamp tracking (created_at, updated_at)
- Row Level Security policies
- Foreign key relationships

## 📝 Content Management

### Post Workflow

1. **Draft** - Initial post creation
2. **Pending** - Ready for review
3. **Published** - Live on public site
4. **Archived** - Hidden from public view

### Bulk Operations

- Import posts via Edge Functions
- Batch processing with error handling
- Skip duplicate content automatically

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Hosting Platform

The built files will be in the `dist/` directory. Deploy to:

- Netlify

### Environment Variables for Production

Ensure these are set in your hosting platform:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🔧 Development Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build locally
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions or issues:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

---

**Built with ❤️ using Vue.js and Supabase**
