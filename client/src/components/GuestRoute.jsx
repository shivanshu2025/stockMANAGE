import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const GuestRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner label="Loading" />
      </div>
    );
  }

  if (authenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default GuestRoute;
