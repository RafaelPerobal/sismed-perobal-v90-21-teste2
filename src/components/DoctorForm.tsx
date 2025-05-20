
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { addDoctor, updateDoctor } from '@/utils/storage';
import { Doctor } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface DoctorFormProps {
  initialData?: Doctor;
  onSuccess?: () => void;
}

const DoctorForm = ({ initialData, onSuccess }: DoctorFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Doctor, 'id'>>({
    nome: initialData?.nome || '',
    crm: initialData?.crm || '',
    especialidade: initialData?.especialidade || '',
    contato: initialData?.contato || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Formatação para contato
    if (name === 'contato') {
      const formattedPhone = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d)(\d{4})$/, '$1-$2');
      
      setFormData({ ...formData, [name]: formattedPhone });
      return;
    }
    
    // Formatação para CRM - apenas números
    if (name === 'crm') {
      const formattedCrm = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: formattedCrm });
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (initialData?.id) {
        updateDoctor({ ...formData, id: initialData.id });
        toast({
          title: "Médico atualizado",
          description: "Os dados do médico foram atualizados com sucesso",
        });
      } else {
        addDoctor(formData);
        toast({
          title: "Médico cadastrado",
          description: "Novo médico adicionado com sucesso",
        });
        
        // Limpar o formulário após adição
        setFormData({
          nome: '',
          crm: '',
          especialidade: '',
          contato: '',
        });
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar os dados do médico",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-health-700">
        {initialData ? 'Editar Médico' : 'Cadastrar Novo Médico'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Médico</Label>
            <Input
              id="nome"
              name="nome"
              placeholder="Nome completo"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="crm">CRM</Label>
            <Input
              id="crm"
              name="crm"
              placeholder="Apenas números"
              value={formData.crm}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="especialidade">Especialidade</Label>
            <Input
              id="especialidade"
              name="especialidade"
              placeholder="Ex: Clínico Geral"
              value={formData.especialidade}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contato">Contato</Label>
            <Input
              id="contato"
              name="contato"
              placeholder="(00) 00000-0000"
              value={formData.contato}
              onChange={handleChange}
            />
          </div>
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

export default DoctorForm;
