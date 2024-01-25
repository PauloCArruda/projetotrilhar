const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Configuração da conexão com o banco de dados PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db_pi3',
  password: '123',
  port: 5432,
});

const app = express();

// Middleware para analisar JSON e URL-encoded bodies
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota para listar todos os alunos
app.get('/alunos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alunos;');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Erro ao buscar alunos');
  }
});

// Rota para buscar um aluno pelo ID
app.get('/alunos/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alunos WHERE id = $1;', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Erro ao buscar o aluno');
  }
});

// Rota para criar um novo aluno
app.post('/alunos', async (req, res) => {
  try {
    const { nome, telefone, cpf, email } = req.body;

    // Validar campos obrigatórios
    if (!nome || !telefone || !cpf || !email) {
      return res.status(400).send('Todos os campos (nome, telefone, cpf, email) são obrigatórios.');
    }

    const result = await pool.query('INSERT INTO alunos(nome, telefone, cpf, email) VALUES($1, $2, $3, $4) RETURNING *;', [nome, telefone, cpf, email]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Erro ao criar aluno');
  }
});

// Rota para atualizar um aluno existente
app.put('/alunos/:id', async (req, res) => {
  try {
    const { nome, telefone, cpf, email } = req.body;

    // Validar campos obrigatórios
    if (!nome || !telefone || !cpf || !email) {
      return res.status(400).send('Todos os campos (nome, telefone, cpf, email) são obrigatórios.');
    }

    const result = await pool.query('UPDATE alunos SET nome = $1, telefone = $2, cpf = $3, email = $4 WHERE id = $5 RETURNING *;', [nome, telefone, cpf, email, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Erro ao atualizar o aluno');
  }
});

// Rota para deletar um aluno
app.delete('/alunos/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM alunos WHERE id = $1 RETURNING *;', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Erro ao deletar o aluno');
  }
});

// Função para criar a tabela de alunos no banco de dados
const criarTabelaAlunos = async () => {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS alunos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        telefone VARCHAR(20) NOT NULL,
        cpf VARCHAR(14) NOT NULL,
        email VARCHAR(255) NOT NULL
      );
    `;
    await pool.query(sql);
  } catch (err) {
    console.error('Erro ao criar a tabela "alunos":', err);
  }
};

// Chama a função para criar a tabela quando o servidor inicia
criarTabelaAlunos();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
