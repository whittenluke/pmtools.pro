import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Tools } from './pages/Tools';
import { Dashboard } from './pages/Dashboard';
import { testConnection } from './lib/supabase/client';

function App() {
  useEffect(() => {
    // Test Supabase connection on app load
    testConnection()
      .then(isConnected => {
        if (isConnected) {
          console.log('✅ Connected to Supabase');
        } else {
          console.log('❌ Failed to connect to Supabase');
        }
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tools" element={<Tools />} />
          <Route path="account/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;