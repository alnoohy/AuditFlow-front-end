import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import * as auditRequestService from "../../services/auditRequestService";
import * as departmentService from "../../services/departmentService";
import * as userService from "../../services/userService";
import logo from "../../assets/logo-auditflow.png";

import "../AuditRequests.css";

const AuditRequestForm = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    department: "",
    deadline: "",
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
    <main className="audit-form-page">
      <section className="audit-form-shell">
        <div className="audit-form-brand">
          <img src={logo} alt="AuditFlow logo" className="audit-form-logo" />

          <div>
            <p className="audit-form-eyebrow">AuditFlow</p>

            <h1>Create Audit Request</h1>

            <p className="audit-form-subtitle">
              Create a new audit request and set the department, priority and
              required deadline.
            </p>
          </div>
        </div>

        <form className="audit-form-card" onSubmit={handleSubmit}>
          <div className="audit-form-grid">
            <div className="form-group full-width">
              <label htmlFor="title">Request Title</label>

              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter audit request title"
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
                placeholder="Describe the information or evidence required"
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

            <div className="form-group full-width">
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
          </div>

          <div className="audit-form-actions">
            <button type="submit" className="primary-btn">
              Create Request
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/audit-requests")}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default AuditRequestForm;
