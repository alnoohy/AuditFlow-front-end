import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

// Services
import { signUp } from '../../services/authService';
import * as departmentService from '../../services/departmentService';

// Context
import { UserContext } from '../../contexts/UserContext';

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

    try {
      const newUser = await signUp(formData);

      setUser(newUser);
      navigate('/');
    } catch (error) {
      console.log(error.message);
      setMessage(error.message);
    }
  };

  const isFormInvalid = () => {
    return !(
      username &&
      email &&
      department &&
      password &&
      password === passwordConf
    );
  };

  return (
    <main>
      <h1>Sign Up</h1>

      <p>{message}</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>

          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>

          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="department">Department:</label>

          <select
            id="department"
            name="department"
            value={department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>

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

        <div>
          <label htmlFor="password">Password:</label>

          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="confirm">Confirm Password:</label>

          <input
            type="password"
            id="confirm"
            name="passwordConf"
            value={passwordConf}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isFormInvalid()}
          >
            Sign Up
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
};

export default SignUpForm;