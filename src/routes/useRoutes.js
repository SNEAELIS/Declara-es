const express = require('express');
const { jsPDF } = require('jspdf');

module.exports = ({ data, saveData }) => {
  const router = express.Router();
  const BASE_PATH = '/forms/declaracoes';

  // Lista de Formulários
  const FORMULARIOS = [
    { path: 'formulario-documentacoes', template: 'Formulario_Documentacoes', title: 'Documentações' },
    { path: 'formulario-convenio', template: 'Formulario_convenio', title: 'Convênio' },
    { path: 'ficha-frequencia', template: 'Ficha_Frequencia', title: 'Ficha de Frequência' },
        { path: 'formulario-dirigente', template: 'formulario-dirigente', title: 'DECLARAÇÕES ART 26, 27 DO DECRETO Nº 8.726' },
    { path: 'ficha-rtma', template: 'Ficha_RTMA', title: 'RTMA' },
    { path: 'formulario-principal', template: 'Formulario', title: 'Formulário Principal' },
    { path: 'precificacao-form', template: 'precificacaoForm', title: 'Formulário de Precificação' },
    { path: 'Formulario-merito', template: 'Formulario-merito', title: 'Formulário de Mérito' }
  ];

  // Helper function para construir URLs
  const buildUrl = (path = '') => `${BASE_PATH}${path ? `/${path}` : ''}`;

  // Rota Principal
  router.get('/', (req, res) => {
    res.render('escolherFormulario', {
      user: req.session.user || null,
      error: req.query.error,
      success: req.query.success,
      formularios: FORMULARIOS.map(form => ({
        ...form,
        fullPath: buildUrl(form.path)
      })),
      basePath: BASE_PATH
    });
  });

  // Processar Seleção de Formulário
  router.post('/selecionar-formulario', (req, res) => {
    const { tipoFormulario } = req.body;
    
    if (!tipoFormulario) {
      return res.redirect(`${BASE_PATH}/?error=Selecione um formulário`);
    }

    const form = FORMULARIOS.find(f => f.path === tipoFormulario);
    if (!form) {
      return res.redirect(`${BASE_PATH}/?error=Formulário inválido`);
    }

    res.redirect(`${BASE_PATH}/${form.path}`);
  });

  router.get('/formulario-dirigente', (req, res) => {
    console.log('Tentando renderizar formulario-dirigente.gis');
    res.render('formulario-dirigente', {
        title: 'DECLARAÇÕES ART 26, 27 DO DECRETO Nº 8.726',
        error: req.query.error,
        success: req.query.success,
        basePath: BASE_PATH
    }, (err, html) => {
        if (err) {
            console.error('Erro ao renderizar:', err);
            return res.redirect(`${BASE_PATH}/?error=Template não encontrado`);
        }
        res.send(html);
    });
});

  // Rotas dos Formulários
  FORMULARIOS.forEach(form => {
    router.get(`/${form.path}`, (req, res) => {
      // Verifica se o template existe antes de renderizar
      res.render(form.template, {
        title: form.title,
        error: req.query.error,
        success: req.query.success,
        basePath: BASE_PATH
      }, (err, html) => {
        if (err) {
          console.error(`Erro ao renderizar ${form.template}:`, err);
          return res.redirect(`${BASE_PATH}/?error=Template não encontrado`);
        }
        res.send(html);
      });
    });

    // Adiciona rota POST para cada formulário se necessário
    router.post(`/${form.path}`, (req, res) => {
      // Aqui você pode adicionar lógica para processar o formulário
      saveData(form.path, req.body)
        .then(() => res.redirect(`${BASE_PATH}/?success=Formulário enviado com sucesso`))
        .catch(err => {
          console.error(`Erro ao salvar ${form.path}:`, err);
          res.redirect(`${BASE_PATH}/${form.path}?error=Erro ao salvar formulário`);
        });
    });
  });

  // Gerar PDF do Formulário de Mérito
  router.post('/gerar-pdf-merito', (req, res) => {
    try {
      const formData = req.body;
      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text('FORMULÁRIO DE MÉRITO', 105, 20, { align: 'center' });
      doc.text(`Data: ${new Date().toLocaleDateString()}`, 15, 40);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=Formulario_Merito.pdf');
      res.send(doc.output());
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      res.redirect(`${BASE_PATH}/?error=Erro ao gerar PDF`);
    }
  });

  // Todas as rotas não encontradas
  router.use((req, res) => {
    res.redirect(BASE_PATH);
  });

  return router;
};