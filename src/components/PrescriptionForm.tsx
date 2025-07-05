
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  addPrescription, 
  getPatientById, 
  getDoctors, 
  getMedicines, 
  getMedicineById 
} from '@/utils/storage';
import { Medicine, Doctor, Prescription, PrescriptionMedicine } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Trash2 } from "lucide-react";

interface PrescriptionFormProps {
  patientId?: number;
  onSuccess?: () => void;
}

const PrescriptionForm = ({ patientId, onSuccess }: PrescriptionFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [allMedicines, setAllMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState<number | null>(null);
  const [posologia, setPosologia] = useState("");
  
  const [formData, setFormData] = useState<Omit<Prescription, 'id'>>({
    pacienteId: patientId || 0,
    medicoId: 0,
    data: new Date().toISOString().split('T')[0],
    medicamentos: [],
    observacoes: '',
  });

  // Carregar médicos e paciente selecionado
  useEffect(() => {
    setDoctors(getDoctors());
    setAllMedicines(getMedicines());
    
    if (patientId) {
      setFormData(prev => ({
        ...prev,
        pacienteId: patientId
      }));
    }
  }, [patientId]);

  // Obter nome do paciente
  const patientName = patientId ? getPatientById(patientId)?.nome || "" : "";

  // Filtrar medicamentos com a pesquisa
  const filteredMedicines = allMedicines.filter(med => 
    med.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleDoctorChange = (value: string) => {
    setFormData({ ...formData, medicoId: Number(value) });
  };

  const addMedicineToList = () => {
    if (!selectedMedicine || !posologia) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um medicamento e informe a posologia",
        variant: "destructive"
      });
      return;
    }

    const newMedication: PrescriptionMedicine = {
      medicamentoId: selectedMedicine,
      posologia: posologia
    };

    setFormData({
      ...formData,
      medicamentos: [...formData.medicamentos, newMedication]
    });

    // Limpar os campos
    setSelectedMedicine(null);
    setPosologia("");
  };

  const removeMedicine = (index: number) => {
    const updatedMeds = [...formData.medicamentos];
    updatedMeds.splice(index, 1);
    setFormData({ ...formData, medicamentos: updatedMeds });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (formData.medicamentos.length === 0) {
      toast({
        title: "Lista vazia",
        description: "Adicione pelo menos um medicamento à receita",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.medicoId) {
      toast({
        title: "Médico não selecionado",
        description: "Selecione um médico para a receita",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      addPrescription(formData);
      toast({
        title: "Receita gerada",
        description: "A receita foi gerada com sucesso",
      });
      
      // Limpar o formulário
      setFormData({
        pacienteId: patientId || 0,
        medicoId: 0,
        data: new Date().toISOString().split('T')[0],
        medicamentos: [],
        observacoes: '',
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar a receita",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para obter o medicamento pelo ID
  const getMedicineInfo = (id: number): Medicine | undefined => {
    return getMedicineById(id);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-2 text-health-700">
        Gerar Receita Médica
      </h2>
      
      {patientId ? (
        <p className="mb-6 text-lg">
          Paciente: <strong>{patientName}</strong>
        </p>
      ) : (
        <p className="mb-6 text-red-500">
          Paciente não selecionado. Volte e selecione um paciente.
        </p>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="data">Data da Receita</Label>
            <Input
              id="data"
              name="data"
              type="date"
              value={formData.data}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="medicoId">Médico</Label>
            <Select
              value={formData.medicoId.toString()}
              onValueChange={handleDoctorChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o médico" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id.toString()}>
                    {doctor.nome} - CRM: {doctor.crm}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Adicionar Medicamentos</TabsTrigger>
            <TabsTrigger value="list">Medicamentos Adicionados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="add" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar medicamento"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="border rounded-md max-h-60 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Dosagem</TableHead>
                    <TableHead>Apresentação</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedicines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        Nenhum medicamento encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMedicines.map((med) => (
                      <TableRow key={med.id} className={med.id === selectedMedicine ? "bg-health-100" : ""}>
                        <TableCell>{med.nome}</TableCell>
                        <TableCell>{med.dosagem}</TableCell>
                        <TableCell>{med.apresentacao}</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant={med.id === selectedMedicine ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedMedicine(med.id === selectedMedicine ? null : med.id)}
                          >
                            {med.id === selectedMedicine ? "Selecionado" : "Selecionar"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="posologia">Posologia</Label>
              <Textarea
                id="posologia"
                value={posologia}
                onChange={(e) => setPosologia(e.target.value)}
                placeholder="Ex: Tomar 1 comprimido a cada 8 horas por 7 dias"
                rows={2}
              />
            </div>
            
            <Button
              type="button"
              onClick={addMedicineToList}
              className="w-full bg-health-600 hover:bg-health-700"
              disabled={!selectedMedicine || !posologia}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Medicamento à Receita
            </Button>
          </TabsContent>
          
          <TabsContent value="list">
            {formData.medicamentos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum medicamento adicionado à receita
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medicamento</TableHead>
                      <TableHead>Posologia</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.medicamentos.map((med, index) => {
                      const medicine = getMedicineInfo(med.medicamentoId);
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{medicine?.nome}</p>
                              <p className="text-sm text-muted-foreground">
                                {medicine?.dosagem} - {medicine?.apresentacao}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{med.posologia}</TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMedicine(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
            
            <div className="mt-4">
              <Badge variant="secondary" className="mr-2">
                Total: {formData.medicamentos.length} medicamentos
              </Badge>
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            name="observacoes"
            placeholder="Observações adicionais para a receita"
            value={formData.observacoes}
            onChange={handleChange}
            rows={3}
          />
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-health-600 hover:bg-health-700"
            disabled={isSubmitting || !patientId || formData.medicamentos.length === 0}
          >
            {isSubmitting ? 'Gerando...' : 'Gerar Receita'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PrescriptionForm;
