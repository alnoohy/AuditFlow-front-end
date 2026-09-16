import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as auditRequestService from '../../services/auditRequestService';
import * as departmentService from '../../services/departmentService';
import '../AuditRequests.css';
import logo from '../../assets/logo-auditflow.png';

const EditAuditRequest = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    department: '',
    assignedTo: '',
    deadline: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestData = await auditRequestService.show(requestId);
        const departmentData = await departmentService.index();

        setDepartments(departmentData);

        setFormData({
          title: requestData.title || '',
          description: requestData.description || '',
          priority: requestData.priority || 'medium',
          status: requestData.status || 'pending',
          department: requestData.department?._id || requestData.department || '',
          assignedTo: requestData.assignedTo?._id || requestData.assignedTo || '',
          deadline: requestData.deadline
            ? requestData.deadline.split('T')[0]
            : '',
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [requestId]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await auditRequestService.update(requestId, formData);
      navigate(`/audit-requests/${requestId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this audit request?'
    );

    if (!confirmDelete) return;

    try {
      await auditRequestService.deleteRequest(requestId);
      navigate('/audit-requests');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="audit-form-page">
      <section className="audit-form-shell">
        <div className="audit-form-brand">
          <img src={logo} alt="AuditFlow logo" className="audit-form-logo" />
          <div>
            <p className="audit-form-eyebrow">AuditFlow</p>
            <h1>Edit Audit Request</h1>
            <p className="audit-form-subtitle">
              Update request details, department, assignment, and deadline.
            </p>
          </div>
        </div>

        <form className="audit-form-card" onSubmit={handleSubmit}>
          <div className="audit-form-grid">
            <div className="form-group full-width">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter request title"
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Enter request description"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="under review">Under Review</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="assignedTo">Assigned Employee ID</label>
              <input
                type="text"
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="Enter employee ID"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="deadline">Deadline</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="audit-form-actions">
            <button type="submit" className="primary-btn">
              Save Changes
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              type="button"
              className="danger-btn"
              onClick={handleDelete}
            >
              Delete Request
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default EditAuditRequest;