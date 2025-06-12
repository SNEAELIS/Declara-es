const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const fs = require('fs').promises;

// Configurações básicas
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const dataFile = path.join(__dirname, '../data.json');

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

async function configurarApp() {
  const app = express();
  let data = await loadData();

  // Middlewares essenciais
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  // Configuração de sessão segura para produção
  app.use(session({
    secret: process.env.SESSION_SECRET || 'segredo-desenvolvimento',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    }
  }));

  // BACK-END (exemplo com Express.js)
app.get("/api/cnpj/:cnpj", async (req, res) => {
  const { cnpj } = req.params;
  try {
    const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar CNPJ." });
  }
});


  // Configurações de views e arquivos estáticos
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static(path.join(__dirname, '../public')));

  // Depois: by Cleiton
  // app.use('/forms/declaracoes', express.static(path.join(__dirname, '../public')));
  // ------------------
const publicPath = path.join(__dirname, 'public');

// Substitua esta linha:
app.use(express.static(path.join(__dirname, '../public')));

// Por isto:
app.use('/public', express.static(publicPath, {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Adicione esta rota para evitar erro do favicon
app.get('/favicon.ico', (req, res) => res.status(204).end());
  // Rotas
  const useRoutes = require('./routes/useRoutes');
  app.use('/', useRoutes({ data, saveData })); // Passe os dados e função de salvar

  // Middleware de log de requisições
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  // Handlers de erro
  app.use((req, res) => {
    res.status(404).render('error', {
      message: 'Página não encontrada',
      errorCode: 404
    });
  });

  app.use((err, req, res, next) => {
    console.error('💥 Erro:', err.stack);
    res.status(500).render('error', {
      message: 'Erro interno no servidor',
      errorCode: 500,
      stack: isProduction ? null : err.stack
    });
  });

  return app;
}

async function iniciarServidor() {
  try {
    const app = await configurarApp();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      if (process.env.RENDER) {
        console.log(`🔗 Acesse: ${process.env.RENDER_EXTERNAL_URL}`);
      } else {
        console.log(`🔗 Acesse: http://localhost:${PORT}`);
      }
    });

  } catch (err) {
    console.error('❌ Falha catastrófica ao iniciar o servidor:');
    console.error(err);
    process.exit(1);
  }
}

// Inicia a aplicação
iniciarServidor();

process.on('unhandledRejection', (err) => {
  console.error('⚠️ Erro não tratado:', err);
});