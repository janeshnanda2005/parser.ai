# Deployment Guide - Fix for Google Sign-In Error

## Problem
After signing in with Google on the Vercel deployment, you get: **"This site can't be reached - localhost refused to connect"**

## Root Cause
Supabase's **Authorized Redirect URLs** don't include your Vercel app URL. When Google OAuth completes, Supabase redirects to localhost (the default), which doesn't exist in production.

---

## Solution: Update Supabase Configuration

### Step 1: Add Your Vercel App URL to Supabase
1. Go to **Supabase Dashboard** → Your Project → **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, add your Vercel app URL:
   ```
   https://parser-ai-phi.vercel.app
   https://parser-ai-phi.vercel.app/search
   https://parser-ai-phi.vercel.app/login
   https://parser-ai-phi.vercel.app/register
   ```
3. Click **Save**

### Step 2: Verify Vercel Environment Variables
Set these in your **Vercel Project Settings** → **Environment Variables**:

```
VITE_API_URL=https://parser-ai.onrender.com/api
VITE_SUPABASE_URL=https://qnaspllidbpsnfntoisx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_pxsjFwmJQQh6ff5loxy8dw_RDGLmrbn
```

### Step 3: Redeploy on Vercel
- Go to **Vercel Dashboard** → Your Project → **Deployments**
- Click **Redeploy** on the latest deployment or push a new commit to trigger a rebuild

### Step 4: Test the Auth Flow
1. Go to your Vercel app: `https://parser-ai-phi.vercel.app`
2. Click **Login** or **Sign up**
3. Click **Continue with Google**
4. After Google OAuth, you should be redirected to `/search` on your Vercel app ✅

---

## Additional Notes

### Local Development
For local testing, keep `.env` pointing to localhost:
```
VITE_API_URL=http://localhost:5000/api
```

And add `http://localhost:3000` to Supabase's Redirect URLs (already typically enabled).

### Files Modified
- ✅ `vercel.json` - Removed Python API build (backend on Render)
- ✅ `.env` - Updated to use Render backend
- ✅ `.env.production` - Created for Vercel builds
- ✅ `.env.example` - Updated with correct URLs

### Architecture
```
Frontend (Vercel) → Render Backend (https://parser-ai.onrender.com/api)
                 → Supabase Auth (Google OAuth)
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Still redirects to localhost | Clear browser cache & cookies, then try again |
| "Redirect URL mismatch" error | Make sure you added the URL to Supabase Redirect URLs list |
| API calls still fail | Verify Render backend is running at `https://parser-ai.onrender.com/api` |
| Environment variables not picked up | Redeploy on Vercel after adding env vars |

