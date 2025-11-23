# TinyLink - URL Shortener

A modern URL shortener application built with Next.js, PostgreSQL (Neon), and Tailwind CSS. Create short links with custom codes, track clicks, and manage your links with an intuitive dashboard.

🔗 **Live Demo**: [Live Preview](tinylink-a07ajknpg-ajays-projects-4590e44e.vercel.app)

## Features

- ✨ Create short links with custom codes (6-8 alphanumeric characters)
- 📊 Track click statistics and last clicked time
- 🔍 Search and filter links
- 📱 Responsive design (mobile and desktop)
- 🗑️ Delete links with confirmation
- 📋 Copy short URLs to clipboard
- ⚡ Real-time click tracking
- 🏥 Health check endpoint for monitoring

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (Neon)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20+ installed
- A Neon PostgreSQL database (free tier available at [neon.tech](https://neon.tech))

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd tinylink
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   The database connection is configured in `lib/db.ts`. For production deployment, you may want to use environment variables.

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

The database table will be automatically created on first API call.

## Project Structure

```
tinylink/
├── app/
│   ├── api/
│   │   ├── links/
│   │   │   ├── route.ts          # POST /api/links, GET /api/links
│   │   │   └── [code]/route.ts   # GET /api/links/:code, DELETE /api/links/:code
│   ├── code/
│   │   └── [code]/
│   │       ├── page.tsx          # Stats page for individual link
│   │       └── not-found.tsx     # 404 page
│   ├── healthz/
│   │   └── route.ts              # GET /healthz - Health check
│   ├── [code]/
│   │   └── route.ts              # Redirect route
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Dashboard page
│   └── globals.css               # Global styles
├── components/
│   ├── Header.tsx                # App header
│   ├── LinkFormModal.tsx         # Modal form for creating links
│   ├── LinksTable.tsx            # Table/list of all links
│   └── StatsCard.tsx             # Stats display card
├── lib/
│   ├── db.ts                     # Database connection and queries
│   ├── types.ts                  # TypeScript interfaces
│   └── validators.ts             # Validation functions
└── package.json
```

## API Endpoints

### Create Link

```
POST /api/links
Content-Type: application/json

{
  "url": "https://example.com",
  "customCode": "mycode"
}

Response:
- 201: Link created successfully
- 400: Invalid input
- 409: Custom code already exists
```

### List All Links

```
GET /api/links

Response:
- 200: { success: true, links: [...] }
```

### Get Link Stats

```
GET /api/links/:code

Response:
- 200: { success: true, link: {...} }
- 404: Link not found
```

### Delete Link

```
DELETE /api/links/:code

Response:
- 204: Successfully deleted
- 404: Link not found
```

### Health Check

```
GET /healthz

Response:
- 200: { ok: true, version: "1.0", uptime: <seconds> }
```

### Redirect

```
GET /:code

Response:
- 302: Redirect to target URL (increments click count)
- 404: Link not found
```

## Pages

- `/` - Dashboard (list all links, create new link)
- `/code/:code` - Stats page for individual link
- `/:code` - Redirect to target URL
- `/healthz` - Health check

## Custom Code Rules

- Must be 6-8 characters long
- Only alphanumeric characters (A-Z, a-z, 0-9)
- Must be unique across all users
- Required (no automatic generation)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import the project in Vercel

3. The database is already configured with the Neon connection string in `lib/db.ts`

4. Deploy!

Your application will be live at `https://your-app.vercel.app`

## Testing

### Manual Testing

1. **Create a link**: Click "Add Link" button, enter URL and custom code
2. **View stats**: Click on a short code in the table
3. **Copy link**: Click copy button next to a link
4. **Delete link**: Click delete button and confirm
5. **Search**: Use search box to filter links
6. **Redirect**: Visit `http://localhost:3000/:code` to test redirect
7. **Health check**: Visit `http://localhost:3000/healthz`

### API Testing

See the verification plan in the implementation document for curl commands to test all endpoints.

## Development Notes

- Database initialization happens automatically on first API call
- Click tracking updates synchronously during redirect
- All validation is performed on both frontend and backend
- Custom codes are case-sensitive
- Tailwind CSS is used for all styling

## License

MIT

## Author

Nancy
