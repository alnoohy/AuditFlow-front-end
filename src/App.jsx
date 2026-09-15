import { useContext, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router';

// Components
import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Dashboard from './components/Dashboard/Dashboard';
import Landing from './components/Landing/Landing';

import AuditRequestList from './components/AuditRequestList/AuditRequestList';
import AuditRequestDetails from './components/AuditRequestDetails/AuditRequestDetails';
import AuditRequestForm from './components/AuditRequestForm/AuditRequestForm';
import EditAuditRequest from './components/EditAuditRequest/EditAuditRequest';

// Services
import * as auditRequestService from './services/auditRequestService';

// Context
import { UserContext } from './contexts/UserContext';

const App = () => {
  const { user } = useContext(UserContext);

  const location = useLocation();

  const [auditRequests, setAuditRequests] = useState([]);

  useEffect(() => {
    const fetchAuditRequests = async () => {
      if (!user) {
        setAuditRequests([]);
        return;
      }

      try {
        const requestData = await auditRequestService.index();

        setAuditRequests(requestData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAuditRequests();
  }, [user, location.pathname]);

  return (
    <>
      <NavBar />

      <Routes>
        <Route
          path="/"
          element={user ? <Dashboard /> : <Landing />}
        />

        <Route
          path="/sign-up"
          element={<SignUpForm />}
        />

        <Route
          path="/sign-in"
          element={<SignInForm />}
        />

        <Route
          path="/audit-requests"
          element={
            user
              ? <AuditRequestList auditRequests={auditRequests} />
              : <Landing />
          }
        />

        <Route
          path="/audit-requests/new"
          element={
            user?.role === 'auditor'
              ? <AuditRequestForm />
              : <Dashboard />
          }
        />

        <Route
          path="/audit-requests/:requestId"
          element={
            user
              ? <AuditRequestDetails />
              : <Landing />
          }
        />

        <Route
          path="/audit-requests/:requestId/edit"
          element={
            user?.role === 'auditor'
              ? <EditAuditRequest />
              : <Dashboard />
          }
        />
      </Routes>
    </>
  );
};

export default App;