import { Link } from 'react-router';

import coverImage from '../../assets/auditflow-cover.png';

import './Landing.css';

const Landing = () => {
  return (
    <main className="landing-page">

      <section className="landing-hero">

        <img
          src={coverImage}
          alt="AuditFlow"
          className="landing-background"
        />

        <div className="landing-overlay" />

        <div className="landing-content">

          <p className="landing-tagline">
            AUDIT • COMPLIANCE • A STRONGER TOMORROW
          </p>

          <h1>
            Simplify Audit Management
          </h1>

          <p className="landing-description">
            A smarter way to handle audit requests,
            track progress, manage evidence, and ensure
            compliance all in one place.
          </p>

          <div className="landing-buttons">

            <Link
              to="/sign-up"
              className="landing-primary-btn"
            >
              Get Started
            </Link>

            <a
              href="#features"
              className="landing-secondary-btn"
            >
              Learn More
            </a>

          </div>

        </div>

      </section>

      <section
        id="features"
        className="landing-features-section"
      >

        <div className="landing-section-heading">

          <p>FEATURES</p>

          <h2>
            Built around the audit process.
          </h2>

          <span>
            Keep requests, evidence and audit reviews
            organized instead of working across separate
            emails and spreadsheets.
          </span>

        </div>

        <div className="landing-feature-grid">

          <div className="landing-feature-card">

            <span>01</span>

            <h3>Audit Requests</h3>

            <p>
              Create, assign and track requests with
              priorities, deadlines and clear statuses.
            </p>

          </div>

          <div className="landing-feature-card">

            <span>02</span>

            <h3>Evidence Tracking</h3>

            <p>
              Keep supporting documents connected to the
              audit request and know what is still missing.
            </p>

          </div>

          <div className="landing-feature-card">

            <span>03</span>

            <h3>Audit Review</h3>

            <p>
              Review evidence, document exceptions and
              keep findings connected to the work.
            </p>

          </div>

        </div>

      </section>

      <footer
        id="contact"
        className="landing-footer"
      >

        <h3>AuditFlow</h3>

        <p>
          Simplifying audit management, evidence tracking
          and compliance.
        </p>

        <span>
          © 2026 AuditFlow. All rights reserved.
        </span>

      </footer>

    </main>
  );
};

export default Landing;