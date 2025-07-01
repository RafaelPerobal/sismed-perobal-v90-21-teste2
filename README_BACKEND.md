
# SisMed Perobal v9.0 - Backend Python/Flask

## Visão Geral
Backend local em Python/Flask para o Sistema de Receitas Médicas da Prefeitura Municipal de Perobal. 
Projetado para operar 100% offline com banco SQLite.

## Características Principais

### 🏗️ Arquitetura
- **Flask** como framework web
- **SQLAlchemy** como ORM
- **SQLite** como banco de dados local
- **ReportLab** para geração de PDFs
- **CORS** habilitado para desenvolvimento

### 🔐 Segurança
- **UUIDs públicos**: Todos os modelos usam `public_id` (UUID) para comunicação externa
- **IDs internos**: IDs numéricos ficam apenas no banco de dados
- **Padronização**: Todos os textos são salvos em MAIÚSCULO (.upper().strip())

### 📡 API RESTful
- **Envelope padronizado**: `{"data": ..., "error": null}` para todas as respostas
- **Endpoints organizados**: Separados por recursos (patients, medicines, prescriptions, pdf)
- **Validações robustas**: Campos obrigatórios e formato de dados

## Estrutura do Projeto

```
backend/
├── app.py                    # Servidor Flask principal
├── config.py                 # Configurações
├── database.py               # Setup SQLAlchemy
├── models.py                 # Modelos de dados
├── seed.py                   # População inicial
├── requirements.txt          # Dependências
├── Iniciar_SisMed.bat       # Script de inicialização
├── routes/                   # Rotas da API
│   ├── api_patients.py       # CRUD Pacientes
│   ├── api_medicines.py      # CRUD Medicamentos
│   ├── api_prescriptions.py  # CRUD Receitas
│   └── api_pdf.py           # Geração de PDF
├── utils/                    # Utilitários
│   ├── security.py          # UUIDs e validações
│   ├── data_format.py       # Padronização de dados
│   ├── api_response.py      # Padronização de respostas
│   └── pdf_generator.py     # Gerador de PDF
└── static/                   # Frontend React (build)
```

## Modelos de Dados

### Patient (Paciente)
```python
- id (interno)
- public_id (UUID)
- nome (obrigatório)
- cpf (opcional)
- data_nascimento (opcional)
```

### Medicine (Medicamento)
```python
- id (interno)
- public_id (UUID)  
- denominacao_generica (nome)
- concentracao (dosagem)
- apresentacao (forma farmacêutica)
```

### Prescription (Receita)
```python
- id (interno)
- public_id (UUID)
- patient_id (FK)
- data
- medicamentos_json (lista serializada)
- observacoes
```

## API Endpoints

### Pacientes
- `GET /api/patients` - Listar todos
- `GET /api/patients/<id>` - Buscar por ID
- `POST /api/patients` - Criar novo
- `PUT /api/patients/<id>` - Atualizar
- `DELETE /api/patients/<id>` - Excluir
- `GET /api/patients/search?q=<query>` - Buscar por nome/CPF

### Medicamentos
- `GET /api/medicines` - Listar todos
- `GET /api/medicines/<id>` - Buscar por ID
- `POST /api/medicines` - Criar novo
- `PUT /api/medicines/<id>` - Atualizar
- `DELETE /api/medicines/<id>` - Excluir
- `GET /api/medicines/search?q=<query>` - Buscar por nome

### Receitas
- `GET /api/prescriptions` - Listar todas
- `GET /api/prescriptions?patient_id=<id>` - Por paciente
- `GET /api/prescriptions/<id>` - Buscar por ID
- `POST /api/prescriptions` - Criar nova
- `DELETE /api/prescriptions/<id>` - Excluir

### PDF
- `GET /api/pdf/prescription/<id>` - Gerar PDF da receita

## Inicialização

### Automática (Windows)
```batch
# Execute o arquivo
Iniciar_SisMed.bat
```

### Manual
```bash
# 1. Criar ambiente virtual
python -m venv venv

# 2. Ativar ambiente
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 3. Instalar dependências
pip install -r requirements.txt

# 4. Popular banco com medicamentos padrão
python seed.py

# 5. Iniciar servidor
python app.py
```

### Acessar Sistema
- **URL**: http://localhost:5001
- **Porta**: 5001
- **Frontend**: Servido automaticamente pelo Flask

## Funcionalidades Implementadas

### ✅ CRUD Completo
- Pacientes (simplificado: nome, CPF, nascimento)
- Medicamentos (36 medicamentos padrão do SUS)
- Receitas médicas

### ✅ Geração de PDF
- Layout oficial com logo da Prefeitura
- Dados do paciente e medicamentos
- Posologia detalhada
- Espaço para assinatura
- Download automático

### ✅ Integração Frontend
- API JavaScript para comunicação
- Adaptador de storage para transição suave
- Mantém compatibilidade com código React existente

### ✅ Configuração Automática
- Script .bat para Windows
- Ambiente virtual automatizado
- População inicial de dados
- Abertura automática no navegador

## Próximos Passos

1. **Fazer build do React**: `npm run build` no projeto frontend
2. **Copiar build** para `backend/static/`
3. **Executar** `Iniciar_SisMed.bat`
4. **Testar** funcionalidades completas
5. **Distribuir** para usuários finais

## Requisitos do Sistema

- **Python 3.8+**
- **Windows** (script .bat otimizado)
- **4GB RAM** mínimo
- **100MB** espaço em disco

---

**SisMed Perobal v9.0** - Sistema 100% Local e Offline  
*Prefeitura Municipal de Perobal - 2024*
