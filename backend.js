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

// Rota para listar todos os itens
app.get('/itens', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM itens;');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Erro ao buscar itens');
  }
});

// Rota para buscar um item pelo ID
app.get('/itens/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM itens WHERE id = $1;', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Erro ao buscar o item');
  }
});

// Rota para criar um novo item
app.post('/itens', async (req, res) => {
  try {
    const result = await pool.query('INSERT INTO itens(nome) VALUES($1) RETURNING *;', [req.body.nome]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Erro ao criar item');
  }
});

// Rota para atualizar um item existente
app.put('/itens/:id', async (req, res) => {
  try {
    const result = await pool.query('UPDATE itens SET nome = $1 WHERE id = $2 RETURNING *;', [req.body.nome, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Erro ao atualizar o item');
  }
});

// Rota para deletar um item
app.delete('/itens/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM itens WHERE id = $1 RETURNING *;', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Erro ao deletar o item');
  }
});

// Função para criar a tabela de itens no banco de dados
const criarTabelaItens = async () => {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS itens (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL
      );
    `;
    await pool.query(sql);
  } catch (err) {
    console.error('Erro ao criar a tabela "itens":', err);
  }
};

// Chama a função para criar a tabela quando o servidor inicia
criarTabelaItens();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
