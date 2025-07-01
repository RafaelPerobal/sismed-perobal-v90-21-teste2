
"""
Configurações do SisMed Perobal v9.0
"""

import os
from datetime import timedelta

class Config:
    # Banco de dados SQLite local
    SQLALCHEMY_DATABASE_URI = 'sqlite:///sismed_v9.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Segurança
    SECRET_KEY = 'sismed-perobal-v9-local-secret-key-2024'
    
    # Configurações da aplicação
    DEBUG = True
    
    # Diretórios
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    STATIC_FOLDER = os.path.join(BASE_DIR, 'static')
    
    # PDF Config
    PDF_TEMP_DIR = os.path.join(BASE_DIR, 'temp_pdfs')
    
    # Aplicação Info
    APP_NAME = "SisMed Perobal v9.0"
    ORG_NAME = "Prefeitura Municipal de Perobal"
    ORG_ADDRESS = "Rua Jaracatiá, 1060 - Telefax (044)3625-1225 CEP. 87538-000 PEROBAL - PARANÁ"
