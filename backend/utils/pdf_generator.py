
"""
Gerador de PDF para receitas médicas
Layout baseado no modelo oficial de Perobal
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfgen import canvas
from io import BytesIO
import os
from models import Medicine
from config import Config

def generate_prescription_pdf(prescription):
    """
    Gera PDF da receita médica seguindo o modelo oficial
    """
    buffer = BytesIO()
    
    # Configurar documento
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=1.5*cm,
        bottomMargin=2*cm
    )
    
    # Estilos
    styles = getSampleStyleSheet()
    
    # Estilo personalizado para cabeçalho
    header_style = ParagraphStyle(
        'CustomHeader',
        parent=styles['Normal'],
        fontSize=14,
        fontName='Helvetica-Bold',
        alignment=TA_CENTER,
        spaceAfter=10
    )
    
    # Estilo para título
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Normal'],
        fontSize=18,
        fontName='Helvetica-Bold',
        alignment=TA_CENTER,
        spaceAfter=20
    )
    
    # Estilo para dados do paciente
    patient_style = ParagraphStyle(
        'PatientStyle',
        parent=styles['Normal'],
        fontSize=11,
        fontName='Helvetica',
        spaceAfter=6
    )
    
    # Estilo para medicamentos
    medicine_style = ParagraphStyle(
        'MedicineStyle',
        parent=styles['Normal'],
        fontSize=11,
        fontName='Helvetica',
        leftIndent=20,
        spaceAfter=12
    )
    
    # Conteúdo do PDF
    story = []
    
    # Cabeçalho com logo (se existir)
    logo_path = os.path.join(os.path.dirname(__file__), '..', 'static', 'logo_perobal.png')
    if os.path.exists(logo_path):
        try:
            logo = Image(logo_path, width=6*cm, height=3*cm)
            logo.hAlign = 'CENTER'
            story.append(logo)
            story.append(Spacer(1, 0.5*cm))
        except:
            pass  # Se não conseguir carregar a logo, continua sem ela
    
    # Cabeçalho texto
    story.append(Paragraph("PREFEITURA MUNICIPAL DE PEROBAL", header_style))
    story.append(Paragraph("SECRETARIA MUNICIPAL DE SAÚDE", header_style))
    story.append(Spacer(1, 0.5*cm))
    
    # Título
    story.append(Paragraph("RECEITUÁRIO MÉDICO", title_style))
    story.append(Spacer(1, 1*cm))
    
    # Dados do paciente em tabela
    patient_data = [
        ['Paciente:', prescription.patient.nome],
        ['CPF:', prescription.patient.cpf or 'NÃO INFORMADO'],
        ['Data Nascimento:', prescription.patient.data_nascimento.strftime('%d/%m/%Y') if prescription.patient.data_nascimento else 'NÃO INFORMADO'],
        ['Data:', prescription.data.strftime('%d/%m/%Y')],
    ]
    
    patient_table = Table(patient_data, colWidths=[3*cm, 12*cm])
    patient_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),  # Primeira coluna em negrito
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ]))
    
    story.append(patient_table)
    story.append(Spacer(1, 1*cm))
    
    # Medicamentos prescritos
    story.append(Paragraph("<b>MEDICAMENTOS PRESCRITOS:</b>", patient_style))
    story.append(Spacer(1, 0.5*cm))
    
    # Lista numerada de medicamentos
    medicamentos = prescription.get_medicamentos()
    for i, med_data in enumerate(medicamentos, 1):
        # Buscar dados do medicamento por public_id
        medicine = Medicine.query.filter_by(public_id=med_data['medicamentoId']).first()
        
        if medicine:
            medicine_text = f"{i}. <b>{medicine.denominacao_generica} - {medicine.concentracao} ({medicine.apresentacao})</b>"
            story.append(Paragraph(medicine_text, medicine_style))
            
            posology_text = f"   {med_data['posologia']}"
            story.append(Paragraph(posology_text, medicine_style))
            story.append(Spacer(1, 0.3*cm))
    
    # Observações se houver
    if prescription.observacoes:
        story.append(Spacer(1, 0.5*cm))
        story.append(Paragraph("<b>OBSERVAÇÕES:</b>", patient_style))
        story.append(Paragraph(prescription.observacoes, patient_style))
    
    # Espaço para assinatura
    story.append(Spacer(1, 2*cm))
    
    signature_data = [
        ['', ''],
        ['_' * 40, ''],
        ['Assinatura do Profissional', ''],
    ]
    
    signature_table = Table(signature_data, colWidths=[8*cm, 7*cm])
    signature_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    
    story.append(signature_table)
    
    # Rodapé
    story.append(Spacer(1, 1*cm))
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        fontName='Helvetica',
        alignment=TA_CENTER
    )
    story.append(Paragraph(Config.ORG_ADDRESS, footer_style))
    
    # Construir PDF
    doc.build(story)
    
    buffer.seek(0)
    return buffer
