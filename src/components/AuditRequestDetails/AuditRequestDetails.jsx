import { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router";
import { UserContext } from "../../contexts/UserContext";

import * as auditRequestService from "../../services/auditRequestService";
import * as departmentService from "../../services/departmentService";
import * as submissionService from "../../services/submissionService/submissionService";

import "../AuditRequests.css";

const AuditRequestDetails = () => {
  const { requestId } = useParams();
  const { user } = useContext(UserContext);

  const [auditRequest, setAuditRequest] = useState(null);
  const [departmentName, setDepartmentName] = useState("");

  const fetchAuditRequest = async () => {
    try {
      const requestData = await auditRequestService.show(requestId);
      setAuditRequest(requestData);

      const departmentData = await departmentService.index();
      const departmentId =
        requestData.department?._id || requestData.department;
      const selectedDepartment = departmentData.find(
        (department) => department._id === departmentId,
      );

      if (selectedDepartment) {
        setDepartmentName(selectedDepartment.name);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAuditRequest();
  }, [requestId]);

  // Handle Deleting a Submission
  const handleDeleteSubmission = async (submissionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this submission?",
    );
    if (!confirmed) return;

    try {
      await submissionService.delete(requestId, submissionId);
      fetchAuditRequest();
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusClass = (status) => {
    return status?.toLowerCase().replaceAll(" ", "-");
  };

  const formatDate = (date) => {
    if (!date) {
      return "No deadline";
    }

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!auditRequest) {
    return <p className="audit-loading">Loading audit request...</p>;
  }

  // Check if current user is the assigned employee
  const isAssignedEmployee =
    user?.role === "employee" && auditRequest.assignedTo?._id === user._id;

  return (
    <main className="audit-request-details">
      <div className="details-header">
        <div className="details-title-area">
          <p className="details-eyebrow">Audit Request</p>
          <h1>{auditRequest.title}</h1>
          <span
            className={`audit-status-pill status-${getStatusClass(
              auditRequest.status,
            )}`}
          >
            <span className="status-dot"></span>
            {auditRequest.status}
          </span>
        </div>

        <div className="details-actions">
          {user?.role === "auditor" && (
            <Link
              to={`/audit-requests/${auditRequest._id}/workspace`}
              className="workspace-request-btn"
            >
              Open Audit Workspace
            </Link>
          )}

          {user?.role === "auditor" && (
            <Link
              to={`/audit-requests/${auditRequest._id}/edit`}
              className="edit-request-btn"
            >
              Edit Request
            </Link>
          )}
        </div>
      </div>

      <section className="details-card">
        <div className="details-section">
          <p className="details-section-label">Request Description</p>
          <p className="details-description">
            {auditRequest.description || "No description provided."}
          </p>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span>Priority</span>
            <strong
              className={`priority-pill priority-${auditRequest.priority}`}
            >
              {auditRequest.priority}
            </strong>
          </div>

          <div className="detail-item">
            <span>Department</span>
            <strong>{departmentName || "Not assigned"}</strong>
          </div>

          <div className="detail-item">
            <span>Assigned To</span>
            <strong>
              {auditRequest.assignedTo?.username || "Not assigned"}
            </strong>
          </div>

          <div className="detail-item">
            <span>Created By</span>
            <strong>{auditRequest.createdBy?.username || "Unknown"}</strong>
          </div>

          <div className="detail-item">
            <span>Deadline</span>
            <strong>{formatDate(auditRequest.deadline)}</strong>
          </div>

          <div className="detail-item">
            <span>Status</span>
            <strong className="detail-status-text">
              {auditRequest.status}
            </strong>
          </div>
        </div>
      </section>

      {/* --- SUBMISSIONS & EVIDENCE SECTION --- */}
      <section className="submissions-section" style={{ marginTop: "2rem" }}>
        <h2>Submissions & Evidence</h2>

        {isAssignedEmployee && (
          <Link
            to={`/audit-requests/${auditRequest._id}/submit`}
            className="submit-evidence-btn"
            style={{
              display: "inline-block",
              margin: "1rem 0",
              padding: "10px 15px",
              background: "#004080",
              color: "#fff",
              borderRadius: "5px",
              textDecoration: "none",
            }}
          >
            + Submit Evidence
          </Link>
        )}

        {auditRequest.submissions && auditRequest.submissions.length > 0 ? (
          auditRequest.submissions.map((sub) => (
            <div
              key={sub._id}
              className="submission-card"
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                margin: "1rem 0",
                borderRadius: "8px",
                background: "#f9f9f9",
              }}
            >
              <p>
                <strong>Comments:</strong> {sub.comments}
              </p>
              <p>
                <strong>Status:</strong> {sub.status}
              </p>
              <p>
                <strong>Submitted At:</strong>{" "}
                {new Date(sub.submittedAt).toLocaleDateString()}
              </p>
              {sub.evidenceUrl && (
                <p>
                  <a
                    href={`http://localhost:3000/${sub.evidenceUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📎 View Uploaded File
                  </a>
                </p>
              )}

              {(user?._id === sub.submittedBy?._id ||
                user?.role === "admin") && (
                <button
                  onClick={() => handleDeleteSubmission(sub._id)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    marginTop: "8px",
                  }}
                >
                  Delete Submission
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No evidence submitted yet.</p>
        )}
      </section>

      <Link
        to="/audit-requests"
        className="back-btn"
        style={{ display: "inline-block", marginTop: "2rem" }}
      >
        ← Back to Audit Requests
      </Link>
    </main>
  );
};

export default AuditRequestDetails;
