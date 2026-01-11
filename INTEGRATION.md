# Frontend-Backend Integration Documentation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                      │
│                   http://localhost:3000                     │
├─────────────────────────────────────────────────────────────┤
│  Pages                    │  Services                       │
│  ├── / (Home)            │  ├── api.service.ts             │
│  ├── /news/[slug]        │  ├── blog.service.ts            │
│  ├── /categories/[slug]  │  ├── categorie.service.ts       │
│  ├── /admin-secruty/*    │  ├── auth.service.ts            │
│  ├── /books              │  └── admin-news.service.ts      │
│  └── /map                │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼ HTTP REST API
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND (Express.js)                    │
│                   http://localhost:5001                     │
├─────────────────────────────────────────────────────────────┤
│  Routes                   │  Models                         │
│  ├── /api/news           │  ├── News.js                    │
│  ├── /api/categories     │  ├── Category.js                │
│  └── /api/admin          │  └── Admin.js                   │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        MongoDB                              │
│              (via MONGODB_URI in .env)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Service Files Explained

### 1. `api.service.ts` - Core REST API Layer

**Purpose**: Base layer for connecting to backend REST API.

**Key Functions**:
| Function | Description |
|----------|-------------|
| `fetchNews()` | Get all published news |
| `fetchNewsById(id)` | Get single news by MongoDB ID |
| `fetchNewsBySlug(slug)` | Get single news by URL slug |
| `fetchCategories()` | Get all categories |
| `fetchCategoryWithNews(slug)` | Get category with its news |
| `checkApiHealth()` | Check if backend is online |

**Data Transformation**:
```typescript
// Backend response → Frontend interface
function transformNewsToFrontend(news: BackendNews): INews {
  return {
    id: news._id,
    titleKr: news.title,      // Both use same title for now
    titleUz: news.title,
    slug: news.slug,
    image: { url: news.image || placeholderImage },
    categories: news.categories.map(cat => ({
      slug: cat.id,
      title: cat.name
    })),
    // ...
  };
}
```

---

### 2. `blog.service.ts` - News Service

**Purpose**: High-level wrapper for news fetching used by pages.

```typescript
export async function getBlogs(): Promise<INews[]> {
  return fetchNews();  // Uses api.service.ts
}

export async function getBlog(slug: string): Promise<INews | null> {
  return fetchNewsBySlug(slug);
}
```

---

### 3. `categorie.service.ts` - Categories Service

**Purpose**: High-level wrapper for categories.

```typescript
export async function getCategories(): Promise<ICategorie[]> {
  return fetchCategories();
}

export async function getCategorieNews(slug: string): Promise<ICategorieNews | null> {
  return fetchCategoryWithNews(slug);
}
```

---

### 4. `auth.service.ts` - Admin Authentication

**Purpose**: Handle admin login/logout and token management.

**Key Functions**:
| Function | Description |
|----------|-------------|
| `login(username, password)` | Authenticate admin |
| `logout()` | Clear auth token |
| `getToken()` | Get stored JWT token |
| `getStoredAdmin()` | Get stored admin info |
| `isAuthenticated()` | Check if logged in |
| `authFetch(url, options)` | Make authenticated API calls |

**Token Storage**: Uses `localStorage` with keys:
- `admin_token` - JWT token
- `admin_user` - Admin user object

---

### 5. `admin-news.service.ts` - News CRUD Operations

**Purpose**: Admin panel news management.

**Key Functions**:
| Function | Description | Auth Required |
|----------|-------------|---------------|
| `getAdminNews(page, limit)` | List all news | ✅ |
| `getNewsById(id)` | Get single news | ❌ |
| `createNews(data)` | Create news | ✅ |
| `updateNews(id, data)` | Update news | ✅ |
| `deleteNews(id)` | Delete news | ✅ |
| `uploadImage(file)` | Upload to Cloudinary | ✅ |
| `getAdminCategories()` | List categories | ❌ |
| `getDashboardStats()` | Get counts for dashboard | ❌ |

---

## API Endpoints Reference

### Public Endpoints (No Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/news` | List news with pagination |
| GET | `/api/news/:id` | Get news by ID |
| GET | `/api/categories` | List all categories |
| GET | `/api/categories/:slug` | Get category with news |
| GET | `/api/health` | Health check |

### Admin Endpoints (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/profile` | Get admin profile |
| POST | `/api/news` | Create news |
| PUT | `/api/news/:id` | Update news |
| DELETE | `/api/news/:id` | Delete news |
| POST | `/api/news/upload` | Upload image |

---

## How Requests Flow

### Example: Loading Homepage

```
1. User visits http://localhost:3000
   │
2. hero.tsx calls getBlogs()
   │
3. blog.service.ts → fetchNews()
   │
4. api.service.ts makes HTTP GET to:
   http://localhost:5001/api/news
   │
5. Backend returns JSON:
   { success: true, data: [...] }
   │
6. api.service.ts transforms data:
   BackendNews[] → INews[]
   │
7. Component renders news cards
```

### Example: Admin Login

```
1. User enters credentials at /admin-secruty/login
   │
2. login(username, password) called
   │
3. POST http://localhost:5001/api/admin/login
   │
4. Backend returns:
   { success: true, data: { admin: {...}, token: "..." } }
   │
5. Token saved to localStorage
   │
6. Redirect to dashboard
```

---

## Environment Configuration

### Frontend (`security-news/.env`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Backend (`dx.project 2/.env`)
```env
PORT=5001
MONGODB_URI=mongodb://...
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## Running the Application

### Start Backend
```bash
cd "dx.project 2"
PORT=5001 npm run dev
```

### Start Frontend
```bash
cd security-news
npm run dev
```

### Access URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api
- **Admin Panel**: http://localhost:3000/uz/admin-secruty/login
