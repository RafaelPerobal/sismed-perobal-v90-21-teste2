
@echo off
title SisMed Perobal v9.0 - Inicializador
color 0A

echo.
echo ================================================
echo           SisMed Perobal v9.0
echo     Sistema de Receitas Medicas - Local
echo         Prefeitura Municipal de Perobal
echo ================================================
echo.

echo 🔍 Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERRO: Python nao encontrado!
    echo    Instale Python 3.8+ em https://python.org
    echo.
    pause
    exit /b 1
)

echo ✅ Python encontrado!
echo.

echo 🔧 Configurando ambiente virtual...
if not exist "venv\" (
    echo    Criando ambiente virtual...
    python -m venv venv
    if errorlevel 1 (
        echo ❌ ERRO ao criar ambiente virtual
        pause
        exit /b 1
    )
)

echo    Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo 📦 Instalando dependencias...
pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo ❌ ERRO ao instalar dependencias
    pause
    exit /b 1
)

echo 🌱 Inicializando banco de dados...
python seed.py
if errorlevel 1 (
    echo ❌ ERRO ao inicializar banco
    pause
    exit /b 1
)

echo.
echo ✅ Sistema configurado com sucesso!
echo.
echo 🚀 Iniciando servidor Flask...
echo    Acesse: http://localhost:5001
echo.
echo ⚠️  Para parar o servidor, pressione Ctrl+C
echo.

timeout /t 3 >nul
start http://localhost:5001

python app.py

echo.
echo 👋 SisMed Perobal encerrado.
pause
