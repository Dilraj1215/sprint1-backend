import { Link } from 'react-router-dom';

export default function NotFoundScreen() {
  return (
    <div className="not-found-page">
      <div className="not-found-box">
        <span className="not-found-code">404</span>
        <h1 className="not-found-title">Page not found</h1>
        <p className="not-found-msg">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
      </div>
    </div>
  );
}
