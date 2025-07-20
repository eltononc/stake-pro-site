// netlify/functions/login.js
const fs = require('fs');
const path = require('path');

// Caminho para o arquivo do banco de dados
const dbPath = path.resolve(__dirname, 'users-db.json');

// Função para criar um token (inseguro, apenas para demonstração)
const createToken = (payload) => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = 'insecure-signature'; 
    return `${encodedHeader}.${encodedPayload}.${signature}`;
};

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { email, password } = JSON.parse(event.body);
        const users = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            const tokenPayload = { userId: user.id, name: user.name, email: user.email };
            const token = createToken(tokenPayload);
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, token }),
            };
        } else {
            return {
                statusCode: 401,
                body: JSON.stringify({ success: false, message: 'Credenciais inválidas.' }),
            };
        }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ message: 'Erro no servidor.', error: error.message }) };
    }
};
