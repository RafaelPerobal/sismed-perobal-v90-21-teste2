// Modelo de Paciente
export interface Patient {
  id: number;
  cpf: string;
  cartaoSus: string;
  codCid: string;
  nome: string;
  dataNascimento: string;
  nomeMae: string;
  endereco: string;
  contato: string;
  bairro: string;
  observacao: string;
}

// Modelo de Medicamento
export interface Medicine {
  id: number;
  nome: string;
  descricao: string;
  dosagem: string;
  apresentacao: string; // Ex: comprimido, xarope, injeção
}

// Modelo de Médico
export interface Doctor {
  id: number;
  nome: string;
  crm: string;
  especialidade: string;
  contato: string;
}

// Modelo de Receita
export interface Prescription {
  id: number;
  pacienteId: number;
  medicoId: number;
  data: string;
  dataVencimento?: string; // Data de vencimento opcional
  medicamentos: PrescriptionMedicine[];
  observacoes: string;
}

// Medicamentos da Receita
export interface PrescriptionMedicine {
  medicamentoId: number;
  posologia: string; // Como tomar o medicamento
}

// Configuração de datas para múltiplas receitas
export interface PrescriptionDateConfig {
  enabled: boolean;
  date: string;
}

// Objeto para geração de múltiplas receitas
export interface MultiplePrescriptionsData {
  pacienteId: number;
  medicoId: number;
  medicamentos: PrescriptionMedicine[];
  observacoes: string;
  datas: PrescriptionDateConfig[];
}

// Configuração para impressão
export interface PrintConfig {
  showButtons: boolean;
}
