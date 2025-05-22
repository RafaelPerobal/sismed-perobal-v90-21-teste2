
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  addPrescription, 
  getPatientById, 
  getDoctors, 
  getMedicines, 
  getMedicineById 
} from '@/utils/storage';
import { 
  Medicine, 
  Doctor, 
  Prescription, 
  PrescriptionMedicine,
  PrescriptionDateConfig
} from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

// Import our new components
import PrescriptionDateSelector from './PrescriptionDateSelector';
import DoctorSelector from './prescription/DoctorSelector';
import MedicineSearch from './prescription/MedicineSearch';
import PosologyInput from './prescription/PosologyInput';
import MedicineList from './prescription/MedicineList';
import ObservationsInput from './prescription/ObservationsInput';

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
  const [prescriptionDates, setPrescriptionDates] = useState<PrescriptionDateConfig[]>([
    { enabled: true, date: new Date().toISOString().split('T')[0] }
  ]);
  
  const [formData, setFormData] = useState<Omit<Prescription, 'id'>>({
    pacienteId: patientId || 0,
    medicoId: 0,
    data: new Date().toISOString().split('T')[0],
    medicamentos: [],
    observacoes: '',
  });

  // Load doctors and selected patient
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

  // Get patient name
  const patientName = patientId ? getPatientById(patientId)?.nome || "" : "";

  // Filter medicines with search
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

    // Clear fields
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
      // Check if we're generating multiple prescriptions
      const enabledDates = prescriptionDates.filter(d => d.enabled);
      
      if (enabledDates.length > 1) {
        // Generate multiple prescriptions
        enabledDates.forEach((dateConfig) => {
          const prescriptionData = {
            ...formData,
            data: dateConfig.date
          };
          
          addPrescription(prescriptionData);
        });
        
        toast({
          title: `${enabledDates.length} receitas geradas`,
          description: `Foram geradas ${enabledDates.length} receitas com sucesso`,
        });
      } else if (enabledDates.length === 1) {
        // Generate a single prescription with the selected date
        const prescriptionData = {
          ...formData,
          data: enabledDates[0].date
        };
        
        addPrescription(prescriptionData);
        
        toast({
          title: "Receita gerada",
          description: "A receita foi gerada com sucesso",
        });
      } else {
        toast({
          title: "Nenhuma data selecionada",
          description: "Selecione pelo menos uma data para gerar a receita",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Clear the form
      setFormData({
        pacienteId: patientId || 0,
        medicoId: 0,
        data: new Date().toISOString().split('T')[0],
        medicamentos: [],
        observacoes: '',
      });
      
      // Reset dates
      setPrescriptionDates([{ 
        enabled: true, 
        date: new Date().toISOString().split('T')[0] 
      }]);
      
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

  // Function to get medicine by ID
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
          <DoctorSelector 
            doctors={doctors} 
            selectedDoctorId={formData.medicoId}
            onChange={handleDoctorChange}
          />
          
          <div className="space-y-2">
            <PrescriptionDateSelector 
              dates={prescriptionDates}
              onChange={setPrescriptionDates}
              initialDate={formData.data}
            />
          </div>
        </div>

        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Adicionar Medicamentos</TabsTrigger>
            <TabsTrigger value="list">Medicamentos Adicionados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="add" className="space-y-4">
            <MedicineSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filteredMedicines={filteredMedicines}
              selectedMedicine={selectedMedicine}
              setSelectedMedicine={setSelectedMedicine}
            />
            
            <PosologyInput
              posologia={posologia}
              setPosologia={setPosologia}
              selectedMedicine={selectedMedicine}
              onAddMedicine={addMedicineToList}
            />
          </TabsContent>
          
          <TabsContent value="list">
            <MedicineList
              medicines={formData.medicamentos}
              onRemove={removeMedicine}
              getMedicineInfo={getMedicineInfo}
            />
          </TabsContent>
        </Tabs>

        <ObservationsInput
          value={formData.observacoes}
          onChange={handleChange}
        />
        
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-health-600 hover:bg-health-700"
            disabled={isSubmitting || !patientId || formData.medicamentos.length === 0}
          >
            {isSubmitting ? 'Gerando...' : prescriptionDates.filter(d => d.enabled).length > 1 
              ? `Gerar ${prescriptionDates.filter(d => d.enabled).length} Receitas` 
              : 'Gerar Receita'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PrescriptionForm;
