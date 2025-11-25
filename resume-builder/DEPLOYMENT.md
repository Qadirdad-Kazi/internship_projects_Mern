# Resume Builder - Production Deployment Guide

This guide will walk you through deploying the Resume Builder application to production using Vercel (backend) and Netlify (frontend).

## 📋 Prerequisites

- [GitHub](https://github.com) account
- [Vercel](https://vercel.com) account
- [Netlify](https://netlify.com) account
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- Node.js 18+ installed locally

## 🚀 Quick Start

```bash
# 1. Validate your environment
node validate-env.js

# 2. Run deployment preparation
./deploy.sh

# 3. Follow the platform-specific steps below
```

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (M0 free tier is sufficient for development)
3. Create a database user with read/write permissions
4. Add your IP address to the IP whitelist (or 0.0.0.0/0 for global access)

### 2. Get Connection String
1. In Atlas dashboard, click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password

Example connection string:
```
mongodb+srv://username:password@cluster0.example.mongodb.net/resume-builder?retryWrites=true&w=majority
```

## ⚙️ Backend Deployment (Vercel)

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Production deployment setup"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty (serverless functions)
   - **Output Directory**: Leave empty

### 3. Configure Environment Variables
In Vercel project settings → Environment Variables, add:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.example.mongodb.net/resume-builder?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-here-min-32-chars
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
CORS_ORIGIN=https://your-frontend.netlify.app
NODE_ENV=production
API_VERSION=v1
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
MAX_FILE_SIZE=10485760
```

**Important**: Replace the placeholder values:
- `MONGODB_URI`: Your actual MongoDB Atlas connection string
- `JWT_SECRET`: Generate a secure 32+ character secret
- `CORS_ORIGIN`: Your actual Netlify app URL

### 4. Deploy
1. Click "Deploy" in Vercel
2. Wait for deployment to complete
3. Note your API URL: `https://your-project.vercel.app`

### 5. Test Backend
Visit `https://your-project.vercel.app/health` to verify deployment.

## 🌐 Frontend Deployment (Netlify)

### 1. Configure Environment Variables
Create/update `frontend/.env.production`:

```env
VITE_API_URL=https://your-vercel-project.vercel.app/api/v1
VITE_APP_NAME=Resume Builder
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
```

### 2. Commit Environment Changes
```bash
git add frontend/.env.production
git commit -m "Add frontend production environment"
git push origin main
```

### 3. Deploy to Netlify
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "New site from Git"
3. Choose GitHub and select your repository
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

### 4. Configure Environment Variables
In Netlify site settings → Environment variables, add:

```env
VITE_API_URL=https://your-vercel-project.vercel.app/api/v1
VITE_APP_NAME=Resume Builder
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
```

### 5. Deploy
1. Click "Deploy site"
2. Wait for build and deployment
3. Note your site URL: `https://amazing-app-name.netlify.app`

### 6. Update Backend CORS
Update your Vercel environment variables:
- Set `CORS_ORIGIN` to your actual Netlify URL
- Redeploy the backend

## 🔧 Post-Deployment Configuration

### 1. Update CORS Origins
In your Vercel backend environment variables:
```env
CORS_ORIGIN=https://your-actual-netlify-url.netlify.app
```

### 2. Test Full Application
1. Visit your Netlify URL
2. Test user registration and login
3. Create a resume and test PDF export
4. Verify all functionality works

## 🔍 Verification Checklist

- [ ] Backend health check responds at `/health`
- [ ] Frontend loads without console errors
- [ ] User registration works
- [ ] User login/logout works
- [ ] Resume creation and editing works
- [ ] PDF export generates and downloads
- [ ] Data persists after page reload
- [ ] Mobile responsiveness works

## 🚨 Troubleshooting

### Common Issues

#### CORS Errors
**Problem**: "Access-Control-Allow-Origin" error  
**Solution**: Ensure `CORS_ORIGIN` in Vercel matches your Netlify URL exactly

#### MongoDB Connection Issues
**Problem**: "MongoNetworkError" or connection timeout  
**Solution**: 
- Verify MongoDB Atlas connection string
- Check IP whitelist (add 0.0.0.0/0 for global access)
- Ensure database user has correct permissions

#### Build Failures
**Problem**: Build fails on Netlify/Vercel  
**Solution**:
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Check environment variables are set

#### PDF Export Not Working
**Problem**: PDF generation fails  
**Solution**:
- Check Vercel function timeout (max 30s on free plan)
- Verify all required data is present
- Check browser console for errors

#### Authentication Issues
**Problem**: Login doesn't persist or tokens invalid  
**Solution**:
- Verify JWT_SECRET is set and secure
- Check JWT_EXPIRE format (e.g., "7d", "24h")
- Clear browser localStorage/sessionStorage

### Performance Optimization

#### Backend (Vercel)
- Use lean MongoDB queries
- Implement proper error handling
- Optimize PDF generation for memory usage
- Enable function caching where appropriate

#### Frontend (Netlify)
- Optimize images and assets
- Enable Netlify's asset optimization
- Use code splitting for large components
- Implement proper loading states

### Security Considerations

#### Environment Variables
- Never commit real environment variables to Git
- Use different JWT secrets for different environments
- Regularly rotate sensitive keys
- Use strong, unique passwords for all services

#### CORS Configuration
- Set specific origins instead of wildcards in production
- Use HTTPS everywhere
- Implement rate limiting
- Validate all user inputs

### Monitoring and Maintenance

#### Recommended Monitoring
1. **Vercel**: Monitor function execution time and errors
2. **Netlify**: Monitor build times and site performance
3. **MongoDB Atlas**: Monitor database performance and usage
4. **User Analytics**: Implement user behavior tracking

#### Regular Maintenance
- Update dependencies monthly
- Monitor for security vulnerabilities
- Backup database regularly
- Review and rotate secrets quarterly

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🎯 Custom Domain Setup (Optional)

### Backend Custom Domain
1. In Vercel project settings → Domains
2. Add your custom domain (e.g., `api.myresumebuilder.com`)
3. Configure DNS records as instructed
4. Update frontend `VITE_API_URL` to use custom domain

### Frontend Custom Domain
1. In Netlify site settings → Domain management
2. Add custom domain (e.g., `myresumebuilder.com`)
3. Configure DNS records
4. Update backend `CORS_ORIGIN` to match

---

**Need Help?** 
- Check the troubleshooting section above
- Review application logs in Vercel and Netlify dashboards
- Verify environment variables are correctly set
- Test each component individually

**Success!** 🎉  
Your Resume Builder is now live and ready for users!