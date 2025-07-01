
/**
 * Adaptador de Storage - Transição do localStorage para API Flask
 * Mantém compatibilidade com funções existentes enquanto migra para API
 */

import { api } from '../services/api';

// Funções de Pacientes (adaptadas para API)
export const getPatients = async () => {
  try {
    const response = await api.getPatients();
    return response.data || [];
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    return [];
  }
};

export const getPatientById = async (id) => {
  try {
    const response = await api.getPatientById(id);
    return response.data || null;
  } catch (error) {
    console.error('Erro ao buscar paciente:', error);
    return null;
  }
};

export const addPatient = async (patientData) => {
  try {
    const response = await api.createPatient(patientData);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar paciente:', error);
    throw error;
  }
};

export const updatePatient = async (patientData) => {
  try {
    const response = await api.updatePatient(patientData.id, patientData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    throw error;
  }
};

export const deletePatient = async (id) => {
  try {
    await api.deletePatient(id);
    return true;
  } catch (error) {
    console.error('Erro ao excluir paciente:', error);
    throw error;
  }
};

export const findPatientByCpf = async (cpf) => {
  try {
    const response = await api.searchPatients(cpf);
    const patients = response.data || [];
    return patients.find(p => p.cpf === cpf) || null;
  } catch (error) {
    console.error('Erro ao buscar paciente por CPF:', error);
    return null;
  }
};

export const findPatientsByName = async (name) => {
  try {
    const response = await api.searchPatients(name);
    return response.data || [];
  } catch (error) {
    console.error('Erro ao buscar pacientes por nome:', error);
    return [];
  }
};

// Funções de Medicamentos (adaptadas para API)
export const getMedicines = async () => {
  try {
    const response = await api.getMedicines();
    return response.data || [];
  } catch (error) {
    console.error('Erro ao buscar medicamentos:', error);
    return [];
  }
};

export const getMedicineById = async (id) => {
  try {
    const response = await api.getMedicineById(id);
    return response.data || null;
  } catch (error) {
    console.error('Erro ao buscar medicamento:', error);
    return null;
  }
};

export const addMedicine = async (medicineData) => {
  try {
    const response = await api.createMedicine(medicineData);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar medicamento:', error);
    throw error;
  }
};

export const updateMedicine = async (medicineData) => {
  try {
    const response = await api.updateMedicine(medicineData.id, medicineData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar medicamento:', error);
    throw error;
  }
};

// Funções de Receitas (adaptadas para API)
export const getPrescriptions = async () => {
  try {
    const response = await api.getPrescriptions();
    return response.data || [];
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    return [];
  }
};

export const getPrescriptionById = async (id) => {
  try {
    const response = await api.getPrescriptionById(id);
    return response.data || null;
  } catch (error) {
    console.error('Erro ao buscar receita:', error);
    return null;
  }
};

export const addPrescription = async (prescriptionData) => {
  try {
    const response = await api.createPrescription(prescriptionData);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar receita:', error);
    throw error;
  }
};

export const deletePrescription = async (id) => {
  try {
    await api.deletePrescription(id);
    return true;
  } catch (error) {
    console.error('Erro ao excluir receita:', error);
    throw error;
  }
};

// Função para baixar PDF de receita
export const downloadPrescriptionPDF = async (prescriptionId) => {
  try {
    const blob = await api.generatePrescriptionPDF(prescriptionId);
    
    // Criar URL temporária e fazer download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receita_${prescriptionId}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Erro ao baixar PDF:', error);
    throw error;
  }
};
