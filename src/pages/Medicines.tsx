
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MedicineForm from '@/components/MedicineForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Medicine } from '@/types';
import { getMedicines, deleteMedicine } from '@/utils/storage';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const Medicines = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('list');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    loadMedicines();
  }, []);
  
  const loadMedicines = () => {
    setMedicines(getMedicines());
  };
  
  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setActiveTab('form');
  };
  
  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este medicamento?")) {
      deleteMedicine(id);
      toast({
        title: "Medicamento excluído",
        description: "O medicamento foi excluído com sucesso",
      });
      loadMedicines();
    }
  };
  
  const handleFormSuccess = () => {
    loadMedicines();
    setActiveTab('list');
    setEditingMedicine(undefined);
  };

  const filteredMedicines = medicines.filter(
    (med) => med.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-health-700">Medicamentos</h1>
            <p className="text-gray-600">Gerencie o cadastro de medicamentos</p>
          </div>
          
          {activeTab === 'list' && (
            <Button 
              onClick={() => setActiveTab('form')}
              className="mt-4 md:mt-0 bg-health-600 hover:bg-health-700"
            >
              <Plus className="mr-1 h-4 w-4" /> Novo Medicamento
            </Button>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list">Lista de Medicamentos</TabsTrigger>
            <TabsTrigger value="form">
              {editingMedicine ? 'Editar Medicamento' : 'Novo Medicamento'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar por nome do medicamento"
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
                    <TableHead>Dosagem</TableHead>
                    <TableHead className="hidden md:table-cell">Apresentação</TableHead>
                    <TableHead className="hidden md:table-cell">Descrição</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedicines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        Nenhum medicamento encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMedicines.map((medicine) => (
                      <TableRow key={medicine.id}>
                        <TableCell className="font-medium">{medicine.nome}</TableCell>
                        <TableCell>{medicine.dosagem}</TableCell>
                        <TableCell className="hidden md:table-cell">{medicine.apresentacao}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {medicine.descricao.length > 50 
                            ? medicine.descricao.substring(0, 50) + "..." 
                            : medicine.descricao}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(medicine)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(medicine.id)}
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
            <MedicineForm 
              initialData={editingMedicine} 
              onSuccess={handleFormSuccess} 
            />
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline"
                onClick={() => {
                  setActiveTab('list');
                  setEditingMedicine(undefined);
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

export default Medicines;
