
"""
API Routes para Receitas Médicas
"""

from flask import Blueprint, request
from database import db
from models import Prescription, Patient, Medicine
from utils.api_response import api_response_wrapper, success_response, error_response
from datetime import datetime
import json

prescriptions_bp = Blueprint('prescriptions', __name__)

@prescriptions_bp.route('', methods=['GET'])
@api_response_wrapper
def get_prescriptions():
    """Listar todas as receitas"""
    patient_id = request.args.get('patient_id')
    
    query = Prescription.query
    
    if patient_id:
        # Buscar por public_id do paciente
        patient = Patient.query.filter_by(public_id=patient_id).first()
        if patient:
            query = query.filter_by(patient_id=patient.id)
        else:
            return []
    
    prescriptions = query.order_by(Prescription.created_at.desc()).all()
    return [prescription.to_dict() for prescription in prescriptions]

@prescriptions_bp.route('/<prescription_id>', methods=['GET'])
@api_response_wrapper
def get_prescription(prescription_id):
    """Obter uma receita específica por public_id"""
    prescription = Prescription.query.filter_by(public_id=prescription_id).first()
    if not prescription:
        raise Exception("Receita não encontrada")
    
    return prescription.to_dict()

@prescriptions_bp.route('', methods=['POST'])
def create_prescription():
    """Criar nova receita"""
    try:
        data = request.get_json()
        
        # Validações obrigatórias
        if not data.get('pacienteId'):
            return error_response("Paciente é obrigatório")
        
        if not data.get('medicamentos') or len(data['medicamentos']) == 0:
            return error_response("Pelo menos um medicamento é obrigatório")
        
        # Buscar paciente por public_id
        patient = Patient.query.filter_by(public_id=data['pacienteId']).first()
        if not patient:
            return error_response("Paciente não encontrado")
        
        # Validar medicamentos
        medicamentos_list = []
        for med_data in data['medicamentos']:
            if not med_data.get('medicamentoId') or not med_data.get('posologia'):
                return error_response("Medicamento e posologia são obrigatórios")
            
            # Verificar se o medicamento existe (por public_id)
            medicine = Medicine.query.filter_by(public_id=med_data['medicamentoId']).first()
            if not medicine:
                return error_response(f"Medicamento {med_data['medicamentoId']} não encontrado")
            
            medicamentos_list.append({
                'medicamentoId': med_data['medicamentoId'],
                'posologia': med_data['posologia'].upper().strip()
            })
        
        # Preparar data
        prescription_date = datetime.utcnow().date()
        if data.get('data'):
            try:
                prescription_date = datetime.strptime(data['data'], '%Y-%m-%d').date()
            except ValueError:
                return error_response("Data inválida")
        
        # Criar receita
        prescription = Prescription(
            patient_id=patient.id,
            data=prescription_date,
            observacoes=data.get('observacoes', ''),
            medicamentos_json=json.dumps(medicamentos_list)
        )
        
        # Data de vencimento se fornecida
        if data.get('dataVencimento'):
            try:
                prescription.data_vencimento = datetime.strptime(
                    data['dataVencimento'], '%Y-%m-%d'
                ).date()
            except ValueError:
                return error_response("Data de vencimento inválida")
        
        db.session.add(prescription)
        db.session.commit()
        
        return success_response(prescription.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return error_response(f"Erro ao criar receita: {str(e)}")

@prescriptions_bp.route('/<prescription_id>', methods=['DELETE'])
def delete_prescription(prescription_id):
    """Excluir receita"""
    try:
        prescription = Prescription.query.filter_by(public_id=prescription_id).first()
        if not prescription:
            return error_response("Receita não encontrada", 404)
        
        db.session.delete(prescription)
        db.session.commit()
        
        return success_response({"message": "Receita excluída com sucesso"})
        
    except Exception as e:
        db.session.rollback()
        return error_response(f"Erro ao excluir receita: {str(e)}")
