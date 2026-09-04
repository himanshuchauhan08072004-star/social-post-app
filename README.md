# Loop — Mini Social Post App

3W Full Stack Internship Assignment — Task 1. A minimal social feed (TaskPlanet-inspired) where users sign up, post text/images, like, and comment in real time.

## Features
- Email/password signup & login (JWT auth, bcrypt hashing)
- Create posts: text only, image only, or both
- Public feed, newest first, with pagination ("Load More")
- Like/unlike posts (toggle, one like per user, instant UI update)
- Comment on posts (instant UI update, usernames shown)
- Fully responsive (mobile/tablet/desktop), MUI + custom CSS, no Tailwind

## Tech Stack
- **Frontend:** React 18 (Vite), React Router, MUI, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas) via Mongoose — exactly 2 collections: `users`, `posts` (likes/comments embedded in `posts`)
- **Images:** Cloudinary (via multer-storage-cloudinary)
- **Auth:** JWT + bcryptjs

## Project Structure
```
social-post-app/
  backend/
    src/
      config/       db.js, cloudinary.js
      controllers/  authController.js, postController.js
      middleware/   auth.js, errorHandler.js
      models/       User.js, Post.js
      routes/       authRoutes.js, postRoutes.js
      utils/        generateToken.js, upload.js
      app.js, server.js
    .env.example
  frontend/
    src/
      components/   Navbar, CreatePost, PostCard, CommentSection, ProtectedRoute
      context/       AuthContext.jsx
      pages/         Login, Signup, Feed
      services/      api.js, authService.js, postService.js
      styles/        App.css
    .env.example
```

## Environment Variables

**backend/.env**
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/social-post-app?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

## Local Setup
```bash
# Backend
cd backend
npm install
cp .env.example .env   # fill in real values
npm run dev             # http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev              # http://localhost:5173
```

## MongoDB Setup
1. Create a free cluster on MongoDB Atlas.
2. Add a database user + allow network access (0.0.0.0/0 for dev, or Render's IP for prod).
3. Copy the connection string into `MONGODB_URI`. Database creates itself with `users` and `posts` collections on first write.

## Cloudinary Setup
1. Create a free Cloudinary account.
2. Copy Cloud Name, API Key, API Secret into backend `.env`.
3. Uploads go to the `social-post-app` folder in your Cloudinary media library.

## API Endpoints
| Method | Route | Description | Auth |
|---|---|---|---|
| POST | /api/auth/signup | Register a new user | No |
| POST | /api/auth/login | Login, returns JWT | No |
| GET | /api/auth/me | Current user | Yes |
| GET | /api/posts?page=&limit= | Paginated feed | Yes |
| POST | /api/posts | Create post (multipart: text, image) | Yes |
| DELETE | /api/posts/:id | Delete own post | Yes |
| POST | /api/posts/:id/like | Toggle like/unlike | Yes |
| POST | /api/posts/:id/comments | Add comment | Yes |
| GET | /api/posts/:id/comments | Get comments | Yes |

## Deployment

**Backend (Render):**
1. New Web Service → connect repo → root directory `backend`.
2. Build command: `npm install`. Start command: `npm start`.
3. Add all backend env vars in Render dashboard (use your deployed frontend URL for `CLIENT_URL`).

**Frontend (Vercel/Netlify):**
1. Import repo → root directory `frontend`.
2. Build command: `npm run build`. Output dir: `dist`.
3. Add `VITE_API_URL` = your deployed backend URL + `/api`.

**Database:** MongoDB Atlas (see setup above).

## Screenshots
_Add screenshots here after running the app locally._

## Demo URL
_Add deployed frontend URL here._

## GitHub Repository
_Add repository link here._
