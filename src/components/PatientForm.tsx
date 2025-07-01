
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { addPatient, updatePatient } from '@/utils/storage';
import { Patient } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface PatientFormProps {
  initialData?: Patient;
  onSuccess?: () => void;
}

const PatientForm = ({ initialData, onSuccess }: PatientFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Patient, 'id'>>({
    nome: initialData?.nome || '',
    cpf: initialData?.cpf || '',
    dataNascimento: initialData?.dataNascimento || '',
    // Campos removidos: cartaoSus, codCid, nomeMae, endereco, contato, bairro, observacao
    cartaoSus: '',
    codCid: '',
    nomeMae: '',
    endereco: '',
    contato: '',
    bairro: '',
    observacao: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Formatação específica para CPF
    if (name === 'cpf') {
      const formattedCpf = value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
      
      setFormData({ ...formData, [name]: formattedCpf });
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (initialData?.id) {
        updatePatient({ ...formData, id: initialData.id });
        toast({
          title: "Paciente atualizado",
          description: "Os dados do paciente foram atualizados com sucesso",
        });
      } else {
        addPatient(formData);
        toast({
          title: "Paciente cadastrado",
          description: "Novo paciente adicionado com sucesso",
        });
        
        // Limpar o formulário após adição
        setFormData({
          nome: '',
          cpf: '',
          dataNascimento: '',
          cartaoSus: '',
          codCid: '',
          nomeMae: '',
          endereco: '',
          contato: '',
          bairro: '',
          observacao: '',
        });
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar os dados do paciente",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-health-700">
        {initialData ? 'Editar Paciente' : 'Cadastrar Novo Paciente'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome do Paciente</Label>
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
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            name="cpf"
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChange={handleChange}
            maxLength={14}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dataNascimento">Data de Nascimento</Label>
          <Input
            id="dataNascimento"
            name="dataNascimento"
            type="date"
            value={formData.dataNascimento}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex justify-end pt-4">
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

export default PatientForm;
