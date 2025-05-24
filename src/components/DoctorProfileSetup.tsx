
import { useState } from 'react';
import { useDoctor } from '@/hooks/useDoctor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope } from 'lucide-react';

interface DoctorProfileSetupProps {
  onComplete: () => void;
}

const DoctorProfileSetup = ({ onComplete }: DoctorProfileSetupProps) => {
  const { createDoctorProfile } = useDoctor();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    crm: '',
    especialidade: '',
    telefone: '',
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'telefone') {
      const formattedPhone = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d)(\d{4})$/, '$1-$2');
      
      setFormData({ ...formData, [name]: formattedPhone });
      return;
    }
    
    if (name === 'crm') {
      const formattedCrm = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: formattedCrm });
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createDoctorProfile(formData);
      onComplete();
    } catch (error) {
      // Error handled in useDoctor hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Stethoscope className="mx-auto h-12 w-12 text-health-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Complete seu Cadastro
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Para usar o sistema, precisamos de algumas informações
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Médico</CardTitle>
            <CardDescription>
              Preencha suas informações profissionais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  name="nome"
                  placeholder="Seu nome completo"
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
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Profissional</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="medico@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-health-600 hover:bg-health-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Completar Cadastro'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorProfileSetup;
