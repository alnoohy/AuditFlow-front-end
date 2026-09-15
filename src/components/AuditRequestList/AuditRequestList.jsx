import { useState } from 'react';
import { Link } from 'react-router';
import '../AuditRequests.css';

const AuditRequestList = ({ auditRequests = [] }) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [department, setDepartment] = useState('');

  const departments = auditRequests
    .map((request) => request.department?.name)
    .filter((name, index, array) => {
      return name && array.indexOf(name) === index;
    });

  const filteredRequests = auditRequests.filter((request) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      request.title?.toLowerCase().includes(searchText) ||
      request.description?.toLowerCase().includes(searchText);

    const matchesStatus =
      status === '' || request.status === status;

    const matchesPriority =
      priority === '' || request.priority === priority;

    const matchesDepartment =
      department === '' ||
      request.department?.name === department;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesDepartment
    );
  });

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setDepartment('');
  };

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

      <div className="audit-request-filters">
        <input
          type="text"
          placeholder="Search requests"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="under review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
        >
          <option value="">All Departments</option>

          {departments.map((departmentName) => (
            <option
              key={departmentName}
              value={departmentName}
            >
              {departmentName}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleClearFilters}
        >
          Clear Filters
        </button>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="empty-state">
          <p>No audit requests found.</p>
        </div>
      ) : (
        <div className="audit-requests-grid">
          {filteredRequests.map((request) => (
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