import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import * as auditRequestService from '../../services/auditRequestService';
import '../AuditRequests.css';

const AuditRequestDetails = ({ previewRequest }) => {
  const { requestId } = useParams();

  const [auditRequest, setAuditRequest] = useState(previewRequest || null);
  useEffect(() => {
    if (previewRequest) return;
  
    const fetchAuditRequest = async () => {
      const requestData = await auditRequestService.show(requestId);
      setAuditRequest(requestData);
    };
  
    fetchAuditRequest();
  }, [requestId, previewRequest]);

  if (!auditRequest) {
    return <p>Loading...</p>;
  }

  return (
    <main className="audit-request-details">
      <div className="details-header">
        <div>
          <h1>{auditRequest.title}</h1>
          <span className="status-badge">
            {auditRequest.status}
          </span>
        </div>

        <Link
          to={`/audit-requests/${auditRequest._id}/edit`}
          className="edit-request-btn"
        >
          Edit
        </Link>
      </div>

      <div className="details-card">
        <p>
          <strong>Description:</strong>
        </p>

        <p>{auditRequest.description}</p>

        <p>
          <strong>Priority:</strong> {auditRequest.priority}
        </p>

        <p>
          <strong>Department:</strong>{' '}
          {auditRequest.department?.name || 'Not assigned'}
        </p>

        <p>
          <strong>Assigned To:</strong>{' '}
          {auditRequest.assignedTo?.username || 'Not assigned'}
        </p>

        <p>
          <strong>Created By:</strong>{' '}
          {auditRequest.createdBy?.username || 'Unknown'}
        </p>

        <p>
          <strong>Deadline:</strong>{' '}
          {auditRequest.deadline
            ? new Date(auditRequest.deadline).toLocaleDateString()
            : 'No deadline'}
        </p>
      </div>

      <Link to="/audit-requests" className="back-btn">
        Back to Audit Requests
      </Link>
    </main>
  );
};

export default AuditRequestDetails;