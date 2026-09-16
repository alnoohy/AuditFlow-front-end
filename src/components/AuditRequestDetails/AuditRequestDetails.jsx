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

  useEffect(() => {
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

    fetchAuditRequest();
  }, [requestId]);

  if (!auditRequest) {
    return <p>Loading...</p>;
  }

  return (
    <main className="audit-request-details">
      <div className="details-header">
        <div>
          <h1>{auditRequest.title}</h1>

          <span className="status-badge">{auditRequest.status}</span>
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

      <Link to="/audit-requests" className="back-btn">
        Back to Audit Requests
      </Link>
    </main>
  );
};

export default AuditRequestDetails;
