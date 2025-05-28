
import { supabase } from '@/integrations/supabase/client';

// Interfaces para os dados do Supabase
export interface SupabasePatient {
  id: string;
  nome: string;
  cpf: string;
  cartao_sus?: string;
  data_nascimento: string;
  contato?: string;
  endereco?: string;
  cod_cid?: string;
}

export interface SupabaseMedicine {
  id: string;
  nome: string;
  dosagem: string;
  apresentacao: string;
}

export interface SupabaseDoctor {
  id: string;
  user_id: string;
  nome: string;
  crm: string;
  especialidade: string;
  telefone?: string;
  email?: string;
}

export interface SupabasePrescription {
  id: string;
  doctor_id: string;
  patient_id: string;
  data: string;
  observacoes?: string;
}

export interface SupabasePrescriptionMedicine {
  id: string;
  prescription_id: string;
  medicine_id: string;
  posologia: string;
}

// Funções para Pacientes
export const getSupabasePatients = async (): Promise<SupabasePatient[]> => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('nome');
  
  if (error) throw error;
  return data || [];
};

export const addSupabasePatient = async (patient: Omit<SupabasePatient, 'id'>): Promise<SupabasePatient> => {
  const { data, error } = await supabase
    .from('patients')
    .insert([patient])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateSupabasePatient = async (patient: SupabasePatient): Promise<SupabasePatient> => {
  const { data, error } = await supabase
    .from('patients')
    .update(patient)
    .eq('id', patient.id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteSupabasePatient = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Funções para Medicamentos
export const getSupabaseMedicines = async (): Promise<SupabaseMedicine[]> => {
  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .order('nome');
  
  if (error) throw error;
  return data || [];
};

export const addSupabaseMedicine = async (medicine: Omit<SupabaseMedicine, 'id'>): Promise<SupabaseMedicine> => {
  const { data, error } = await supabase
    .from('medicines')
    .insert([medicine])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateSupabaseMedicine = async (medicine: SupabaseMedicine): Promise<SupabaseMedicine> => {
  const { data, error } = await supabase
    .from('medicines')
    .update(medicine)
    .eq('id', medicine.id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteSupabaseMedicine = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('medicines')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Funções para Receitas
export const getSupabasePrescriptions = async (doctorId: string): Promise<SupabasePrescription[]> => {
  const { data, error } = await supabase
    .from('prescriptions')
    .select('*')
    .eq('doctor_id', doctorId)
    .order('data', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addSupabasePrescription = async (prescription: Omit<SupabasePrescription, 'id'>): Promise<SupabasePrescription> => {
  const { data, error } = await supabase
    .from('prescriptions')
    .insert([prescription])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteSupabasePrescription = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('prescriptions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Funções para Medicamentos da Receita
export const getPrescriptionMedicines = async (prescriptionId: string): Promise<SupabasePrescriptionMedicine[]> => {
  const { data, error } = await supabase
    .from('prescription_medicines')
    .select('*')
    .eq('prescription_id', prescriptionId);
  
  if (error) throw error;
  return data || [];
};

export const addPrescriptionMedicine = async (prescriptionMedicine: Omit<SupabasePrescriptionMedicine, 'id'>): Promise<SupabasePrescriptionMedicine> => {
  const { data, error } = await supabase
    .from('prescription_medicines')
    .insert([prescriptionMedicine])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
