# Vercel Deployment Setup

## Setting Up Environment Variables on Vercel

To make the Movie Explorer work on Vercel, you need to add the TMDB API token as an environment variable.

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to your Vercel project:**
   - Visit https://vercel.com
   - Log in to your account
   - Select your project (movie-explorer-ui-06)

2. **Navigate to Settings:**
   - Click on your project
   - Go to **Settings** tab (in the top navigation)
   - Click on **Environment Variables** (in the left sidebar)

3. **Add Environment Variable:**
   - Click **Add New**
   - **Key:** `VITE_TMDB_API_TOKEN`
   - **Value:** `eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMzJkYzE5Y2QzZjMwMWJkMGUxNTVmYTQ3NDFmNGFkZSIsIm5iZiI6MTc2NzQzMDA5MS4xOTkwMDAxLCJzdWIiOiI2OTU4ZDdjYmU1ZTY0YTQ2OWZjYzhmZDIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.dB4w7gCbOcNp__jmkpDkAau3OXe885VybdI1K50guLM`
   - **Environment:** Select all (Production, Preview, Development)
   - Click **Save**

4. **Redeploy:**
   - After adding the environment variable, you need to redeploy
   - Go to **Deployments** tab
   - Click the three dots (⋮) on the latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger a new deployment

### Method 2: Via Vercel CLI

If you have Vercel CLI installed:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variable
vercel env add VITE_TMDB_API_TOKEN

# When prompted, paste your token:
# eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMzJkYzE5Y2QzZjMwMWJkMGUxNTVmYTQ3NDFmNGFkZSIsIm5iZiI6MTc2NzQzMDA5MS4xOTkwMDAxLCJzdWIiOiI2OTU4ZDdjYmU1ZTY0YTQ2OWZjYzhmZDIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.dB4w7gCbOcNp__jmkpDkAau3OXe885VybdI1K50guLM

# Select environments (a = all)
# a

# Pull the latest environment variables (optional)
vercel env pull .env.local
```

### Method 3: Using vercel.json (Not Recommended for Secrets)

⚠️ **Important:** Do NOT commit secrets to git! This method is only for reference.

For public environment variables (not secrets), you can use `vercel.json`:

```json
{
  "env": {
    "VITE_TMDB_API_TOKEN": "your-token-here"
  }
}
```

**But for secrets, always use the Vercel Dashboard (Method 1).**

## Verify It's Working

1. **Check Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - You should see `VITE_TMDB_API_TOKEN` listed

2. **Check Deployment Logs:**
   - Go to Deployments tab
   - Click on a deployment
   - Check build logs - should build successfully

3. **Test the App:**
   - Visit your Vercel URL (e.g., https://movie-explorer-ui-06.vercel.app)
   - Search for a movie
   - Should work just like local!

## Troubleshooting

### Environment Variable Not Working?

1. **Make sure variable name is exact:**
   - `VITE_TMDB_API_TOKEN` (all caps, with underscores)
   - Vite only exposes variables starting with `VITE_`

2. **Redeploy after adding:**
   - Environment variables are only available on new deployments
   - Redeploy your app after adding the variable

3. **Check deployment logs:**
   - Look for any errors in the build process
   - Make sure the build completes successfully

4. **Verify in browser console:**
   - On your Vercel deployment, open browser console (F12)
   - Type: `import.meta.env.VITE_TMDB_API_TOKEN`
   - Should show your token (it will be visible - this is expected with Vite)

## Security Note

⚠️ **Important:** With Vite, environment variables prefixed with `VITE_` are exposed to the client-side code. This means:
- The token will be visible in the browser's built JavaScript
- Anyone can inspect and see the token
- This is a limitation of Vite (vs Next.js where server-side vars are hidden)

For production, consider:
- Using a backend proxy/API route to hide the token
- Migrating to Next.js for server-side API routes
- Using rate limiting and monitoring on TMDB side

