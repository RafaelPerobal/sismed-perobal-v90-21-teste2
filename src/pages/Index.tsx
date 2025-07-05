
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, FileText, Stethoscope, Pill } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-health-700 mb-4">Sistema de Receitas Médicas</h1>
          <p className="text-xl text-gray-600">Prefeitura Municipal de Perobal</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-health-50 pb-2">
              <CardTitle className="text-health-700 flex items-center">
                <User className="mr-2" />
                Pacientes
              </CardTitle>
              <CardDescription>
                Gerencie cadastros de pacientes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">
                Cadastre e edite informações de pacientes, como dados pessoais, contato e cartão SUS.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/patients" className="w-full">
                <Button variant="default" className="w-full bg-health-600 hover:bg-health-700">
                  Acessar
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-health-50 pb-2">
              <CardTitle className="text-health-700 flex items-center">
                <Pill className="mr-2" />
                Medicamentos
              </CardTitle>
              <CardDescription>
                Gerencie medicamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">
                Cadastre e edite informações sobre medicamentos, incluindo dosagem e apresentação.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/medicines" className="w-full">
                <Button variant="default" className="w-full bg-health-600 hover:bg-health-700">
                  Acessar
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-health-50 pb-2">
              <CardTitle className="text-health-700 flex items-center">
                <Stethoscope className="mr-2" />
                Médicos
              </CardTitle>
              <CardDescription>
                Gerencie cadastros de médicos
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">
                Cadastre e edite informações sobre médicos, incluindo CRM e especialidade.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/doctors" className="w-full">
                <Button variant="default" className="w-full bg-health-600 hover:bg-health-700">
                  Acessar
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-health-50 pb-2">
              <CardTitle className="text-health-700 flex items-center">
                <FileText className="mr-2" />
                Receitas
              </CardTitle>
              <CardDescription>
                Gerencie receitas médicas
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">
                Gere novas receitas médicas para pacientes cadastrados e visualize o histórico.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/prescriptions" className="w-full">
                <Button variant="default" className="w-full bg-health-600 hover:bg-health-700">
                  Acessar
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} - Sistema de Receitas Médicas - Prefeitura Municipal de Perobal</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
