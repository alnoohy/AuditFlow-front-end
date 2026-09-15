import { useContext } from 'react';
import { Route, Routes } from 'react-router';

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

// Context
import { UserContext } from './contexts/UserContext';

const previewAuditRequests = [
  {
    _id: '1',
    title: 'Finance Department Audit',
    description: 'Review financial records and supporting documents.',
    status: 'pending',
    priority: 'high',
    department: { name: 'Finance' },
    deadline: '2026-09-30',
  },
  {
    _id: '2',
    title: 'IT Security Review',
    description: 'Review system access and security procedures.',
    status: 'under review',
    priority: 'medium',
    department: { name: 'IT' },
    deadline: '2026-10-05',
  },
];

const previewAuditRequest = {
  _id: '1',
  title: 'Finance Department Audit',
  description: 'Review financial records and supporting documents.',
  status: 'pending',
  priority: 'high',
  department: { name: 'Finance' },
  assignedTo: { username: 'Ahmed' },
  createdBy: { username: 'Maryam' },
  deadline: '2026-09-30',
};

const App = () => {
  const { user } = useContext(UserContext);

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
          path="/audit-requests/:requestId/edit"
          element={<EditAuditRequest />}
         />

        <Route
          path="/sign-in"
          element={<SignInForm />}
        />

        <Route
          path="/preview-audit-requests"
          element={
            <AuditRequestList auditRequests={previewAuditRequests} />
          }
        />

        <Route
          path="/preview-audit-request-details"
          element={
            <AuditRequestDetails previewRequest={previewAuditRequest} />
          }
        />

        <Route
          path="/preview-audit-request-form"
          element={<AuditRequestForm />}
        />
      </Routes>
    </>
  );
};

export default App;