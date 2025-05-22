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
import { Search, Plus, FileText, User, FileDown, Trash2, Calendar, Printer } from 'lucide-react';
import { format } from 'date-fns';

// CSS para impressão - esconder elementos e ajustar estilo
const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    
    .print-container, .print-container * {
      visibility: visible !important;
    }
    
    .print-container {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      padding: 20px;
      font-family: "Courier New", monospace; /* Emula a fonte Epson */
      font-size: 12pt;
      line-height: 1.3;
    }
    
    .print-header {
      margin-bottom: 30px;
    }
    
    .no-print, .no-print * {
      display: none !important;
    }
    
    .print-only {
      display: block !important;
    }
    
    button, .tabs-container, nav {
      display: none !important;
    }
    
    .prescription-content {
      page-break-inside: avoid;
    }
    
    @page {
      margin: 1.5cm;
      size: A4;
    }
  }
  
  .print-only {
    display: none;
  }
`;

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
  
  const handlePrint = () => {
    window.print();
  };
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return format(date, 'dd/MM/yyyy');
  };
  
  const getDoctor = (id: number): Doctor | undefined => {
    return getDoctorById(id);
  };
  
  const getMedicine = (id: number): Medicine | undefined => {
    return getMedicineById(id);
  };
  
  // Função para preparar o nome do arquivo para download
  const generatePrescriptionFilename = (prescription: Prescription, patient: Patient | undefined) => {
    if (!patient) return `receita_${prescription.id}`;
    
    const prescDate = formatDate(prescription.data).replace(/\//g, '-');
    const patientName = patient.nome.replace(/\s+/g, '_').toLowerCase();
    
    return `receita_${patientName}_${prescDate}`;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Estilos para impressão */}
      <style>{printStyles}</style>
      
      <div className="no-print">
        <Navbar />
      </div>
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 no-print">
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
          className="tabs-container no-print"
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
          
          <TabsContent value="new" className="mt-4 no-print">
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
              <>
                {/* Versão para tela */}
                <Card className="p-6 no-print">
                  <div className="border-b pb-4 mb-6">
                    <div className="text-center">
                      <img 
                        src="/lovable-uploads/2da6758a-bafa-4440-9d4f-d8f29482cec7.png" 
                        alt="Prefeitura Municipal de Perobal" 
                        className="mx-auto mb-4 max-h-32"
                      />
                      <h2 className="text-2xl font-bold mb-1">Receituário Médico</h2>
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
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={handlePrint}
                        className="bg-health-600 hover:bg-health-700"
                      >
                        <Printer className="mr-1 h-4 w-4" />
                        Imprimir
                      </Button>
                    </div>
                  </div>
                </Card>
                
                {/* Versão para impressão */}
                <div className="print-only print-container">
                  <div className="print-header">
                    <img 
                      src="/lovable-uploads/2da6758a-bafa-4440-9d4f-d8f29482cec7.png" 
                      alt="Prefeitura Municipal de Perobal" 
                      className="w-full max-h-24 object-contain mb-4"
                    />
                    <h2 className="text-xl font-bold mb-4 text-center">RECEITUÁRIO MÉDICO</h2>
                  </div>
                  
                  <div className="prescription-content">
                    <table className="w-full mb-4">
                      <tbody>
                        <tr>
                          <td className="align-top py-1">
                            <strong>Paciente:</strong> {selectedPatient.nome}
                          </td>
                          <td className="align-top py-1">
                            <strong>Data:</strong> {formatDate(selectedPrescription.data)}
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top py-1">
                            <strong>CPF:</strong> {selectedPatient.cpf}
                          </td>
                          <td className="align-top py-1">
                            <strong>Cartão SUS:</strong> {selectedPatient.cartaoSus}
                          </td>
                        </tr>
                        <tr>
                          <td className="align-top py-1">
                            <strong>Data Nasc.:</strong> {formatDate(selectedPatient.dataNascimento)}
                          </td>
                          <td className="align-top py-1">
                            <strong>CID:</strong> {selectedPatient.codCid || "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    
                    <div className="border-t border-b py-3 my-4">
                      <h3 className="font-bold mb-2">MEDICAMENTOS PRESCRITOS:</h3>
                      
                      <ol className="list-decimal pl-6 space-y-6">
                        {selectedPrescription.medicamentos.map((med, index) => {
                          const medicine = getMedicine(med.medicamentoId);
                          return (
                            <li key={index} className="mb-2">
                              <p className="font-bold">{medicine?.nome} - {medicine?.dosagem} ({medicine?.apresentacao})</p>
                              <p>{med.posologia}</p>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                    
                    {selectedPrescription.observacoes && (
                      <div className="my-4">
                        <h3 className="font-bold mb-1">OBSERVAÇÕES:</h3>
                        <p>{selectedPrescription.observacoes}</p>
                      </div>
                    )}
                    
                    <div className="mt-12 pt-4">
                      <div className="flex justify-center">
                        <div className="text-center border-t border-black pt-1" style={{width: '200px'}}>
                          <p>{getDoctor(selectedPrescription.medicoId)?.nome}</p>
                          <p>CRM: {getDoctor(selectedPrescription.medicoId)?.crm}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-center mt-8 pt-8">
                      <p>Rua Jaracatiá, 1060 - Telefax (044)3625-1225 CEP. 87538-000 PEROBAL - PARANÁ</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Prescriptions;
