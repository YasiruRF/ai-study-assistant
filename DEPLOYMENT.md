# Deployment Guide

This guide provides instructions for deploying the StudyAI application to various platforms.

## Frontend Deployment (Vercel)

The frontend of this application is built with Next.js and can be easily deployed to Vercel.

### Steps:

1. Create a Vercel account if you don't have one: [https://vercel.com/signup](https://vercel.com/signup)

2. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

3. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

4. Login to Vercel:
   ```bash
   vercel login
   ```

5. Deploy the application:
   ```bash
   vercel
   ```

6. For production deployment:
   ```bash
   vercel --prod
   ```

7. Configure environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: URL of your backend API

## Backend Deployment Options

### Option 1: Railway

Railway is a modern platform for deploying applications with built-in databases.

1. Create a Railway account: [https://railway.app/](https://railway.app/)

2. Install the Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

3. Login to Railway:
   ```bash
   railway login
   ```

4. Navigate to the backend directory:
   ```bash
   cd backend
   ```

5. Initialize a new Railway project:
   ```bash
   railway init
   ```

6. Add a MongoDB database:
   ```bash
   railway add
   ```

7. Deploy the application:
   ```bash
   railway up
   ```

8. Configure environment variables in the Railway dashboard:
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret for JWT token generation
   - `OPENAI_API_KEY`: Your OpenAI API key

### Option 2: Heroku

1. Create a Heroku account: [https://signup.heroku.com/](https://signup.heroku.com/)

2. Install the Heroku CLI:
   ```bash
   npm install -g heroku
   ```

3. Login to Heroku:
   ```bash
   heroku login
   ```

4. Navigate to the backend directory:
   ```bash
   cd backend
   ```

5. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```

6. Add MongoDB add-on or use MongoDB Atlas:
   ```bash
   heroku addons:create mongodb
   ```

7. Configure environment variables:
   ```bash
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set OPENAI_API_KEY=your_openai_api_key
   ```

8. Deploy the application:
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Option 3: Digital Ocean App Platform

1. Create a Digital Ocean account: [https://cloud.digitalocean.com/registrations/new](https://cloud.digitalocean.com/registrations/new)

2. From the Digital Ocean dashboard, click "Create" and select "Apps"

3. Connect your GitHub repository

4. Configure the app:
   - Select the backend directory
   - Add environment variables
   - Configure the build command: `npm install && npm run build`
   - Configure the run command: `npm start`

5. Deploy the app

## Connecting Frontend to Backend

After deploying both the frontend and backend, update the API URL in the frontend configuration:

1. In the Vercel dashboard, go to your project settings

2. Add an environment variable:
   - `NEXT_PUBLIC_API_URL`: The URL of your deployed backend API

3. Redeploy the frontend to apply the changes

## Setting Up MongoDB Atlas (Cloud Database)

1. Create a MongoDB Atlas account: [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)

2. Create a new cluster (the free tier is sufficient for starting)

3. Configure database access:
   - Create a database user with password
   - Configure network access (IP whitelist)

4. Get your connection string and update your backend environment variables

## Continuous Deployment

Both Vercel and the backend platforms support continuous deployment from GitHub. Connect your repository to enable automatic deployments when you push changes.