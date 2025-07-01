
"""
SisMed Perobal v9.0 - Servidor Flask Principal
Sistema de Receitas Médicas 100% Local
"""

from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime

from config import Config
from database import db
from routes.api_patients import patients_bp
from routes.api_medicines import medicines_bp
from routes.api_prescriptions import prescriptions_bp
from routes.api_pdf import pdf_bp

def create_app():
    app = Flask(__name__, static_folder='static', static_url_path='')
    app.config.from_object(Config)
    
    # CORS para desenvolvimento
    CORS(app, origins=['http://localhost:3000', 'http://localhost:5001'])
    
    # Inicializar banco de dados
    db.init_app(app)
    
    # Registrar blueprints da API
    app.register_blueprint(patients_bp, url_prefix='/api/patients')
    app.register_blueprint(medicines_bp, url_prefix='/api/medicines')
    app.register_blueprint(prescriptions_bp, url_prefix='/api/prescriptions')
    app.register_blueprint(pdf_bp, url_prefix='/api/pdf')
    
    # Servir o frontend React
    @app.route('/')
    def index():
        return send_from_directory('static', 'index.html')
    
    @app.route('/<path:path>')
    def static_files(path):
        try:
            return send_from_directory('static', path)
        except:
            # Para o React Router - sempre retornar index.html
            return send_from_directory('static', 'index.html')
    
    # Criar tabelas se não existirem
    with app.app_context():
        db.create_all()
        print("✅ Banco de dados SQLite inicializado")
    
    return app

if __name__ == '__main__':
    app = create_app()
    print("🚀 SisMed Perobal v9.0 iniciado!")
    print("📱 Acesse: http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
