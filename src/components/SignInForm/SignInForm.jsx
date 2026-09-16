import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';

import { signIn } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

import '../AuthForms.css';

const SignInForm = () => {
  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (evt) => {
    setMessage('');

    setFormData({
      ...formData,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      const signedInUser = await signIn(formData);

      setUser(signedInUser);

      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main className="signin-page">

      <div className="signin-card">

        <div className="signin-header">
          <p className="signin-label">
            WELCOME BACK
          </p>

          <h1>
            Sign in to AuditFlow
          </h1>

          <p className="signin-description">
            Access your audit requests, evidence and review workspace.
          </p>
        </div>

        {message && (
          <p className="signin-message">
            {message}
          </p>
        )}

        <form
          className="signin-form"
          autoComplete="off"
          onSubmit={handleSubmit}
        >

          <div className="signin-field">
            <label htmlFor="username">
              Username
            </label>

            <input
              type="text"
              autoComplete="off"
              id="username"
              value={formData.username}
              name="username"
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="signin-field">
            <label htmlFor="password">
              Password
            </label>

            <input
              type="password"
              autoComplete="off"
              id="password"
              value={formData.password}
              name="password"
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="signin-submit"
          >
            Sign In
          </button>

          <button
            type="button"
            className="signin-cancel"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>

        </form>

        <div className="signin-footer">
          <span>
            New to AuditFlow?
          </span>

          <Link to="/sign-up">
            Create an account
          </Link>
        </div>

      </div>

    </main>
  );
};

export default SignInForm;