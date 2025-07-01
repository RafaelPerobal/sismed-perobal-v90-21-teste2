
import { Link, useLocation } from 'react-router-dom';
import { User, FileText, Pill } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 
      'bg-health-600 text-white' : 
      'text-gray-700 hover:bg-health-100';
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-health-600 text-xl font-bold">SisMed Perobal</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
                >
                  Início
                </Link>
                <Link
                  to="/patients"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/patients')}`}
                >
                  <User className="inline-block mr-1 h-4 w-4" />
                  Pacientes
                </Link>
                <Link
                  to="/medicines"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/medicines')}`}
                >
                  <Pill className="inline-block mr-1 h-4 w-4" />
                  Medicamentos
                </Link>
                <Link
                  to="/prescriptions"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/prescriptions')}`}
                >
                  <FileText className="inline-block mr-1 h-4 w-4" />
                  Receitas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menu para dispositivos móveis */}
      <div className="md:hidden border-t border-gray-200">
        <div className="grid grid-cols-3 text-center">
          <Link
            to="/patients"
            className="flex flex-col items-center py-2 text-xs text-gray-600"
          >
            <User className="h-5 w-5" />
            Pacientes
          </Link>
          <Link
            to="/medicines"
            className="flex flex-col items-center py-2 text-xs text-gray-600"
          >
            <Pill className="h-5 w-5" />
            Medicamentos
          </Link>
          <Link
            to="/prescriptions"
            className="flex flex-col items-center py-2 text-xs text-gray-600"
          >
            <FileText className="h-5 w-5" />
            Receitas
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
