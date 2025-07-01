// Modelo de Paciente (simplificado - campos essenciais)
export interface Patient {
  id: number;
  nome: string; // Campo obrigatório
  cpf: string; // Campo opcional
  dataNascimento: string; // Campo opcional
  // Campos mantidos para compatibilidade com código existente, mas não usados nos formulários
  cartaoSus: string;
  codCid: string;
  nomeMae: string;
  endereco: string;
  contato: string;
  bairro: string;
  observacao: string;
}

// Modelo de Medicamento (simplificado)
export interface Medicine {
  id: number;
  nome: string; // Denominação Genérica
  dosagem: string; // Concentração 
  apresentacao: string; // Ex: comprimido, xarope, injeção
  // Campo mantido para compatibilidade, mas removido do formulário
  descricao: string;
}

// Modelo de Receita (sem referência ao médico)
export interface Prescription {
  id: number;
  pacienteId: number;
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

// Objeto para geração de múltiplas receitas (sem médico)
export interface MultiplePrescriptionsData {
  pacienteId: number;
  medicamentos: PrescriptionMedicine[];
  observacoes: string;
  datas: PrescriptionDateConfig[];
}

// Configuração para impressão
export interface PrintConfig {
  showButtons: boolean;
}
