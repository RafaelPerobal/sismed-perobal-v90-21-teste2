
"""
Padronização de respostas da API
Regra arquitetural: todas as respostas seguem o padrão {"data": ..., "error": null}
"""

from functools import wraps
from flask import jsonify

def api_response_wrapper(func):
    """Decorator para padronizar respostas da API"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            result = func(*args, **kwargs)
            return jsonify({
                "data": result,
                "error": None
            })
        except Exception as e:
            return jsonify({
                "data": None,
                "error": str(e)
            }), 500
    return wrapper

def success_response(data):
    """Retorna resposta de sucesso padronizada"""
    return jsonify({
        "data": data,
        "error": None
    })

def error_response(message, status_code=400):
    """Retorna resposta de erro padronizada"""
    return jsonify({
        "data": None,
        "error": message
    }), status_code
