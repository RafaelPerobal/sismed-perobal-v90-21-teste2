
"""
API Routes para geração de PDF
"""

from flask import Blueprint, send_file, request
from models import Prescription, Patient, Medicine
from utils.api_response import error_response
from utils.pdf_generator import generate_prescription_pdf
import os
import tempfile

pdf_bp = Blueprint('pdf', __name__)

@pdf_bp.route('/prescription/<prescription_id>', methods=['GET'])
def generate_prescription_pdf_route(prescription_id):
    """Gerar PDF de uma receita específica"""
    try:
        # Buscar receita por public_id
        prescription = Prescription.query.filter_by(public_id=prescription_id).first()
        if not prescription:
            return error_response("Receita não encontrada", 404)
        
        # Gerar PDF
        pdf_buffer = generate_prescription_pdf(prescription)
        
        # Criar arquivo temporário
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        temp_file.write(pdf_buffer.getvalue())
        temp_file.close()
        
        # Retornar arquivo para download
        return send_file(
            temp_file.name,
            as_attachment=True,
            download_name=f'receita_{prescription.patient.nome.replace(" ", "_")}_{prescription.data.strftime("%Y%m%d")}.pdf',
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return error_response(f"Erro ao gerar PDF: {str(e)}")
