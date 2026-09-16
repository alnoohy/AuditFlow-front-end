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
      // Refresh request data to remove deleted submission from state
      fetchAuditRequest();
    } catch (error) {
      console.log(error);
    }
  };

  if (!auditRequest) {
    return <p>Loading...</p>;
  }

  // Check if current user is the assigned employee
  const isAssignedEmployee =
    user?.role === "employee" && auditRequest.assignedTo?._id === user._id;

  return (
    <main className="audit-request-details">
      <div className="details-header">
        <div>
          <h1>{auditRequest.title}</h1>
          <span className="status-badge">{auditRequest.status}</span>
        </div>

        {user?.role === "auditor" && (
          <Link
            to={`/audit-requests/${auditRequest._id}/edit`}
            className="edit-request-btn"
          >
            Edit Request
          </Link>
        )}
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
          <strong>Department:</strong> {departmentName || "Not assigned"}
        </p>
        <p>
          <strong>Assigned To:</strong>{" "}
          {auditRequest.assignedTo?.username || "Not assigned"}
        </p>
        <p>
          <strong>Created By:</strong>{" "}
          {auditRequest.createdBy?.username || "Unknown"}
        </p>
        <p>
          <strong>Deadline:</strong>{" "}
          {auditRequest.deadline
            ? new Date(auditRequest.deadline).toLocaleDateString()
            : "No deadline"}
        </p>
      </div>

      {/* --- SUBMISSIONS SECTION --- */}
      <section className="submissions-section">
        <h2>Submissions & Evidence</h2>

        {/* Show "Submit Evidence" button only if user is the assigned employee */}
        {isAssignedEmployee && (
          <Link
            to={`/audit-requests/${auditRequest._id}/submit`}
            className="submit-evidence-btn"
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

              {/* Delete Button (Allowed if user created the submission or is an admin) */}
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

      <Link to="/audit-requests" className="back-btn">
        Back to Audit Requests
      </Link>
    </main>
  );
};

export default AuditRequestDetails;
