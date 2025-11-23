# TinyLink - Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the TinyLink application to Vercel.

## Prerequisites

- Node.js installed
- Vercel account (free tier is sufficient)
- Neon PostgreSQL database set up
- Database connection string ready

## Initial Setup (One-Time)

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

This will open your browser for authentication. Follow the prompts to authorize the CLI.

## Deployment Steps

### 1. Verify Local Build

Before deploying, ensure the application builds successfully locally:

```bash
npm run build
```

If there are any errors, fix them before proceeding.

### 2. Deploy to Production

Deploy your application to Vercel production:

```bash
vercel --prod
```

The CLI will prompt you with questions:

- **Set up and deploy?** → Yes (Y)
- **Which scope?** → Select your account/team
- **Link to existing project?** → Yes (Y) if project exists, or configure new project

Wait for the build and deployment to complete. You'll receive a production URL when done.

```bash
# Add database URL
vercel env add NEXT_PUBLIC_DATABASE_URL production

# Add base URL
vercel env add NEXT_PUBLIC_BASE_URL production
```

When prompted, paste the respective values.

#### Verify Environment Variables

```bash
vercel env ls
```

This should show both variables configured for production.

### 4. Redeploy After Adding Environment Variables

After adding environment variables, redeploy to apply them:

```bash
vercel --prod
```

Once everything is configured, redeploying is simple:

```bash
# Build locally to verify (optional but recommended)
npm run build

# Deploy to production
vercel --prod
```

That's it! Your changes will be live in ~30 seconds.

## Troubleshooting

### "Failed to load links" Error

**Cause**: Missing `NEXT_PUBLIC_DATABASE_URL` environment variable

**Solution**:

1. Add the environment variable (see Step 3 above)
2. Redeploy: `vercel --prod`

### Build Failures

**Cause**: TypeScript or build errors

**Solution**:

1. Run `npm run build` locally to see the exact error
2. Fix the errors
3. Commit and redeploy

### Database Connection Issues

**Cause**: Incorrect database URL or database not accessible

**Solution**:

1. Verify your Neon database is active
2. Check the connection string is correct
3. Ensure SSL mode is included: `?sslmode=require`
4. Test locally with the same connection string

## Useful Commands

```bash
# Check deployment status
vercel ls

# View environment variables
vercel env ls

# View specific deployment details
vercel inspect [deployment-url]

# View logs (add to most recent deployment)
vercel logs [deployment-url]

# Remove a deployment
vercel rm [deployment-url]
```

## Production Checklist

Before considering deployment complete:

- [ ] Application builds successfully locally
- [ ] All environment variables are configured
- [ ] Deployment protection is disabled
- [ ] Production URL is accessible without login
- [ ] Can create new short links
- [ ] Can redirect using short codes
- [ ] Click tracking works
- [ ] Dashboard loads without errors
- [ ] Health endpoint works (`/health`)

## Project URLs

- **Production**: https://tinylink-evlsgtt5d-ajays-projects-4590e44e.vercel.app
- **Vercel Dashboard**: https://vercel.com/ajays-projects-4590e44e/tinylink
- **Environment Variables**: https://vercel.com/ajays-projects-4590e44e/tinylink/settings/environment-variables
- **Deployment Protection**: https://vercel.com/ajays-projects-4590e44e/tinylink/settings/deployment-protection

## Notes

- Vercel automatically deploys when you push to your main branch (if GitHub integration is enabled)
- Free tier includes unlimited deployments
- Build logs are available in the Vercel dashboard
- Each deployment gets a unique preview URL
- Production URL remains consistent

---

**Last Updated**: 2025-11-23
