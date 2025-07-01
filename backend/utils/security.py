
"""
Utilitários de segurança - UUIDs e validações
"""

import uuid
import re

def generate_public_id():
    """Gera um UUID único para uso em APIs públicas"""
    return str(uuid.uuid4())

def validate_cpf(cpf):
    """Validação básica de CPF (formato)"""
    if not cpf:
        return True  # CPF é opcional
    
    # Remove formatação
    cpf_clean = re.sub(r'[^0-9]', '', cpf)
    
    # Verifica se tem 11 dígitos
    return len(cpf_clean) == 11

def format_cpf(cpf):
    """Formata CPF com pontos e traço"""
    if not cpf:
        return ""
    
    cpf_clean = re.sub(r'[^0-9]', '', cpf)
    if len(cpf_clean) == 11:
        return f"{cpf_clean[:3]}.{cpf_clean[3:6]}.{cpf_clean[6:9]}-{cpf_clean[9:]}"
    
    return cpf
