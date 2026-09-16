import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { signUp } from '../../services/authService';
import * as departmentService from '../../services/departmentService';

import { UserContext } from '../../contexts/UserContext';

import './SignUpForm.css';

const SignUpForm = () => {
  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const [message, setMessage] = useState('');

  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    department: '',
    password: '',
    passwordConf: '',
  });

  const {
    username,
    email,
    department,
    password,
    passwordConf,
  } = formData;

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentData = await departmentService.index();

        setDepartments(departmentData);
      } catch (error) {
        console.log(error);

        setMessage('Unable to load departments.');
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (evt) => {
    setMessage('');

    setFormData({
      ...formData,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (password !== passwordConf) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const newUser = await signUp(formData);

      setUser(newUser);

      navigate('/');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const isFormInvalid = () => {
    return !(
      username &&
      email &&
      department &&
      password &&
      passwordConf &&
      password === passwordConf
    );
  };

  return (
    <main className="signup-page">

      <div className="signup-card">

        <div className="signup-header">
          <p className="signup-label">
            CREATE ACCOUNT
          </p>

          <h1>
            Join AuditFlow
          </h1>

          <p className="signup-description">
            Create your account to manage audit requests,
            submit evidence and follow audit progress.
          </p>
        </div>

        {message && (
          <p className="signup-message">
            {message}
          </p>
        )}

        <form
          className="signup-form"
          onSubmit={handleSubmit}
        >

          <div className="signup-field">
            <label htmlFor="username">
              Username
            </label>

            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleChange}
              placeholder="Enter your username"
              autoComplete="off"
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="email">
              Email
            </label>

            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="off"
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="department">
              Department
            </label>

            <select
              id="department"
              name="department"
              value={department}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Department
              </option>

              {departments.map((departmentItem) => (
                <option
                  key={departmentItem._id}
                  value={departmentItem._id}
                >
                  {departmentItem.name}
                </option>
              ))}

            </select>
          </div>

          <div className="signup-field">
            <label htmlFor="password">
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="off"
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="passwordConf">
              Confirm Password
            </label>

            <input
              type="password"
              id="passwordConf"
              name="passwordConf"
              value={passwordConf}
              onChange={handleChange}
              placeholder="Confirm your password"
              autoComplete="off"
              required
            />
          </div>

          <div className="signup-access-note">
            <strong>Account Access</strong>

            <p>
              New accounts are created with Employee access.
              Auditor and Admin access are managed by an administrator.
            </p>
          </div>

          <button
            type="submit"
            className="signup-submit"
            disabled={isFormInvalid()}
          >
            Create Account
          </button>

          <button
            type="button"
            className="signup-cancel"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>

        </form>

        <div className="signup-footer">
          <span>
            Already have an account?
          </span>

          <Link to="/sign-in">
            Sign In
          </Link>
        </div>

      </div>

    </main>
  );
};

export default SignUpForm;