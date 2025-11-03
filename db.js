const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

let db;

async function initDB() {
    db = await open({
        filename: './midias.db',
        driver: sqlite3.Database
    });

    console.log('✅ Conexão com SQLite estabelecida.');

    await db.exec(`
        CREATE TABLE IF NOT EXISTS midias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            artista TEXT,
            tipo TEXT CHECK(tipo IN ('musica', 'video')) NOT NULL,
            caminho_arquivo TEXT NOT NULL,
            capa_url TEXT
        );
    `);
    console.log('✅ Tabela "midias" verificada/criada.');
    
    const count = await db.get('SELECT COUNT(*) as count FROM midias');
    if (count.count === 0) {
        // --- 2 MÚSICAS DE TESTE (Links de áudio de demonstração, música instrumental neutra) ---
        await db.run(`INSERT INTO midias (titulo, artista, tipo, caminho_arquivo) VALUES (?, ?, ?, ?)`, 
            ['Música Instrumental #1', 'SoundHelix Demos', 'musica', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3']);
        await db.run(`INSERT INTO midias (titulo, artista, tipo, caminho_arquivo) VALUES (?, ?, ?, ?)`, 
            ['Música Instrumental #2', 'SoundHelix Demos', 'musica', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3']);

        // --- 2 VÍDEOS DE TESTE (Links de vídeo de demonstração, conteúdo neutro e apropriado) ---
        // Vídeo de Teste (720p - Curta Animação)
        await db.run(`INSERT INTO midias (titulo, artista, tipo, caminho_arquivo) VALUES (?, ?, ?, ?)`, 
            ['Vídeo de Teste 720p', 'Demo Content', 'video', 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4']);
        // Vídeo de Teste (480p - Curta Animação)
        await db.run(`INSERT INTO midias (titulo, artista, tipo, caminho_arquivo) VALUES (?, ?, ?, ?)`, 
            ['Vídeo de Teste 480p', 'Demo Content', 'video', 'https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4']);
        
        console.log('✅ Dados de demonstração (2 Músicas, 2 Vídeos) inseridos com sucesso.');
    }
}

// FUNÇÕES ADICIONADAS:

// Função para adicionar uma nova mídia
async function addMidia(titulo, artista, tipo, caminho_arquivo, capa_url) {
    const result = await db.run(
        `INSERT INTO midias (titulo, artista, tipo, caminho_arquivo, capa_url) VALUES (?, ?, ?, ?, ?)`,
        [titulo, artista, tipo, caminho_arquivo, capa_url]
    );
    return result.lastID; // Retorna o ID da nova mídia inserida
}

// Função para deletar uma mídia por ID
async function deleteMidia(id) {
    const result = await db.run('DELETE FROM midias WHERE id = ?', id);
    return result.changes; // Retorna o número de linhas deletadas
}

// FUNÇÃO EXISTENTE:
async function getAllMidias() {
    return db.all('SELECT * FROM midias');
}

module.exports = {
    initDB,
    getAllMidias,
    addMidia, // Exportando a nova função
    deleteMidia // Exportando a nova função
};
