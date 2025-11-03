// Importa as dependências
const express = require('express');
const cors = require('cors');
// Importa a função de inicialização do DB
const db = require('./db');

const app = express();

// CORREÇÃO CRÍTICA: Usa process.env.PORT fornecida pelo Render, ou 3000 como fallback local
const port = process.env.PORT || 3000; 

// Middlewares
app.use(cors()); // Permite requisições do seu app React Native
app.use(express.json()); // Habilita o Express a ler o corpo das requisições em formato JSON

// --- Rotas de API ---

// Rota de teste
app.get('/', (req, res) => {
    res.send('Servidor de Mídia Rodando! Bem-vindo ao Ivanovi Media API.');
});

// Rota para LISTAR todas as mídias (READ)
app.get('/api/midias', async (req, res) => {
    try {
        const midias = await db.getAllMidias();
        res.json(midias);
    } catch (error) {
        console.error("Erro ao buscar mídias:", error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para ADICIONAR uma nova mídia (CREATE)
app.post('/api/midias', async (req, res) => {
    const { titulo, artista, tipo, caminho_arquivo, capa_url } = req.body;

    // Validação básica
    if (!titulo || !tipo || !caminho_arquivo) {
        return res.status(400).json({ error: 'Os campos título, tipo e caminho_arquivo são obrigatórios.' });
    }

    try {
        // Assume que db.addMidia está definido e retorna o ID
        const id = await db.addMidia(titulo, artista, tipo, caminho_arquivo, capa_url || null);
        res.status(201).json({ id: id, message: 'Mídia adicionada com sucesso!' });
    } catch (error) {
        console.error("Erro ao adicionar mídia:", error);
        res.status(500).json({ error: 'Erro interno ao adicionar mídia.' });
    }
});

// Rota para DELETAR uma mídia (DELETE)
app.delete('/api/midias/:id', async (req, res) => {
    const { id } = req.params; // Captura o ID da URL

    try {
        // Assume que db.deleteMidia está definido e retorna o número de alterações
        const changes = await db.deleteMidia(id);

        if (changes === 0) {
            return res.status(404).json({ error: 'Mídia não encontrada.' });
        }

        res.json({ message: 'Mídia deletada com sucesso.' });
    } catch (error) {
        console.error(`Erro ao deletar mídia com ID ${id}:`, error);
        res.status(500).json({ error: 'Erro interno ao deletar mídia.' });
    }
});

// --- Inicialização do Servidor ---

// Inicializa o banco de dados e depois inicia o servidor
db.initDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`🚀 Servidor Express rodando na porta ${port}`);
            console.log(`Acesse: http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error("❌ Falha ao inicializar o banco de dados:", err);
    });
