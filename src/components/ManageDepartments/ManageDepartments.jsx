import { useEffect, useState } from 'react';

import * as departmentService from '../../services/departmentService';

import '../AdminPages.css';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);

  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', description: '' });

  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormData, setAddFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  const fetchDepartments = async () => {
    try {
      const departmentData = await departmentService.index();
      setDepartments(departmentData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddChange = (event) => {
    setAddFormData({
      ...addFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await departmentService.create(addFormData);
      setAddFormData({ name: '', description: '' });
      setShowAddForm(false);
      fetchDepartments();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEditing = (department) => {
    setEditingDepartmentId(department._id);
    setEditFormData({
      name: department.name,
      description: department.description || '',
    });
  };

  const cancelEditing = () => {
    setEditingDepartmentId(null);
  };

  const handleEditChange = (event) => {
    setEditFormData({
      ...editFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleEditSubmit = async (departmentId) => {
    try {
      await departmentService.update(departmentId, editFormData);
      setEditingDepartmentId(null);
      fetchDepartments();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (departmentId) => {
   
    try {
      await departmentService.deleteDepartment(departmentId);
      fetchDepartments();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="manage-departments-page">
      <div className="manage-page-header">
        <div>
          <h1>Manage Departments</h1>
          <p>Add, edit, or remove departments used across AuditFlow.</p>
        </div>

        <button type="button" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Department'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="add-department-form">
          {error && <p className="form-error">{error}</p>}

          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={addFormData.name}
              onChange={handleAddChange}
              required
            />
          </div>

          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={addFormData.description}
              onChange={handleAddChange}
            />
          </div>

          <button type="submit">Create Department</button>
        </form>
      )}

      {departments.length === 0 ? (
        <div className="empty-state">
          <p>No departments found.</p>
        </div>
      ) : (
        <table className="manage-departments-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department._id}>
                {editingDepartmentId === department._id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="description"
                        value={editFormData.description}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <button type="button" onClick={() => handleEditSubmit(department._id)}>
                        Save
                      </button>
                      <button type="button" onClick={cancelEditing}>
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{department.name}</td>
                    <td>{department.description || '—'}</td>
                    <td>
                      <button type="button" onClick={() => startEditing(department)}>
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(department._id)}>
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default ManageDepartments;