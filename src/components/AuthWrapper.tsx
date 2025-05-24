
import { useAuth } from '@/hooks/useAuth';
import { useDoctor } from '@/hooks/useDoctor';
import DoctorProfileSetup from '@/components/DoctorProfileSetup';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { hasProfile, loading: doctorLoading } = useDoctor();

  if (authLoading || doctorLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-health-600"></div>
      </div>
    );
  }

  if (isAuthenticated && !hasProfile) {
    return <DoctorProfileSetup onComplete={() => window.location.reload()} />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
