# Cloudinary Setup for Alexandria's World

## Why Cloudinary?
- **Free 25GB storage** (you have 6.1GB of images)
- **25GB bandwidth/month** (perfect for demos/presentations)
- **Global CDN** (fast loading worldwide)
- **Auto-optimization** (automatically compresses images)
- **No credit card required**

## Step 1: Create Free Account

1. Go to: https://cloudinary.com/users/register_free
2. Sign up with your email
3. Verify email
4. You'll get:
   - Cloud name (e.g., `dxxxxx123`)
   - API Key
   - API Secret

## Step 2: Get Your Credentials

After signup, go to Dashboard → Settings → Access Keys

You'll see:
```
Cloud name: dxxxxx123
API Key: 123456789012345
API Secret: abcdefghijklmnopqrstuvwxyz
```

## Step 3: Install Cloudinary CLI

```bash
npm install -g cloudinary-cli
```

## Step 4: Configure CLI

```bash
cloudinary config
# Enter your Cloud name, API Key, and API Secret
```

## Step 5: Upload All Images

I'll create a script to upload all 197 countries automatically.

## Step 6: Update books.json

Images will be accessible at:
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/alexandrias-world/afghanistan/page_01_cover.png
```

## Alternative: Manual Upload

If CLI doesn't work, you can:
1. Go to Cloudinary Dashboard → Media Library
2. Create folder "alexandrias-world"
3. Drag and drop country folders
4. Get URLs from the dashboard
