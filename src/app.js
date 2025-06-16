const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const fs = require('fs').promises;

// Configurações básicas
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const dataFile = path.join(__dirname, '../data.json');

// Funções de gerenciamento de dados
async function loadData() {
  try {
    const data = await fs.readFile(dataFile, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.log('🔄 Inicializando arquivo de dados...');
    const initialData = { users: [] };
    await fs.writeFile(dataFile, JSON.stringify(initialData, null, 2));
    return initialData;
  }
}

async function saveData(data) {
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

// Configuração da aplicação
async function configurarApp() {
  const app = express();
  let data = await loadData();

  // Configuração da view engine (EJS)
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  // Middlewares essenciais
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(express.static(path.join(__dirname, '../public')));
  app.use('/forms/declaracoes/public', express.static(path.join(__dirname, '../public')));

  // Configuração de sessão segura
  app.use(session({
    secret: process.env.SESSION_SECRET || 'segredo-desenvolvimento',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
  }));

  // API de consulta de CNPJ
  app.get("/api/cnpj/:cnpj", async (req, res) => {
    const { cnpj } = req.params;
    try {
      const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`);
      const data = await response.json();
      res.json(data);
    } catch (err) {
      res.redirect('/forms/declaracoes'); // Redireciona para a rota base
    }
  });

  // Middleware de log de requisições
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  // Rota raiz redireciona para forms/declaracoes
  app.get('/', (req, res) => {
    res.redirect('/forms/declaracoes');
  });

  // Rotas principais
  const useRoutes = require('./routes/useRoutes');
  app.use('/forms/declaracoes', useRoutes({ data, saveData }));

  // Handler para rotas não encontradas
  app.use((req, res) => {
    res.redirect('/forms/declaracoes');
  });

  // Handler de erros
  app.use((err, req, res, next) => {
    console.error('💥 Erro:', err.stack);
    res.redirect('/forms/declaracoes');
  });

  return app;
}

// Iniciação do servidor
async function iniciarServidor() {
  try {
    const app = await configurarApp();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🔗 Acesse: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Falha ao iniciar o servidor:', err);
    process.exit(1);
  }
}

iniciarServidor();

process.on('unhandledRejection', (err) => {
  console.error('⚠️ Erro não tratado:', err);
});