
"""
Script de inicialização do banco de dados
Popula tabela de medicamentos com lista padrão
"""

from app import create_app
from database import db
from models import Medicine
import json

# Lista dos 36 medicamentos padrão do SUS
MEDICAMENTOS_PADRAO = [
    {"nome": "DIPIRONA", "concentracao": "500MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "PARACETAMOL", "concentracao": "500MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "IBUPROFENO", "concentracao": "400MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "DICLOFENACO", "concentracao": "50MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "AMOXICILINA", "concentracao": "500MG", "apresentacao": "CÁPSULA"},
    {"nome": "AZITROMICINA", "concentracao": "500MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "CEFALEXINA", "concentracao": "500MG", "apresentacao": "CÁPSULA"},
    {"nome": "CIPROFLOXACINO", "concentracao": "500MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "OMEPRAZOL", "concentracao": "20MG", "apresentacao": "CÁPSULA"},
    {"nome": "RANITIDINA", "concentracao": "150MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "METFORMINA", "concentracao": "850MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "GLIBENCLAMIDA", "concentracao": "5MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "CAPTOPRIL", "concentracao": "25MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "ENALAPRIL", "concentracao": "10MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "LOSARTANA", "concentracao": "50MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "ANLODIPINO", "concentracao": "5MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "ATENOLOL", "concentracao": "50MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "PROPRANOLOL", "concentracao": "40MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "HIDROCLOROTIAZIDA", "concentracao": "25MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "FUROSEMIDA", "concentracao": "40MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "SINVASTATINA", "concentracao": "20MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "ÁCIDO ACETILSALICÍLICO", "concentracao": "100MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "PREDNISONA", "concentracao": "20MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "DEXAMETASONA", "concentracao": "4MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "LORATADINA", "concentracao": "10MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "PROMETAZINA", "concentracao": "25MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "SIMETICONA", "concentracao": "40MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "BISACODIL", "concentracao": "5MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "SULFATO FERROSO", "concentracao": "300MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "ÁCIDO FÓLICO", "concentracao": "5MG", "apresentacao": "COMPRIMIDO"},
    {"nome": "COMPLEXO B", "concentracao": "-", "apresentacao": "COMPRIMIDO"},
    {"nome": "SORO FISIOLÓGICO", "concentracao": "0,9%", "apresentacao": "SOLUÇÃO"},
    {"nome": "DEXTROSE", "concentracao": "5%", "apresentacao": "SOLUÇÃO"},
    {"nome": "ÁLCOOL GEL", "concentracao": "70%", "apresentacao": "GEL"},
    {"nome": "POMADA NISTATINA", "concentracao": "100.000UI/G", "apresentacao": "POMADA"},
    {"nome": "DIPIRONA", "concentracao": "500MG/ML", "apresentacao": "SOLUÇÃO"}
]

def seed_medicines():
    """Popula tabela de medicamentos com dados padrão"""
    app = create_app()
    
    with app.app_context():
        print("🌱 Iniciando seed de medicamentos...")
        
        # Verificar se já existem medicamentos
        existing_count = Medicine.query.count()
        if existing_count > 0:
            print(f"ℹ️  Já existem {existing_count} medicamentos cadastrados")
            return
        
        # Inserir medicamentos padrão
        inserted = 0
        for med_data in MEDICAMENTOS_PADRAO:
            try:
                # Verificar se já existe (evitar duplicatas)
                existing = Medicine.query.filter_by(
                    denominacao_generica=med_data["nome"],
                    concentracao=med_data["concentracao"],
                    apresentacao=med_data["apresentacao"]
                ).first()
                
                if not existing:
                    medicine = Medicine(
                        denominacao_generica=med_data["nome"],
                        concentracao=med_data["concentracao"],
                        apresentacao=med_data["apresentacao"]
                    )
                    db.session.add(medicine)
                    inserted += 1
            
            except Exception as e:
                print(f"❌ Erro ao inserir {med_data['nome']}: {e}")
                continue
        
        # Commit todas as inserções
        try:
            db.session.commit()
            print(f"✅ {inserted} medicamentos inseridos com sucesso!")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Erro ao salvar medicamentos: {e}")

if __name__ == "__main__":
    seed_medicines()
