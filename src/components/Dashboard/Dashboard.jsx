import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';

import { UserContext } from '../../contexts/UserContext';
import * as auditRequestService from '../../services/auditRequestService';

import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(UserContext);

  const [auditRequests, setAuditRequests] = useState([]);

  useEffect(() => {
    const fetchAuditRequests = async () => {
      try {
        const requestData = await auditRequestService.index();

        setAuditRequests(requestData);
      } catch (error) {
        console.log(error);
      }
    };

    if (user) {
      fetchAuditRequests();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const pendingRequests = auditRequests.filter(
    (request) => request.status === 'pending'
  );

  const underReviewRequests = auditRequests.filter(
    (request) => request.status === 'under review'
  );

  const completedRequests = auditRequests.filter(
    (request) => request.status === 'completed'
  );

  const rejectedRequests = auditRequests.filter(
    (request) => request.status === 'rejected'
  );

  const overdueRequests = auditRequests.filter(
    (request) => request.status === 'overdue'
  );

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user.username}</h1>

          <p>
            {user.role === 'admin' && 'System overview and audit progress.'}

            {user.role === 'auditor' &&
              'Manage audit requests and review audit progress.'}

            {user.role === 'employee' &&
              'View your assigned audit requests and deadlines.'}
          </p>
        </div>

        <span className="dashboard-role">
          {user.role}
        </span>
      </div>

      {user.role === 'admin' && (
        <>
          <h2>Admin Overview</h2>

          <section className="dashboard-cards">
            <div className="dashboard-card">
              <h3>Total Requests</h3>
              <p>{auditRequests.length}</p>
            </div>

            <div className="dashboard-card">
              <h3>Pending</h3>
              <p>{pendingRequests.length}</p>
            </div>

            <div className="dashboard-card">
              <h3>Completed</h3>
              <p>{completedRequests.length}</p>
            </div>

            <div className="dashboard-card">
              <h3>Overdue</h3>
              <p>{overdueRequests.length}</p>
            </div>
          </section>

          <section className="dashboard-section">
            <h2>Quick Actions</h2>

            <Link
              to="/audit-requests"
              className="dashboard-action"
            >
              View All Audit Requests
            </Link>
          </section>
        </>
      )}

      {user.role === 'auditor' && (
        <>
          <h2>Auditor Overview</h2>

          <section className="dashboard-cards">
            <div className="dashboard-card">
              <h3>Total Requests</h3>
              <p>{auditRequests.length}</p>
            </div>

            <div className="dashboard-card">
              <h3>Pending</h3>
              <p>{pendingRequests.length}</p>
            </div>

            <div className="dashboard-card">
              <h3>Under Review</h3>
              <p>{underReviewRequests.length}</p>
            </div>

            <div className="dashboard-card">
              <h3>Completed</h3>
              <p>{completedRequests.length}</p>
            </div>

            <div className="dashboard-card">
              <h3>Rejected</h3>
              <p>{rejectedRequests.length}</p>
            </div>

            <div className="dashboard-card">
              <h3>Overdue</h3>
              <p>{overdueRequests.length}</p>
            </div>
          </section>

          <section className="dashboard-section">
            <h2>Quick Actions</h2>

            <div className="dashboard-actions">
              <Link
                to="/audit-requests/new"
                className="dashboard-action"
              >
                Create Audit Request
              </Link>

              <Link
                to="/audit-requests"
                className="dashboard-action"
              >
                View Audit Requests
              </Link>
            </div>
          </section>
        </>
      )}

      {user.role === 'employee' && (
        <>
          <h2>My Audit Requests</h2>

          <section className="dashboard-cards">
            <div className="dashboard-card">
              <h3>Assigned to Me</h3>
              <p>{auditRequests.length}</p>
            </div>

            <div className="dashboard-card">
              <h3>Pending</h3>
              <p>{pendingRequests.length}</p>
            </div>

            <div className="dashboard-card">
              <h3>Under Review</h3>
              <p>{underReviewRequests.length}</p>
            </div>

            <div className="dashboard-card">
              <h3>Completed</h3>
              <p>{completedRequests.length}</p>
            </div>

            <div className="dashboard-card">
              <h3>Overdue</h3>
              <p>{overdueRequests.length}</p>
            </div>
          </section>

          <section className="dashboard-section">
            <h2>Quick Actions</h2>

            <Link
              to="/audit-requests"
              className="dashboard-action"
            >
              View My Assigned Requests
            </Link>
          </section>
        </>
      )}
    </main>
  );
};

export default Dashboard;