import { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router';

import { UserContext } from '../../contexts/UserContext';

import logo from '../../assets/logo-auditflow.png';
import '../AuditRequests.css';

const AuditRequestList = ({ auditRequests = [] }) => {
  const { user } = useContext(UserContext);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [department, setDepartment] = useState('');

  const getDepartmentName = (request) => {
    if (
      request.department &&
      typeof request.department === 'object'
    ) {
      return request.department.name || 'Not assigned';
    }

    return 'Not assigned';
  };

  const departments = useMemo(() => {
    return auditRequests
      .map((request) => getDepartmentName(request))
      .filter((name) => name !== 'Not assigned')
      .filter((name, index, array) => {
        return array.indexOf(name) === index;
      });
  }, [auditRequests]);

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
      getDepartmentName(request) === department;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesDepartment
    );
  });

  const pendingCount = auditRequests.filter(
    (request) => request.status === 'pending'
  ).length;

  const reviewCount = auditRequests.filter(
    (request) => request.status === 'under review'
  ).length;

  const overdueCount = auditRequests.filter(
    (request) => request.status === 'overdue'
  ).length;

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setDepartment('');
  };

  const formatDate = (date) => {
    if (!date) return 'No deadline';

    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusClass = (requestStatus) => {
    return requestStatus
      ?.toLowerCase()
      .replaceAll(' ', '-');
  };

  return (
    <main className="audit-list-page">
      <section className="audit-list-header">
        <div className="audit-list-brand">
          <img
            src={logo}
            alt="AuditFlow"
            className="audit-list-logo"
          />

          <div>
            <p className="audit-list-label">
              Audit Management
            </p>

            <h1>Audit Requests</h1>

            <p className="audit-list-subtitle">
              Track, manage and review internal audit requests
              across departments.
            </p>
          </div>
        </div>

        {user?.role === 'auditor' && (
          <Link
            to="/audit-requests/new"
            className="new-audit-request-btn"
          >
            <span>+</span>
            New Audit Request
          </Link>
        )}
      </section>

      <section className="audit-summary-grid">
        <div className="audit-summary-card">
          <div className="summary-icon">
            AR
          </div>

          <div>
            <p>Total Requests</p>
            <h2>{auditRequests.length}</h2>
          </div>
        </div>

        <div className="audit-summary-card">
          <div className="summary-icon">
            PN
          </div>

          <div>
            <p>Pending</p>
            <h2>{pendingCount}</h2>
          </div>
        </div>

        <div className="audit-summary-card">
          <div className="summary-icon">
            RV
          </div>

          <div>
            <p>Under Review</p>
            <h2>{reviewCount}</h2>
          </div>
        </div>

        <div className="audit-summary-card">
          <div className="summary-icon summary-icon-alert">
            OD
          </div>

          <div>
            <p>Overdue</p>
            <h2>{overdueCount}</h2>
          </div>
        </div>
      </section>

      <section className="audit-workspace">
        <div className="audit-toolbar">
          <div className="audit-search">
            <span className="search-symbol">⌕</span>

            <input
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="under review">
              Under Review
            </option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
            <option value="overdue">Overdue</option>
          </select>

          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value)
            }
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={department}
            onChange={(event) =>
              setDepartment(event.target.value)
            }
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
            className="clear-audit-filters"
            onClick={handleClearFilters}
          >
            Clear
          </button>
        </div>

        <div className="audit-results-header">
          <div>
            <h2>Request Register</h2>

            <p>
              {filteredRequests.length}{' '}
              {filteredRequests.length === 1
                ? 'request'
                : 'requests'}
            </p>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="audit-empty-state">
            <div className="empty-state-mark">
              AF
            </div>

            <h3>No audit requests found</h3>

            <p>
              Try adjusting your search or filter options.
            </p>
          </div>
        ) : (
          <div className="audit-table-wrapper">
            <div className="audit-table">
              <div className="audit-table-head">
                <span>Request</span>
                <span>Department</span>
                <span>Priority</span>
                <span>Status</span>
                <span>Deadline</span>
                <span></span>
              </div>

              {filteredRequests.map((request) => (
                <div
                  className="audit-table-row"
                  key={request._id}
                >
                  <div className="request-main-cell">
                    <div className="request-initial">
                      {request.title
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <Link
                        to={`/audit-requests/${request._id}`}
                        className="request-title-link"
                      >
                        {request.title}
                      </Link>

                      <p>
                        {request.description ||
                          'No description provided.'}
                      </p>
                    </div>
                  </div>

                  <div
                    className="audit-table-mobile-label"
                    data-label="Department"
                  >
                    {getDepartmentName(request)}
                  </div>

                  <div
                    className="audit-table-mobile-label"
                    data-label="Priority"
                  >
                    <span
                      className={`priority-pill priority-${request.priority}`}
                    >
                      {request.priority}
                    </span>
                  </div>

                  <div
                    className="audit-table-mobile-label"
                    data-label="Status"
                  >
                    <span
                      className={`audit-status-pill status-${getStatusClass(
                        request.status
                      )}`}
                    >
                      <span className="status-dot"></span>
                      {request.status}
                    </span>
                  </div>

                  <div
                    className="deadline-cell audit-table-mobile-label"
                    data-label="Deadline"
                  >
                    {formatDate(request.deadline)}
                  </div>

                  <Link
                    to={`/audit-requests/${request._id}`}
                    className="view-request-link"
                    aria-label={`View ${request.title}`}
                  >
                    →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default AuditRequestList;