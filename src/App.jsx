import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthStack from './stacks/AuthStack';
import AppStack from './stacks/AppStack';
import RegistrationStack from './stacks/RegistrationStack';
import RegistrationSuccess from './screen/registration/registrationSuccess/RegistrationSuccess';

const App = () => {
  const { isAuthenticated, accessLevel } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <Route path="/*" element={<AuthStack />} />
        ) : accessLevel === "REGISTRATION" ? (
          <Route path="/*" element={<RegistrationStack />} />
        ) : accessLevel === "DASHBOARD" ? (
          <Route path="/*" element={<AppStack />} />
        ) : accessLevel === "APPROVAL" ? (
          <Route path="/*" element={<RegistrationSuccess />} /> //  <RegistrationStack />   <Navigate to="/registration-success" />
        ) : (
          <Route path="/*" element={<AuthStack />} /> // Fallback for undefined accessLevel
        )}
      </Routes>
    </Router>
  );
};

export default App;