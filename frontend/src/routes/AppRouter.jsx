import { Route, Routes } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Categories from '../pages/dashboard/Categories';
import CreatePost from '../pages/dashboard/CreatePost';
import Dashboard from '../pages/dashboard/Dashboard';
import EditPost from '../pages/dashboard/EditPost';
import MyPosts from '../pages/dashboard/MyPosts';
import Profile from '../pages/dashboard/Profile';
import { AuthorPosts, CategoryPosts, SearchPosts, TagPosts } from '../pages/FilteredPosts';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import PostDetail from '../pages/PostDetail';
import ProtectedRoute, { GuestRoute } from './ProtectedRoute';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public */}
        <Route index element={<Home />} />
        <Route path="posts/:slug" element={<PostDetail />} />
        <Route path="category/:slug" element={<CategoryPosts />} />
        <Route path="tag/:slug" element={<TagPosts />} />
        <Route path="authors/:id" element={<AuthorPosts />} />
        <Route path="search" element={<SearchPosts />} />

        {/* Guests only */}
        <Route element={<GuestRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Logged in */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />}>
            <Route index element={<MyPosts />} />
            <Route path="posts/new" element={<CreatePost />} />
            <Route path="posts/:slug/edit" element={<EditPost />} />
            <Route path="profile" element={<Profile />} />
            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="categories" element={<Categories />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
