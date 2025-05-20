
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import DoctorForm from '@/components/DoctorForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Doctor } from '@/types';
import { getDoctors, deleteDoctor } from '@/utils/storage';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const Doctors = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('list');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    loadDoctors();
  }, []);
  
  const loadDoctors = () => {
    setDoctors(getDoctors());
  };
  
  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setActiveTab('form');
  };
  
  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este médico?")) {
      deleteDoctor(id);
      toast({
        title: "Médico excluído",
        description: "O médico foi excluído com sucesso",
      });
      loadDoctors();
    }
  };
  
  const handleFormSuccess = () => {
    loadDoctors();
    setActiveTab('list');
    setEditingDoctor(undefined);
  };

  const filteredDoctors = doctors.filter(
    (doc) => doc.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
             doc.crm.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-health-700">Médicos</h1>
            <p className="text-gray-600">Gerencie o cadastro de médicos</p>
          </div>
          
          {activeTab === 'list' && (
            <Button 
              onClick={() => setActiveTab('form')}
              className="mt-4 md:mt-0 bg-health-600 hover:bg-health-700"
            >
              <Plus className="mr-1 h-4 w-4" /> Novo Médico
            </Button>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list">Lista de Médicos</TabsTrigger>
            <TabsTrigger value="form">
              {editingDoctor ? 'Editar Médico' : 'Novo Médico'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou CRM"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CRM</TableHead>
                    <TableHead className="hidden md:table-cell">Especialidade</TableHead>
                    <TableHead className="hidden md:table-cell">Contato</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        Nenhum médico encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDoctors.map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-medium">{doctor.nome}</TableCell>
                        <TableCell>{doctor.crm}</TableCell>
                        <TableCell className="hidden md:table-cell">{doctor.especialidade}</TableCell>
                        <TableCell className="hidden md:table-cell">{doctor.contato}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(doctor)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(doctor.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="form" className="mt-4">
            <DoctorForm 
              initialData={editingDoctor} 
              onSuccess={handleFormSuccess} 
            />
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline"
                onClick={() => {
                  setActiveTab('list');
                  setEditingDoctor(undefined);
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

export default Doctors;
