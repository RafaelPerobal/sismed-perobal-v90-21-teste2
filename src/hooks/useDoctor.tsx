
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Doctor {
  id: string;
  user_id: string;
  nome: string;
  crm: string;
  especialidade: string;
  telefone: string;
  email: string;
}

export const useDoctor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDoctorProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchDoctorProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('doctors' as any)
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setDoctor(data);
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }
    } catch (error: any) {
      console.error('Error fetching doctor profile:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar perfil do médico",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDoctorProfile = async (doctorData: Omit<Doctor, 'id' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('doctors' as any)
        .insert([{
          user_id: user.id,
          ...doctorData
        }])
        .select()
        .single();

      if (error) throw error;

      setDoctor(data);
      setHasProfile(true);
      
      toast({
        title: "Perfil criado",
        description: "Seu perfil de médico foi criado com sucesso",
      });

      return data;
    } catch (error: any) {
      console.error('Error creating doctor profile:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar perfil do médico",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateDoctorProfile = async (doctorData: Partial<Omit<Doctor, 'id' | 'user_id'>>) => {
    if (!user || !doctor) return;

    try {
      const { data, error } = await supabase
        .from('doctors' as any)
        .update(doctorData)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setDoctor(data);
      
      toast({
        title: "Perfil atualizado",
        description: "Seu perfil foi atualizado com sucesso",
      });

      return data;
    } catch (error: any) {
      console.error('Error updating doctor profile:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar perfil",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    doctor,
    loading,
    hasProfile,
    createDoctorProfile,
    updateDoctorProfile,
    fetchDoctorProfile
  };
};
