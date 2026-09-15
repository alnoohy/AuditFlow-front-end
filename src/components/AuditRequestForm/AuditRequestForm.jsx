import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import * as auditRequestService from '../../services/auditRequestService';
import * as departmentService from '../../services/departmentService';

import '../AuditRequests.css';

const AuditRequestForm = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    department: '',
    assignedTo: '',
    deadline: '',
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentData = await departmentService.index();
        setDepartments(departmentData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDepartments();
  }, []);

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
      <h1>Create Audit Request</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>

          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="priority">Priority:</label>

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

        <div>
          <label htmlFor="department">Department:</label>

          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>

            {departments.map((department) => (
              <option
                key={department._id}
                value={department._id}
              >
                {department.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="assignedTo">Assigned Employee ID:</label>

          <input
            type="text"
            id="assignedTo"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="deadline">Deadline:</label>

          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <button type="submit">
            Create Request
          </button>

          <button
            type="button"
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