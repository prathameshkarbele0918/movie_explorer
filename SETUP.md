# Quick Setup Guide

## To See Data in the UI, You Need to:

### Step 1: Get TMDB API Token (Free)

1. Go to https://www.themoviedb.org
2. Create an account or log in
3. Go to Account Settings → API: https://www.themoviedb.org/settings/api
4. Request API access (it's free)
5. Copy your **API Read Access Token (v4)**

### Step 2: Create `.env.local` File

1. In the root directory of the project, create a file named `.env.local`
2. Add your TMDB token:

```
VITE_TMDB_API_TOKEN=your_actual_token_here
```

Replace `your_actual_token_here` with the token you copied from TMDB.

### Step 3: Restart Development Server

**IMPORTANT**: You must restart the dev server for environment variables to load!

1. Stop the current server (Ctrl+C)
2. Start it again:
   ```bash
   npm run dev
   ```

### Step 4: Test It

1. Open http://localhost:8080 in your browser
2. Search for a movie (e.g., "batman")
3. You should see movie results!

## Troubleshooting

### Still not working?

1. **Check browser console** (F12) for errors
   - Look for: "VITE_TMDB_API_TOKEN is not set"
   - Look for any API errors

2. **Verify .env.local file**:
   - File should be in the root directory (same level as package.json)
   - Name must be exactly `.env.local` (not `.env.local.txt`)
   - No spaces around the `=` sign
   - Token should be on one line

3. **Check environment variable**:
   - In browser console, type: `import.meta.env.VITE_TMDB_API_TOKEN`
   - Should show your token (for testing only, don't share)

4. **Restart dev server**:
   - Environment variables are only loaded when Vite starts
   - Any changes to `.env.local` require a restart

## Example .env.local file:

```
VITE_TMDB_API_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJ5b3VyX3Rva2VuX2hlcmUiLCJzdWIiOiIxMjM0NTY3ODkwIiwic2NvcGVzIjpbXSwiZXhwIjoxNTE2MjM5MDIyfQ
```

(Use your actual token, not this example!)

