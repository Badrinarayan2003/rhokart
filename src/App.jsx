import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthStack from './stacks/AuthStack';
import AppStack from './stacks/AppStack';
import RegistrationStack from './stacks/RegistrationStack';
import { useEffect } from 'react';

const App = () => {
  const { isAuthenticated, isApproved } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("want to check", isAuthenticated);
    console.log("LocalStorage Token:", localStorage.getItem("token"));
  }, [])

  return (
    <Router>
      <Routes>
        {/* Auth Stack: Only for unauthenticated users */}
        {!isAuthenticated ? (
          <Route path="/*" element={<AuthStack />} />
        ) : !isApproved ? (
          // Registration Stack: Only for authenticated but unapproved users
          <Route path="/*" element={<RegistrationStack />} />
        ) : (
          // App Stack: Only for fully registered and approved users
          <Route path="/*" element={<AppStack />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;



