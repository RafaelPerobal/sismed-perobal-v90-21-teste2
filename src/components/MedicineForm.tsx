
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { addMedicine, updateMedicine } from '@/utils/storage';
import { Medicine } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MedicineFormProps {
  initialData?: Medicine;
  onSuccess?: () => void;
}

const APRESENTACOES = [
  "Comprimido",
  "Cápsula",
  "Xarope",
  "Suspensão",
  "Pomada",
  "Creme",
  "Solução",
  "Injeção",
  "Gotas",
  "Spray"
];

const MedicineForm = ({ initialData, onSuccess }: MedicineFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Medicine, 'id'>>({
    nome: initialData?.nome || '',
    descricao: initialData?.descricao || '',
    dosagem: initialData?.dosagem || '',
    apresentacao: initialData?.apresentacao || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, apresentacao: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (initialData?.id) {
        updateMedicine({ ...formData, id: initialData.id });
        toast({
          title: "Medicamento atualizado",
          description: "Os dados do medicamento foram atualizados com sucesso",
        });
      } else {
        addMedicine(formData);
        toast({
          title: "Medicamento cadastrado",
          description: "Novo medicamento adicionado com sucesso",
        });
        
        // Limpar o formulário após adição
        setFormData({
          nome: '',
          descricao: '',
          dosagem: '',
          apresentacao: '',
        });
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar os dados do medicamento",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-health-700">
        {initialData ? 'Editar Medicamento' : 'Cadastrar Novo Medicamento'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome do Medicamento</Label>
          <Input
            id="nome"
            name="nome"
            placeholder="Ex: Dipirona"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dosagem">Dosagem</Label>
            <Input
              id="dosagem"
              name="dosagem"
              placeholder="Ex: 500mg"
              value={formData.dosagem}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apresentacao">Apresentação</Label>
            <Select
              value={formData.apresentacao}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {APRESENTACOES.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            name="descricao"
            placeholder="Informações adicionais sobre o medicamento"
            value={formData.descricao}
            onChange={handleChange}
            rows={3}
          />
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-health-600 hover:bg-health-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : initialData ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default MedicineForm;
