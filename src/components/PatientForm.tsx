
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { addPatient, updatePatient } from '@/utils/storage';
import { Patient } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
    cpf: initialData?.cpf || '',
    cartaoSus: initialData?.cartaoSus || '',
    codCid: initialData?.codCid || '',
    nome: initialData?.nome || '',
    dataNascimento: initialData?.dataNascimento || '',
    nomeMae: initialData?.nomeMae || '',
    endereco: initialData?.endereco || '',
    contato: initialData?.contato || '',
    bairro: initialData?.bairro || '',
    observacao: initialData?.observacao || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    
    // Formatação para cartão SUS
    if (name === 'cartaoSus') {
      const formattedSus = value
        .replace(/\D/g, '')
        .substring(0, 15);
      
      setFormData({ ...formData, [name]: formattedSus });
      return;
    }
    
    // Formatação para telefone
    if (name === 'contato') {
      const formattedPhone = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d)(\d{4})$/, '$1-$2');
      
      setFormData({ ...formData, [name]: formattedPhone });
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
          cpf: '',
          cartaoSus: '',
          codCid: '',
          nome: '',
          dataNascimento: '',
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
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              name="cpf"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={handleChange}
              required
              maxLength={14}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cartaoSus">Cartão SUS</Label>
            <Input
              id="cartaoSus"
              name="cartaoSus"
              placeholder="000 0000 0000 0000"
              value={formData.cartaoSus}
              onChange={handleChange}
              required
            />
          </div>

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
            <Label htmlFor="dataNascimento">Data de Nascimento</Label>
            <Input
              id="dataNascimento"
              name="dataNascimento"
              type="date"
              value={formData.dataNascimento}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="codCid">Código CID</Label>
            <Input
              id="codCid"
              name="codCid"
              placeholder="Ex: J11"
              value={formData.codCid}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nomeMae">Nome da Mãe</Label>
            <Input
              id="nomeMae"
              name="nomeMae"
              placeholder="Nome completo da mãe"
              value={formData.nomeMae}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              name="endereco"
              placeholder="Rua, número"
              value={formData.endereco}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bairro">Bairro</Label>
            <Input
              id="bairro"
              name="bairro"
              placeholder="Bairro"
              value={formData.bairro}
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
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="observacao">Observação</Label>
          <Textarea
            id="observacao"
            name="observacao"
            placeholder="Informações adicionais sobre o paciente"
            value={formData.observacao}
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

export default PatientForm;
