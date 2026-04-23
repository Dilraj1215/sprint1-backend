import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import Shell from './layout/Shell';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import TasksScreen from './screens/TasksScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import ProfileScreen from './screens/ProfileScreen';
import NotFoundScreen from './screens/NotFoundScreen';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Public routes */}
          <Route path="/login"    element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />

          {/* Protected routes — rendered inside the Shell layout */}
          <Route element={<Shell />}>
            <Route path="/dashboard"  element={<DashboardScreen />} />
            <Route path="/tasks"      element={<TasksScreen />} />
            <Route path="/categories" element={<CategoriesScreen />} />
            <Route path="/profile"    element={<ProfileScreen />} />
          </Route>

          {/* 404 — catch all unmatched routes */}
          <Route path="*" element={<NotFoundScreen />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
