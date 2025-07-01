
"""
Modelos de dados simplificados para SisMed Perobal v9.0
"""

from database import db
from utils.security import generate_public_id
from utils.data_format import format_text_field
from datetime import datetime
import json

class Patient(db.Model):
    """Modelo simplificado de Paciente - apenas campos essenciais"""
    __tablename__ = 'patients'
    
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(36), unique=True, nullable=False, default=generate_public_id)
    nome = db.Column(db.String(200), nullable=False)
    cpf = db.Column(db.String(14), nullable=True)  # Opcional
    data_nascimento = db.Column(db.Date, nullable=True)  # Opcional
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamento com receitas
    prescriptions = db.relationship('Prescription', backref='patient', lazy=True, cascade='all, delete-orphan')
    
    def __init__(self, **kwargs):
        # Padronizar dados de texto
        if 'nome' in kwargs:
            kwargs['nome'] = format_text_field(kwargs['nome'])
        if 'cpf' in kwargs and kwargs['cpf']:
            kwargs['cpf'] = format_text_field(kwargs['cpf'])
        
        super().__init__(**kwargs)
    
    def to_dict(self):
        return {
            'id': self.public_id,  # Usar public_id externamente
            'nome': self.nome,
            'cpf': self.cpf,
            'dataNascimento': self.data_nascimento.isoformat() if self.data_nascimento else None,
            'created_at': self.created_at.isoformat()
        }

class Medicine(db.Model):
    """Modelo simplificado de Medicamento"""
    __tablename__ = 'medicines'
    
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(36), unique=True, nullable=False, default=generate_public_id)
    denominacao_generica = db.Column(db.String(200), nullable=False)  # Nome do medicamento
    concentracao = db.Column(db.String(50), nullable=False)  # Ex: "500mg"
    apresentacao = db.Column(db.String(50), nullable=False)  # Ex: "Comprimido"
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __init__(self, **kwargs):
        # Padronizar dados de texto
        for field in ['denominacao_generica', 'concentracao', 'apresentacao']:
            if field in kwargs:
                kwargs[field] = format_text_field(kwargs[field])
        
        super().__init__(**kwargs)
    
    def to_dict(self):
        return {
            'id': self.public_id,  # Usar public_id externamente
            'nome': self.denominacao_generica,  # Manter consistência com frontend
            'dosagem': self.concentracao,  # Manter consistência com frontend
            'apresentacao': self.apresentacao,
            'created_at': self.created_at.isoformat()
        }

class Prescription(db.Model):
    """Modelo de Receita Médica"""
    __tablename__ = 'prescriptions'
    
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(36), unique=True, nullable=False, default=generate_public_id)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    data = db.Column(db.Date, nullable=False, default=datetime.utcnow().date)
    data_vencimento = db.Column(db.Date, nullable=True)
    medicamentos_json = db.Column(db.Text, nullable=False)  # JSON dos medicamentos e posologias
    observacoes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __init__(self, **kwargs):
        # Padronizar observações
        if 'observacoes' in kwargs and kwargs['observacoes']:
            kwargs['observacoes'] = format_text_field(kwargs['observacoes'])
        
        super().__init__(**kwargs)
    
    def get_medicamentos(self):
        """Retorna a lista de medicamentos deserializada"""
        return json.loads(self.medicamentos_json) if self.medicamentos_json else []
    
    def set_medicamentos(self, medicamentos_list):
        """Define a lista de medicamentos serializada"""
        self.medicamentos_json = json.dumps(medicamentos_list)
    
    def to_dict(self):
        return {
            'id': self.public_id,  # Usar public_id externamente
            'pacienteId': self.patient.public_id,  # Usar public_id do paciente
            'data': self.data.isoformat(),
            'dataVencimento': self.data_vencimento.isoformat() if self.data_vencimento else None,
            'medicamentos': self.get_medicamentos(),
            'observacoes': self.observacoes,
            'created_at': self.created_at.isoformat()
        }
