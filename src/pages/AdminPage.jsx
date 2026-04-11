import { useState } from 'react';
import LoginForm from '../components/admin/LoginForm';
import AdminShell from '../components/admin/AdminShell';

// NOTE: The /admin route works correctly on localhost.
// On GitHub Pages (static hosting), navigating directly to /admin will 404
// because there is no server to handle the route. Access admin via the
// running dev server locally, then deploy with `npm run deploy`.
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('admin-auth') === 'true'
  );

  if (!isAuthenticated) {
    return <LoginForm onLogin={() => setIsAuthenticated(true)} />;
  }
  return <AdminShell onLogout={() => setIsAuthenticated(false)} />;
}
