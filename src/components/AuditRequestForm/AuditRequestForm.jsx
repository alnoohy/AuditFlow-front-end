import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as auditRequestService from '../../services/auditRequestService';
import '../AuditRequests.css';

const AuditRequestForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    department: '',
    deadline: '',
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const newRequest = await auditRequestService.create(formData);

      navigate(`/audit-requests/${newRequest._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="audit-request-form-page">
      <div className="form-header">
        <h1>Create Audit Request</h1>
        <p>Add the information needed for the new audit request.</p>
      </div>

      <form className="audit-request-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>

          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
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
          <label htmlFor="department">Department</label>

          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Department"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="deadline">Deadline</label>

          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-request-btn">
            Create Request
          </button>

          <button
            type="button"
            className="cancel-request-btn"
            onClick={() => navigate('/audit-requests')}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
};

export default AuditRequestForm;