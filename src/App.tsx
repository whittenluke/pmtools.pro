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
import { ProjectEstimation } from './pages/tools/ProjectEstimation.tsx';
import { DecisionMatrix } from './pages/tools/DecisionMatrix';
import { Notes } from './pages/tools/Notes';
import { SupabaseProvider } from './lib/supabase/supabase-context';

function App(): JSX.Element {
  return (
    <SupabaseProvider>
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
              <Route path="tools/estimation" element={<ProjectEstimation />} />
              <Route path="tools/decision-matrix" element={<DecisionMatrix />} />
              <Route path="tools/notes" element={<Notes />} />
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
    </SupabaseProvider>
  );
}

export default App;