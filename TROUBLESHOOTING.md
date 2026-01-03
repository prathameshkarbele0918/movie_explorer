# Troubleshooting: No Data Showing

## Important: You Need to Search First!

The app starts with an **empty state** - this is normal! You need to:
1. **Type at least 2 characters** in the search bar (e.g., "batman")
2. **Click Search** or press Enter
3. Then you'll see movie results

## Step-by-Step Debugging

### 1. Check if Dev Server was Restarted
- **Did you restart the dev server after adding the token?**
- Stop it (Ctrl+C) and start again: `npm run dev`
- Environment variables only load when Vite starts!

### 2. Verify Token is Loaded
- Open browser console (F12)
- Go to Console tab
- Type: `import.meta.env.VITE_TMDB_API_TOKEN`
- Press Enter
- **Should show your token** (if it shows `undefined`, the token isn't loaded)

### 3. Check for Errors
- Open browser console (F12)
- Look for red error messages
- Common errors:
  - `VITE_TMDB_API_TOKEN is not set` = Token not loaded (restart server)
  - `401 Unauthorized` = Token is invalid
  - `429 Too Many Requests` = Rate limit (wait a bit)

### 4. Try a Search
- Type "batman" in search bar
- Click Search button
- Watch the Network tab in DevTools
- **You should see API calls to `api.themoviedb.org`**

### 5. If Still Not Working

**Check .env.local file:**
- File should be in root directory (same folder as `package.json`)
- File name must be exactly `.env.local` (not `.env.local.txt`)
- Content should be: `VITE_TMDB_API_TOKEN=your_token_here`
- No spaces around `=`
- No quotes around the token

**Verify token is correct:**
- Token should start with `eyJhbGciOiJIUzI1NiJ9...`
- Make sure you copied the full token (it's very long)
- Make sure there are no extra spaces or line breaks

## Quick Test

1. **Restart dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **In browser console (F12), check:**
   ```javascript
   import.meta.env.VITE_TMDB_API_TOKEN
   ```
   Should show your token

3. **Search for a movie:**
   - Type "batman" 
   - Click Search
   - Should see movie results!

## Expected Behavior

- **Initial load:** Empty state with "Search for movies to get started" ✅ Normal!
- **After searching:** Movie cards appear with posters, titles, ratings ✅ Success!
- **Network tab:** Should show requests to `api.themoviedb.org/3/...` ✅ Working!

