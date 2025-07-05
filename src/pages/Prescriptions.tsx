
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import PrescriptionForm from '@/components/PrescriptionForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Patient, Prescription, Doctor, Medicine } from '@/types';
import { 
  getPrescriptions, 
  getPatientById,
  getDoctorById,
  getMedicineById,
  findPatientByCpf,
  findPatientsByName,
  getPrescriptionById,
  deletePrescription
} from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, FileText, User, FileDown, Trash2, Calendar } from 'lucide-react';

const Prescriptions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientIdParam = searchParams.get('patientId');
  
  const [activeTab, setActiveTab] = useState<string>('search');
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  
  useEffect(() => {
    if (patientIdParam) {
      const patientId = parseInt(patientIdParam);
      const patient = getPatientById(patientId);
      
      if (patient) {
        setSelectedPatient(patient);
        setActiveTab('new');
      }
    }
  }, [patientIdParam]);
  
  useEffect(() => {
    if (selectedPatient) {
      loadPrescriptions();
    }
  }, [selectedPatient]);
  
  const loadPrescriptions = () => {
    if (!selectedPatient) return;
    
    const allPrescriptions = getPrescriptions();
    const patientPrescriptions = allPrescriptions.filter(p => p.pacienteId === selectedPatient.id);
    setPrescriptions(patientPrescriptions);
  };
  
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    // Tenta buscar pelo CPF primeiro
    const patientByCpf = findPatientByCpf(searchTerm);
    if (patientByCpf) {
      setSearchResults([patientByCpf]);
      return;
    }
    
    // Se não encontrou por CPF, busca pelo nome
    const patientsByName = findPatientsByName(searchTerm);
    setSearchResults(patientsByName);
  };
  
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveTab('list');
  };
  
  const handleNewPrescription = () => {
    setActiveTab('new');
  };
  
  const handlePrescriptionCreated = () => {
    loadPrescriptions();
    setActiveTab('list');
  };
  
  const handleViewPrescription = (prescriptionId: number) => {
    const prescription = getPrescriptionById(prescriptionId);
    if (prescription) {
      setSelectedPrescription(prescription);
      setActiveTab('view');
    }
  };
  
  const handleDeletePrescription = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta receita?")) {
      deletePrescription(id);
      toast({
        title: "Receita excluída",
        description: "A receita foi excluída com sucesso",
      });
      loadPrescriptions();
    }
  };
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };
  
  const getDoctor = (id: number): Doctor | undefined => {
    return getDoctorById(id);
  };
  
  const getMedicine = (id: number): Medicine | undefined => {
    return getMedicineById(id);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-health-700">Receitas</h1>
            <p className="text-gray-600">
              {selectedPatient 
                ? `Paciente: ${selectedPatient.nome}` 
                : 'Busque um paciente para gerar ou visualizar receitas'}
            </p>
          </div>
          
          {selectedPatient && activeTab === 'list' && (
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => setSelectedPatient(null)}
                variant="outline"
              >
                <Search className="mr-1 h-4 w-4" /> Buscar outro paciente
              </Button>
              
              <Button 
                onClick={handleNewPrescription}
                className="bg-health-600 hover:bg-health-700"
              >
                <Plus className="mr-1 h-4 w-4" /> Nova Receita
              </Button>
            </div>
          )}
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => {
            // Se voltando para a busca, limpar seleção de paciente
            if (value === 'search' && activeTab !== 'search') {
              setSelectedPatient(null);
              setSearchTerm('');
              setSearchResults([]);
            }
            
            setActiveTab(value);
          }}
        >
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="search" disabled={activeTab === 'view'}>
              Buscar Paciente
            </TabsTrigger>
            <TabsTrigger value="list" disabled={!selectedPatient || activeTab === 'view'}>
              Lista de Receitas
            </TabsTrigger>
            <TabsTrigger value="new" disabled={!selectedPatient || activeTab === 'view'}>
              Nova Receita
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="mt-4">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-grow">
                    <Input
                      placeholder="Buscar por CPF ou nome do paciente"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch();
                      }}
                    />
                  </div>
                  <Button onClick={handleSearch} className="bg-health-600 hover:bg-health-700">
                    <Search className="mr-1 h-4 w-4" /> Buscar
                  </Button>
                </div>
                
                {searchResults.length > 0 ? (
                  <div className="border rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            CPF
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            Data Nasc.
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            Contato
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ação
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {searchResults.map((patient) => (
                          <tr key={patient.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {patient.nome}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {patient.cpf}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                              {formatDate(patient.dataNascimento)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                              {patient.contato}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button
                                onClick={() => handleSelectPatient(patient)}
                                size="sm"
                                variant="ghost"
                                className="text-health-600 hover:text-health-800"
                              >
                                <User className="mr-1 h-4 w-4" /> Selecionar
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : searchTerm ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum paciente encontrado. Verifique o CPF ou nome digitado.
                  </div>
                ) : null}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="list" className="mt-4">
            {selectedPatient && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h3 className="text-xl font-semibold text-health-700 flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Receitas do Paciente
                    </h3>
                    <Button
                      onClick={handleNewPrescription}
                      className="mt-2 sm:mt-0 bg-health-600 hover:bg-health-700"
                      size="sm"
                    >
                      <Plus className="mr-1 h-4 w-4" /> Nova Receita
                    </Button>
                  </div>
                  
                  {prescriptions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhuma receita encontrada para este paciente.
                    </div>
                  ) : (
                    <div className="border rounded-md">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Data
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                              Médico
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Medicamentos
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ações
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {prescriptions.map((prescription) => {
                            const doctor = getDoctor(prescription.medicoId);
                            return (
                              <tr key={prescription.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {formatDate(prescription.data)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                                  {doctor?.nome || ""}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {prescription.medicamentos.length} itens
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Button
                                    onClick={() => handleViewPrescription(prescription.id)}
                                    size="sm"
                                    variant="ghost"
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <FileText className="h-4 w-4" />
                                    <span className="sr-only">Visualizar</span>
                                  </Button>
                                  <Button
                                    onClick={() => handleDeletePrescription(prescription.id)}
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-700 ml-2"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Excluir</span>
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="new" className="mt-4">
            {selectedPatient && (
              <>
                <PrescriptionForm 
                  patientId={selectedPatient.id}
                  onSuccess={handlePrescriptionCreated}
                />
                
                <div className="mt-4 flex justify-start">
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('list')}
                  >
                    Voltar para lista
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="view" className="mt-4">
            {selectedPrescription && selectedPatient && (
              <Card className="p-6">
                <div className="border-b pb-4 mb-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-1">Receituário Médico</h2>
                    <p className="text-gray-600">Prefeitura Municipal de Perobal</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold flex items-center text-health-700 mb-2">
                        <User className="mr-2 h-5 w-5" />
                        Dados do Paciente
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Nome:</span> {selectedPatient.nome}</p>
                        <p><span className="font-medium">CPF:</span> {selectedPatient.cpf}</p>
                        <p><span className="font-medium">Cartão SUS:</span> {selectedPatient.cartaoSus}</p>
                        <p><span className="font-medium">Data Nasc.:</span> {formatDate(selectedPatient.dataNascimento)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold flex items-center text-health-700 mb-2">
                        <Calendar className="mr-2 h-5 w-5" />
                        Dados da Receita
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Médico:</span> {getDoctor(selectedPrescription.medicoId)?.nome}
                        </p>
                        <p>
                          <span className="font-medium">CRM:</span> {getDoctor(selectedPrescription.medicoId)?.crm}
                        </p>
                        <p>
                          <span className="font-medium">Data:</span> {formatDate(selectedPrescription.data)}
                        </p>
                        <p>
                          <span className="font-medium">CID:</span> {selectedPatient.codCid || "Não informado"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold border-b pb-2 mb-3">Medicamentos Prescritos</h3>
                    
                    <div className="space-y-4">
                      {selectedPrescription.medicamentos.map((med, index) => {
                        const medicine = getMedicine(med.medicamentoId);
                        return (
                          <div key={index} className="border-b pb-3">
                            <p className="font-medium">{medicine?.nome} - {medicine?.dosagem} ({medicine?.apresentacao})</p>
                            <p className="text-sm mt-1">{med.posologia}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {selectedPrescription.observacoes && (
                    <div>
                      <h3 className="font-semibold">Observações</h3>
                      <p className="text-sm mt-1">{selectedPrescription.observacoes}</p>
                    </div>
                  )}
                  
                  <div className="mt-8 pt-8 border-t">
                    <div className="flex justify-center">
                      <div className="text-center w-64 border-t border-black pt-2">
                        <p className="text-sm">Assinatura do Médico</p>
                        <p className="text-xs mt-1">CRM: {getDoctor(selectedPrescription.medicoId)?.crm}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('list')}
                  >
                    Voltar para lista
                  </Button>
                  
                  <Button
                    onClick={() => window.print()}
                    className="bg-health-600 hover:bg-health-700"
                  >
                    <FileDown className="mr-1 h-4 w-4" />
                    Imprimir
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Prescriptions;
