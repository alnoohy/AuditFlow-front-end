import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';

import * as auditRequestService from '../../services/auditRequestService';
import * as departmentService from '../../services/departmentService';

import { UserContext } from '../../contexts/UserContext';

import '../AuditRequests.css';

const AuditRequestDetails = () => {
  const { requestId } = useParams();

  const { user } = useContext(UserContext);

  const [auditRequest, setAuditRequest] = useState(null);
  const [departmentName, setDepartmentName] = useState('');

  useEffect(() => {
    const fetchAuditRequest = async () => {
      try {
        const requestData = await auditRequestService.show(requestId);

        setAuditRequest(requestData);

        const departmentData = await departmentService.index();

        const departmentId =
          requestData.department?._id ||
          requestData.department;

        const selectedDepartment = departmentData.find(
          (department) => department._id === departmentId
        );

        if (selectedDepartment) {
          setDepartmentName(selectedDepartment.name);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAuditRequest();
  }, [requestId]);

  const getStatusClass = (status) => {
    return status
      ?.toLowerCase()
      .replaceAll(' ', '-');
  };

  const formatDate = (date) => {
    if (!date) {
      return 'No deadline';
    }

    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (!auditRequest) {
    return (
      <p className="audit-loading">
        Loading audit request...
      </p>
    );
  }

  return (
    <main className="audit-request-details">

      <div className="details-header">

        <div className="details-title-area">

          <p className="details-eyebrow">
            Audit Request
          </p>

          <h1>
            {auditRequest.title}
          </h1>

          <span
            className={`audit-status-pill status-${getStatusClass(
              auditRequest.status
            )}`}
          >
            <span className="status-dot"></span>

            {auditRequest.status}
          </span>

        </div>

        {user?.role === 'auditor' && (
          <div className="details-actions">

            <Link
              to={`/audit-requests/${auditRequest._id}/workspace`}
              className="workspace-request-btn"
            >
              Open Audit Workspace
            </Link>

            <Link
              to={`/audit-requests/${auditRequest._id}/edit`}
              className="edit-request-btn"
            >
              Edit Request
            </Link>

          </div>
        )}

      </div>

      <section className="details-card">

        <div className="details-section">

          <p className="details-section-label">
            Request Description
          </p>

          <p className="details-description">
            {auditRequest.description ||
              'No description provided.'}
          </p>

        </div>

        <div className="details-grid">

          <div className="detail-item">
            <span>
              Priority
            </span>

            <strong
              className={`priority-pill priority-${auditRequest.priority}`}
            >
              {auditRequest.priority}
            </strong>
          </div>

          <div className="detail-item">
            <span>
              Department
            </span>

            <strong>
              {departmentName || 'Not assigned'}
            </strong>
          </div>

          <div className="detail-item">
            <span>
              Assigned To
            </span>

            <strong>
              {auditRequest.assignedTo?.username ||
                'Not assigned'}
            </strong>
          </div>

          <div className="detail-item">
            <span>
              Created By
            </span>

            <strong>
              {auditRequest.createdBy?.username ||
                'Unknown'}
            </strong>
          </div>

          <div className="detail-item">
            <span>
              Deadline
            </span>

            <strong>
              {formatDate(auditRequest.deadline)}
            </strong>
          </div>

          <div className="detail-item">
            <span>
              Status
            </span>

            <strong className="detail-status-text">
              {auditRequest.status}
            </strong>
          </div>

        </div>

      </section>

      <Link
        to="/audit-requests"
        className="back-btn"
      >
        ← Back to Audit Requests
      </Link>

    </main>
  );
};

export default AuditRequestDetails;