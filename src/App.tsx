import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Tools } from './pages/Tools';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { AuthProvider } from './lib/supabase/AuthProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ResetPassword } from './pages/auth/ResetPassword';
import { UpdatePassword } from './pages/auth/UpdatePassword';
import { Calculator } from './pages/tools/Calculator';
import { PomodoroTimer } from './pages/tools/PomodoroTimer';

function App(): JSX.Element {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="update-password" element={<UpdatePassword />} />
            <Route path="tools" element={<Tools />} />
            <Route path="tools/calculator" element={<Calculator />} />
            <Route path="tools/pomodoro" element={<PomodoroTimer />} />
            <Route
              path="account/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;