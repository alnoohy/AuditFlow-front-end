import { Link } from 'react-router';
import '../AuditRequests.css';

const AuditRequestList = ({ auditRequests }) => {
  return (
    <main className="audit-requests-page">
      <div className="audit-requests-header">
        <div>
          <h1>Audit Requests</h1>
          <p>View and manage audit requests.</p>
        </div>

        <Link to="/audit-requests/new" className="create-request-btn">
          New Request
        </Link>
      </div>

      {auditRequests.length === 0 ? (
        <div className="empty-state">
          <p>No audit requests found.</p>
        </div>
      ) : (
        <div className="audit-requests-grid">
          {auditRequests.map((request) => (
            <Link
              key={request._id}
              to={`/audit-requests/${request._id}`}
              className="audit-request-card"
            >
              <div className="request-card-header">
                <h2>{request.title}</h2>

                <span
                  className={`status-badge ${request.status
                    ?.toLowerCase()
                    .replaceAll(' ', '-')}`}
                >
                  {request.status}
                </span>
              </div>

              <p className="request-description">
                {request.description || 'No description provided.'}
              </p>

              <div className="request-card-details">
                <p>
                  <strong>Priority:</strong> {request.priority}
                </p>

                <p>
                  <strong>Department:</strong>{' '}
                  {request.department?.name || 'Not assigned'}
                </p>

                <p>
                  <strong>Deadline:</strong>{' '}
                  {request.deadline
                    ? new Date(request.deadline).toLocaleDateString()
                    : 'No deadline'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};

export default AuditRequestList;