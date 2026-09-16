import { useEffect, useState } from 'react';

import * as userService from '../../services/userService';
import * as departmentService from '../../services/departmentService';

import '../AdminPages.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({ role: '', department: '' });

  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormData, setAddFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'employee',
    department: '',
  });
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const userData = await userService.index();
      setUsers(userData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentData = await departmentService.index();
        setDepartments(departmentData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
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
      await userService.create(addFormData);
      setAddFormData({
        username: '',
        email: '',
        password: '',
        role: 'employee',
        department: '',
      });
      setShowAddForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEditing = (user) => {
    setEditingUserId(user._id);
    setEditFormData({
      role: user.role,
      department: user.department?._id || user.department || '',
    });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
  };

  const handleEditChange = (event) => {
    setEditFormData({
      ...editFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleEditSubmit = async (userId) => {
    try {
      await userService.update(userId, editFormData);
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm('Delete this user? This cannot be undone.');
    if (!confirmed) return;

    try {
      await userService.deleteUser(userId);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="manage-users-page">
      <div className="manage-page-header">
        <div>
          <h1>Manage Users</h1>
          <p>View, add, and manage user roles and departments.</p>
        </div>

        <button type="button" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="add-user-form">
          {error && <p className="form-error">{error}</p>}

          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={addFormData.username}
              onChange={handleAddChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={addFormData.email}
              onChange={handleAddChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={addFormData.password}
              onChange={handleAddChange}
              required
            />
          </div>

          <div>
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role"
              value={addFormData.role}
              onChange={handleAddChange}
            >
              <option value="employee">Employee</option>
              <option value="auditor">Auditor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label htmlFor="department">Department:</label>
            <select
              id="department"
              name="department"
              value={addFormData.department}
              onChange={handleAddChange}
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

          <button type="submit">Create User</button>
        </form>
      )}

      {users.length === 0 ? (
        <div className="empty-state">
          <p>No users found.</p>
        </div>
      ) : (
        <table className="manage-users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>

                {editingUserId === user._id ? (
                  <>
                    <td>
                      <select
                        name="role"
                        value={editFormData.role}
                        onChange={handleEditChange}
                      >
                        <option value="employee">Employee</option>
                        <option value="auditor">Auditor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <select
                        name="department"
                        value={editFormData.department}
                        onChange={handleEditChange}
                      >
                        <option value="">No Department</option>
                        {departments.map((department) => (
                          <option key={department._id} value={department._id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button type="button" onClick={() => handleEditSubmit(user._id)}>
                        Save
                      </button>
                      <button type="button" onClick={cancelEditing}>
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{user.role}</td>
                    <td>{user.department?.name || 'Not assigned'}</td>
                    <td>
                      <button type="button" onClick={() => startEditing(user)}>
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(user._id)}>
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

export default ManageUsers;