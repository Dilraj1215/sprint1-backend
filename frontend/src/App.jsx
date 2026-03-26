import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import Shell from './layout/Shell';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import TasksScreen from './screens/TasksScreen';
import CategoriesScreen from './screens/CategoriesScreen';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />

          {/* Protected routes — rendered inside the Shell layout */}
          <Route element={<Shell />}>
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/tasks" element={<TasksScreen />} />
            <Route path="/categories" element={<CategoriesScreen />} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
