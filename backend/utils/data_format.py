
"""
Padronização de dados de entrada
"""

def format_text_field(value):
    """
    Padroniza campos de texto: uppercase e remove espaços extras
    Regra arquitetural: todos os textos são salvos em MAIÚSCULO
    """
    if not value or not isinstance(value, str):
        return ""
    
    return value.upper().strip()

def format_medicine_name(name):
    """Formatação específica para nomes de medicamentos"""
    if not name:
        return ""
    
    # Converter para maiúsculo e limpar
    formatted = format_text_field(name)
    
    # Remover caracteres especiais desnecessários
    import re
    formatted = re.sub(r'[^\w\s\-\.]', '', formatted)
    
    return formatted
