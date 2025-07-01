
"""
API Routes para Medicamentos
"""

from flask import Blueprint, request
from database import db
from models import Medicine
from utils.api_response import api_response_wrapper, success_response, error_response

medicines_bp = Blueprint('medicines', __name__)

@medicines_bp.route('', methods=['GET'])
@api_response_wrapper
def get_medicines():
    """Listar todos os medicamentos"""
    medicines = Medicine.query.order_by(Medicine.denominacao_generica).all()
    return [medicine.to_dict() for medicine in medicines]

@medicines_bp.route('/<medicine_id>', methods=['GET'])
@api_response_wrapper
def get_medicine(medicine_id):
    """Obter um medicamento específico por public_id"""
    medicine = Medicine.query.filter_by(public_id=medicine_id).first()
    if not medicine:
        raise Exception("Medicamento não encontrado")
    
    return medicine.to_dict()

@medicines_bp.route('', methods=['POST'])
def create_medicine():
    """Criar novo medicamento"""
    try:
        data = request.get_json()
        
        # Validações obrigatórias
        required_fields = ['nome', 'dosagem', 'apresentacao']
        for field in required_fields:
            if not data.get(field):
                return error_response(f"{field} é obrigatório")
        
        # Verificar se já existe medicamento com os mesmos dados
        existing = Medicine.query.filter_by(
            denominacao_generica=data['nome'].upper().strip(),
            concentracao=data['dosagem'].upper().strip(),
            apresentacao=data['apresentacao'].upper().strip()
        ).first()
        
        if existing:
            return error_response("Medicamento já cadastrado com estes dados")
        
        # Criar medicamento
        medicine = Medicine(
            denominacao_generica=data['nome'],
            concentracao=data['dosagem'],
            apresentacao=data['apresentacao']
        )
        
        db.session.add(medicine)
        db.session.commit()
        
        return success_response(medicine.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return error_response(f"Erro ao criar medicamento: {str(e)}")

@medicines_bp.route('/<medicine_id>', methods=['PUT'])
def update_medicine(medicine_id):
    """Atualizar medicamento existente"""
    try:
        medicine = Medicine.query.filter_by(public_id=medicine_id).first()
        if not medicine:
            return error_response("Medicamento não encontrado", 404)
        
        data = request.get_json()
        
        # Validações
        if 'nome' in data and not data['nome']:
            return error_response("Nome é obrigatório")
        if 'dosagem' in data and not data['dosagem']:
            return error_response("Concentração é obrigatória")
        if 'apresentacao' in data and not data['apresentacao']:
            return error_response("Apresentação é obrigatória")
        
        # Atualizar campos
        if 'nome' in data:
            medicine.denominacao_generica = data['nome']
        if 'dosagem' in data:
            medicine.concentracao = data['dosagem']
        if 'apresentacao' in data:
            medicine.apresentacao = data['apresentacao']
        
        db.session.commit()
        return success_response(medicine.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return error_response(f"Erro ao atualizar medicamento: {str(e)}")

@medicines_bp.route('/<medicine_id>', methods=['DELETE'])
def delete_medicine(medicine_id):
    """Excluir medicamento"""
    try:
        medicine = Medicine.query.filter_by(public_id=medicine_id).first()
        if not medicine:
            return error_response("Medicamento não encontrado", 404)
        
        db.session.delete(medicine)
        db.session.commit()
        
        return success_response({"message": "Medicamento excluído com sucesso"})
        
    except Exception as e:
        db.session.rollback()
        return error_response(f"Erro ao excluir medicamento: {str(e)}")

@medicines_bp.route('/search', methods=['GET'])
@api_response_wrapper
def search_medicines():
    """Buscar medicamentos por nome"""
    query = request.args.get('q', '').strip()
    
    if not query:
        return []
    
    medicines = Medicine.query.filter(
        Medicine.denominacao_generica.contains(query.upper())
    ).order_by(Medicine.denominacao_generica).all()
    
    return [medicine.to_dict() for medicine in medicines]
