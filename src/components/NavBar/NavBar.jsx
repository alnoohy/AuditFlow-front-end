import { useContext } from 'react';
import { Link, useLocation } from 'react-router';

import {
  Building2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users,
} from 'lucide-react';

import { UserContext } from '../../contexts/UserContext';

import logo from '../../assets/logo-auditflow.png';

import './NavBar.css';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const location = useLocation();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isAuditActive = () => {
    return location.pathname.startsWith('/audit-requests');
  };

  return (
    <nav className="main-navbar">
      <div className="navbar-container">

        <Link
          to="/"
          className="navbar-brand"
        >
          <img
            src={logo}
            alt="AuditFlow"
            className="navbar-logo"
          />

          <div className="navbar-brand-text">
            <strong>AuditFlow</strong>
            <span>Audit Management</span>
          </div>
        </Link>

        {user ? (
          <>
            <div className="navbar-links">

              <Link
                to="/"
                className={
                  isActive('/')
                    ? 'navbar-link active'
                    : 'navbar-link'
                }
              >
                <LayoutDashboard size={17} />
                Dashboard
              </Link>

              <Link
                to="/audit-requests"
                className={
                  isAuditActive()
                    ? 'navbar-link active'
                    : 'navbar-link'
                }
              >
                <ClipboardList size={17} />
                Audit Requests
              </Link>

              {user.role === 'admin' && (
                <>
                  <Link
                    to="/admin/users"
                    className={
                      isActive('/admin/users')
                        ? 'navbar-link active'
                        : 'navbar-link'
                    }
                  >
                    <Users size={17} />
                    Users
                  </Link>

                  <Link
                    to="/admin/departments"
                    className={
                      isActive('/admin/departments')
                        ? 'navbar-link active'
                        : 'navbar-link'
                    }
                  >
                    <Building2 size={17} />
                    Departments
                  </Link>
                </>
              )}

            </div>

            <div className="navbar-user">

              <div className="navbar-user-icon">
                {user.username
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div className="navbar-user-info">
                <strong>
                  {user.username}
                </strong>

                <span>
                  <ShieldCheck size={12} />
                  {user.role}
                </span>
              </div>

              <Link
                to="/"
                onClick={handleSignOut}
                className="navbar-signout"
                title="Sign Out"
              >
                <LogOut size={18} />
              </Link>

            </div>
          </>
        ) : (
          <div className="navbar-public-links">

            <a
              href="#features"
              className="navbar-link"
            >
              Features
            </a>

            <Link
              to="/sign-in"
              className="navbar-signin"
            >
              Sign In
            </Link>

            <Link
              to="/sign-up"
              className="navbar-signup"
            >
              Create Account
            </Link>

          </div>
        )}

      </div>
    </nav>
  );
};

export default NavBar;