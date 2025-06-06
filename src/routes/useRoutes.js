const express = require('express');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const { jsPDF } = require('jspdf');

module.exports = (pool) => {
  const router = express.Router();

  // Configurações
  const DATA_DIR = path.join(__dirname, '../../data');

  // Determinar o prefixo com base no ambiente
  const isProduction = process.env.NODE_ENV === 'production';
  const BASE_PATH = isProduction ? '/forms/declaracoes' : '';

  // Middleware para verificar o prefixo em produção
  router.use((req, res, next) => {
    console.log(`[DEBUG] URL requisitada: ${req.originalUrl}, isProduction: ${isProduction}`);
    if (isProduction && req.originalUrl !== BASE_PATH && !req.originalUrl.startsWith(`${BASE_PATH}/`)) {
      console.log(`[DEBUG] Redirecionando para ${BASE_PATH}/ porque a URL não começa com ${BASE_PATH}/`);
      return res.redirect(`${BASE_PATH}/`);
    }
    next();
  });

  // Rota Principal
  router.get(`${BASE_PATH}/`, (req, res) => {
    console.log(`[DEBUG] Acessando rota principal: ${BASE_PATH}/`);
    res.render('escolherFormulario', {
      user: req.session.user || null,
      error: req.query.error,
      success: req.query.success,
      basePath: BASE_PATH
    });
  });

  // Processar Seleção de Formulário
  router.post(`${BASE_PATH}/selecionar-formulario`, (req, res) => {
    const { tipoFormulario } = req.body;
    console.log(`[DEBUG] Formulário selecionado: ${tipoFormulario}`);

    if (!tipoFormulario) {
      console.log('[DEBUG] Erro: Nenhum formulário selecionado');
      return res.redirect(`${BASE_PATH}/?error=Selecione um formulário`);
    }

    const form = FORMULARIOS.find(f => f.path === tipoFormulario);

    if (!form) {
      console.log('[DEBUG] Erro: Formulário inválido');
      return res.redirect(`${BASE_PATH}/?error=Formulário inválido`);
    }

    console.log(`[DEBUG] Redirecionando para: ${BASE_PATH}/${form.path}`);
    res.redirect(`${BASE_PATH}/${form.path}`);
  });

  // Lista de Formulários
  const FORMULARIOS = [
    { path: 'formulario-documentacoes', template: 'Formulario_Documentacoes', title: 'Documentações' },
    { path: 'formulario-convenio', template: 'Formulario_convenio', title: 'Convênio' },
    { path: 'ficha-frequencia', template: 'Ficha_Frequencia', title: 'Ficha de Frequência' },
    { path: 'formulario-dirigente', template: 'formulario-dirigente', title: 'Dirigente' },
    { path: 'ficha-rtma', template: 'Ficha_RTMA', title: 'RTMA' },
    { path: 'formulario-principal', template: 'Formulario', title: 'Formulário Principal' },
    { path: 'precificacao-form', template: 'precificacaoForm', title: 'Formulário de Precificação' },
    { path: 'Formulario-merito', template: 'Formulario-merito', title: 'Formulário de Mérito' }
  ];

  // Rotas dos Formulários
  FORMULARIOS.forEach(form => {
    router.get(`${BASE_PATH}/${form.path}`, (req, res) => {
      console.log(`[DEBUG] Acessando formulário: ${form.path}`);
      res.render(form.template, {
        title: form.title,
        error: req.query.error,
        success: req.query.success,
        basePath: BASE_PATH
      });
    });
  });

  router.get(`${BASE_PATH}/precificacao`, (req, res) => {
    console.log(`[DEBUG] Acessando precificação com valor: ${req.query.valor}`);
    try {
      if (!req.query.valor) {
        console.log('[DEBUG] Erro: Valor não informado');
        return res.redirect(`${BASE_PATH}/?error=Valor não informado`);
      }

      const valor = parseFloat(req.query.valor);
      if (isNaN(valor) || valor <= 0) {
        console.log('[DEBUG] Erro: Valor inválido');
        return res.redirect(`${BASE_PATH}/?error=Valor inválido`);
      }

      console.log('[DEBUG] Erro: Funcionalidade de precificação desativada');
      res.redirect(`${BASE_PATH}/?error=Funcionalidade de precificação desativada (dependência de planilha removida)`);
    } catch (error) {
      console.error('[DEBUG] Erro na precificação:', error);
      res.redirect(`${BASE_PATH}/?error=Erro ao processar precificação`);
    }
  });

  // Gerar PDF do Formulário de Mérito
  router.post(`${BASE_PATH}/gerar-pdf-merito`, (req, res) => {
    console.log('[DEBUG] Gerando PDF do formulário de mérito');
    try {
      const formData = req.body;
      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.setTextColor(0, 48, 135);
      doc.text('MINISTÉRIO DO ESPORTE', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text('FORMULÁRIO DE MÉRITO', 105, 25, { align: 'center' });
      doc.setDrawColor(0, 48, 135);
      doc.line(15, 28, 195, 28);

      const sections = [
        { title: '4.1 ESTRUTURA DAS AULAS', content: formData.estruturaAulas || 'Não informado' },
        { title: '4.2 METODOLOGIA DE ENSINO', content: formData.metodologiaEnsino || 'Não informado' },
        { title: '4.3 DETALHAMENTO DAS MODALIDADES', content: formData.detalhamentoModalidades || 'Não informado' },
        { title: '4.4 AVALIAÇÃO E PROGRESSO', content: formData.avaliacaoProgresso || 'Não informado' },
        { title: '4.5 ACOMPANHAMENTO E MONITORAMENTO', content: formData.acompanhamento || 'Não informado' },
        { title: '4.6 CONCLUSÃO', content: formData.conclusao || 'Não informado' }
      ];

      let currentY = 40;
      sections.forEach(section => {
        doc.setFontSize(12);
        doc.text(section.title, 15, currentY);
        currentY += 8;
        doc.setFontSize(10);
        const splitText = doc.splitTextToSize(section.content, 180);
        doc.text(splitText, 20, currentY);
        currentY += splitText.length * 7 + 10;
      });

      const date = new Date();
      const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
      doc.text(`Estado/UF, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`, 105, 280, { align: 'center' });
      doc.text("NOME DO REPRESENTANTE LEGAL DA ENTIDADE", 105, 285, { align: 'center' });
      doc.text("Dirigente", 105, 290, { align: 'center' });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=Formulario_Merito.pdf');
      res.send(doc.output());
    } catch (error) {
      console.error('[DEBUG] Erro ao gerar PDF:', error);
      res.status(500).send('Erro ao gerar PDF');
    }
  });

  // Rota de Erro 404
  router.use((req, res) => {
    console.log(`[DEBUG] Rota não encontrada: ${req.originalUrl}`);
    res.status(404).render('error', {
      message: 'Página não encontrada',
      errorCode: 404,
      basePath: BASE_PATH
    });
  });

  // Exportação corrigida
  return router;
};