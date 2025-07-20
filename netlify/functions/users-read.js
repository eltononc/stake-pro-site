// netlify/functions/users-read.js
const fs = require('fs');
const path = require('path');
const dbPath = path.resolve(__dirname, 'users-db.json');

exports.handler = async () => {
    try {
        const users = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        // Remove a senha antes de enviar para o frontend
        const safeUsers = users.map(({ password, ...user }) => user);
        return {
            statusCode: 200,
            body: JSON.stringify(safeUsers),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Falha ao ler usuários.' }) };
    }
};
