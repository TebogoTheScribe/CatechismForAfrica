
## Setup Steps (One-time)

### 1. Enable Netlify Identity

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site: **catechism-for-africa**
3. Go to **Identity** tab
4. Click **"Enable Identity"**
5. Under **Registration preferences**, select:
   - **"Invite only"** (recommended for security)
   - Or **"Open"** if you want anyone to sign up

### 2. Enable Git Gateway

1. In the same Identity section
2. Click **"Services"** → **"Git Gateway"**
3. Click **"Enable Git Gateway"**
4. This allows the CMS to write changes to your GitHub repo

### 3. Add Yourself as a User

1. Go to **Identity** → **"Users"**
2. Click **"Invite users"**
3. Enter your email address
4. Click **"Send"**
5. Check your email and accept the invitation
6. Set your password

### 4. Access the Dashboard

1. Visit: `https://catechism-for-africa.netlify.app/admin/`
2. Click **"Login with Netlify Identity"**
3. Enter your email and password
4. You're in! 🎉

## What You Can Edit

### Video Content
- Add/edit video titles and descriptions
- Update YouTube video IDs (when your videos are ready)
- Change categories, durations, and difficulty levels
- Mark videos as Published, Coming Soon, or Draft

### Pricing Plans
- Update prices for Monthly, Annual, and Group plans
- Add/remove features from each plan
- Mark which plan is "Featured"

### Site Settings
- Update hero text and taglines
- Change site title and description

### About Page
- Edit mission, story, and approach text
- Update core values

## How Changes Work

1. You make edits in the CMS dashboard
2. Click **"Save"** → creates a draft
3. Click **"Publish"** → commits to GitHub
4. Netlify auto-deploys in ~1 minute
5. Your live site updates automatically!

## Adding Real YouTube Videos

When your video content is ready:

1. Upload to YouTube
2. Get the video ID (the part after `v=` in the URL)
   - Example: `https://www.youtube.com/watch?v=ABC123XYZ` → ID is `ABC123XYZ`
3. Go to CMS → Video Content → Edit the video
4. Paste the ID in "YouTube Video ID" field
5. Change Status to "Published"
6. Save and Publish
7. The video will appear on your site!

## Need Help?

Contact your assistant for:
- Adding new content collections
- Customizing the CMS interface
- Troubleshooting login issues
- Adding more editors/users
