# Deployment Guide

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

## Setup Instructions

### 1. Push to GitHub
Make sure your code is pushed to a GitHub repository:
```bash
git add .
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

### 2. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically run and deploy your site

### 3. Access Your Deployed Site
After the first successful deployment, your site will be available at:
```
https://[your-username].github.io/[repository-name]
```

## Workflow Details

The deployment workflow (`.github/workflows/deploy.yml`) will:
- Automatically trigger on pushes to `main` or `master` branch
- Can be manually triggered from the Actions tab
- Deploy all static files to GitHub Pages
- Provide a public URL for your educational website

## Manual Deployment
You can also manually trigger the deployment:
1. Go to the **Actions** tab in your repository
2. Click on **Deploy to GitHub Pages** workflow
3. Click **Run workflow** button

## File Structure
The workflow deploys the entire repository except for:
- Files listed in `.gitignore`
- Git-related files
- GitHub Actions workflow files

Your educational website structure with multiple standards (std1-std6) and subjects will be preserved and accessible via the deployed URL.

## Troubleshooting
If deployment fails:
1. Check the Actions tab for error messages
2. Ensure the repository has proper permissions
3. Verify that Pages is enabled in repository settings
4. Make sure you're pushing to the correct branch (main/master) 