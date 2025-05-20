
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PatientForm from '@/components/PatientForm';
import PatientTable from '@/components/PatientTable';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Patient } from '@/types';
import { getPatients } from '@/utils/storage';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const Patients = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('list');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>(undefined);
  
  useEffect(() => {
    loadPatients();
  }, []);
  
  const loadPatients = () => {
    setPatients(getPatients());
  };
  
  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setActiveTab('form');
  };
  
  const handlePrescription = (patient: Patient) => {
    // Navegar para criar uma receita para este paciente
    navigate(`/prescriptions?patientId=${patient.id}`);
  };
  
  const handleFormSuccess = () => {
    loadPatients();
    setActiveTab('list');
    setEditingPatient(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-health-700">Pacientes</h1>
            <p className="text-gray-600">Gerencie os cadastros de pacientes</p>
          </div>
          
          {activeTab === 'list' && (
            <Button 
              onClick={() => setActiveTab('form')}
              className="mt-4 md:mt-0 bg-health-600 hover:bg-health-700"
            >
              <Plus className="mr-1 h-4 w-4" /> Novo Paciente
            </Button>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list">Lista de Pacientes</TabsTrigger>
            <TabsTrigger value="form">
              {editingPatient ? 'Editar Paciente' : 'Novo Paciente'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-4">
            <PatientTable 
              patients={patients}
              onEdit={handleEdit}
              onPrescription={handlePrescription}
              onPatientDeleted={loadPatients}
            />
          </TabsContent>
          
          <TabsContent value="form" className="mt-4">
            <PatientForm 
              initialData={editingPatient} 
              onSuccess={handleFormSuccess} 
            />
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline"
                onClick={() => {
                  setActiveTab('list');
                  setEditingPatient(undefined);
                }}
              >
                Cancelar
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Patients;
