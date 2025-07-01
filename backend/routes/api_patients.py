
"""
API Routes para Pacientes
"""

from flask import Blueprint, request, jsonify
from database import db
from models import Patient
from utils.api_response import api_response_wrapper, success_response, error_response
from utils.security import validate_cpf, format_cpf
from datetime import datetime

patients_bp = Blueprint('patients', __name__)

@patients_bp.route('', methods=['GET'])
@api_response_wrapper
def get_patients():
    """Listar todos os pacientes"""
    patients = Patient.query.order_by(Patient.nome).all()
    return [patient.to_dict() for patient in patients]

@patients_bp.route('/<patient_id>', methods=['GET'])
@api_response_wrapper
def get_patient(patient_id):
    """Obter um paciente específico por public_id"""
    patient = Patient.query.filter_by(public_id=patient_id).first()
    if not patient:
        raise Exception("Paciente não encontrado")
    
    return patient.to_dict()

@patients_bp.route('', methods=['POST'])
def create_patient():
    """Criar novo paciente"""
    try:
        data = request.get_json()
        
        # Validações obrigatórias
        if not data.get('nome'):
            return error_response("Nome é obrigatório")
        
        # Validar CPF se fornecido
        if data.get('cpf') and not validate_cpf(data.get('cpf')):
            return error_response("CPF inválido")
        
        # Preparar dados
        patient_data = {
            'nome': data['nome'],
            'cpf': format_cpf(data.get('cpf', '')) if data.get('cpf') else None,
        }
        
        # Data de nascimento se fornecida
        if data.get('dataNascimento'):
            try:
                patient_data['data_nascimento'] = datetime.strptime(
                    data['dataNascimento'], '%Y-%m-%d'
                ).date()
            except ValueError:
                return error_response("Data de nascimento inválida")
        
        # Criar paciente
        patient = Patient(**patient_data)
        db.session.add(patient)
        db.session.commit()
        
        return success_response(patient.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return error_response(f"Erro ao criar paciente: {str(e)}")

@patients_bp.route('/<patient_id>', methods=['PUT'])
def update_patient(patient_id):
    """Atualizar paciente existente"""
    try:
        patient = Patient.query.filter_by(public_id=patient_id).first()
        if not patient:
            return error_response("Paciente não encontrado", 404)
        
        data = request.get_json()
        
        # Validações
        if 'nome' in data and not data['nome']:
            return error_response("Nome é obrigatório")
        
        if 'cpf' in data and data['cpf'] and not validate_cpf(data['cpf']):
            return error_response("CPF inválido")
        
        # Atualizar campos
        if 'nome' in data:
            patient.nome = data['nome']
        
        if 'cpf' in data:
            patient.cpf = format_cpf(data['cpf']) if data['cpf'] else None
        
        if 'dataNascimento' in data:
            if data['dataNascimento']:
                try:
                    patient.data_nascimento = datetime.strptime(
                        data['dataNascimento'], '%Y-%m-%d'
                    ).date()
                except ValueError:
                    return error_response("Data de nascimento inválida")
            else:
                patient.data_nascimento = None
        
        db.session.commit()
        return success_response(patient.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return error_response(f"Erro ao atualizar paciente: {str(e)}")

@patients_bp.route('/<patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    """Excluir paciente"""
    try:
        patient = Patient.query.filter_by(public_id=patient_id).first()
        if not patient:
            return error_response("Paciente não encontrado", 404)
        
        db.session.delete(patient)
        db.session.commit()
        
        return success_response({"message": "Paciente excluído com sucesso"})
        
    except Exception as e:
        db.session.rollback()
        return error_response(f"Erro ao excluir paciente: {str(e)}")

@patients_bp.route('/search', methods=['GET'])
@api_response_wrapper
def search_patients():
    """Buscar pacientes por nome ou CPF"""
    query = request.args.get('q', '').strip()
    
    if not query:
        return []
    
    # Buscar por nome ou CPF
    patients = Patient.query.filter(
        db.or_(
            Patient.nome.contains(query.upper()),
            Patient.cpf.contains(query)
        )
    ).order_by(Patient.nome).all()
    
    return [patient.to_dict() for patient in patients]
