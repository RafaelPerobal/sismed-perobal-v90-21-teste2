
/**
 * Serviço de comunicação com a API Flask local
 * Centraliza todas as chamadas HTTP do frontend React
 */

const API_BASE = 'http://localhost:5001/api';

// Utilitário para fazer requests padronizados
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  if (finalOptions.body && typeof finalOptions.body === 'object') {
    finalOptions.body = JSON.stringify(finalOptions.body);
  }
  
  try {
    const response = await fetch(url, finalOptions);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

// API de Pacientes
export const patientsApi = {
  getAll: () => apiRequest('/patients'),
  
  getById: (id) => apiRequest(`/patients/${id}`),
  
  create: (patientData) => apiRequest('/patients', {
    method: 'POST',
    body: patientData
  }),
  
  update: (id, patientData) => apiRequest(`/patients/${id}`, {
    method: 'PUT',
    body: patientData
  }),
  
  delete: (id) => apiRequest(`/patients/${id}`, {
    method: 'DELETE'
  }),
  
  search: (query) => apiRequest(`/patients/search?q=${encodeURIComponent(query)}`)
};

// API de Medicamentos
export const medicinesApi = {
  getAll: () => apiRequest('/medicines'),
  
  getById: (id) => apiRequest(`/medicines/${id}`),
  
  create: (medicineData) => apiRequest('/medicines', {
    method: 'POST',
    body: medicineData
  }),
  
  update: (id, medicineData) => apiRequest(`/medicines/${id}`, {
    method: 'PUT',
    body: medicineData
  }),
  
  delete: (id) => apiRequest(`/medicines/${id}`, {
    method: 'DELETE'
  }),
  
  search: (query) => apiRequest(`/medicines/search?q=${encodeURIComponent(query)}`)
};

// API de Receitas
export const prescriptionsApi = {
  getAll: (patientId = null) => {
    const params = patientId ? `?patient_id=${patientId}` : '';
    return apiRequest(`/prescriptions${params}`);
  },
  
  getById: (id) => apiRequest(`/prescriptions/${id}`),
  
  create: (prescriptionData) => apiRequest('/prescriptions', {
    method: 'POST',
    body: prescriptionData
  }),
  
  delete: (id) => apiRequest(`/prescriptions/${id}`, {
    method: 'DELETE'
  }),
  
  // Gerar PDF (retorna blob)
  generatePDF: async (id) => {
    const url = `${API_BASE}/pdf/prescription/${id}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao gerar PDF');
    }
    
    return response.blob();
  }
};

// API unificada (compatibilidade com código existente)
export const api = {
  // Pacientes
  getPatients: patientsApi.getAll,
  getPatientById: patientsApi.getById,
  createPatient: patientsApi.create,
  updatePatient: patientsApi.update,
  deletePatient: patientsApi.delete,
  searchPatients: patientsApi.search,
  
  // Medicamentos
  getMedicines: medicinesApi.getAll,
  getMedicineById: medicinesApi.getById,
  createMedicine: medicinesApi.create,
  updateMedicine: medicinesApi.update,
  deleteMedicine: medicinesApi.delete,
  searchMedicines: medicinesApi.search,
  
  // Receitas
  getPrescriptions: prescriptionsApi.getAll,
  getPrescriptionById: prescriptionsApi.getById,
  createPrescription: prescriptionsApi.create,
  deletePrescription: prescriptionsApi.delete,
  generatePrescriptionPDF: prescriptionsApi.generatePDF
};

export default api;
