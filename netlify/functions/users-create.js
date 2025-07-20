// Importa os módulos necessários do Node.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// O caminho para o seu arquivo JSON que funciona como banco de dados
const dbPath = path.resolve(__dirname, 'users-db.json');

// A função principal do Netlify (handler)
exports.handler = async (event, context) => {
  // Permite apenas requisições do tipo POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405, // Method Not Allowed
      body: JSON.stringify({ message: 'Apenas o método POST é permitido' }),
    };
  }

  try {
    // Pega os dados do novo usuário enviados no corpo da requisição
    const newUser = JSON.parse(event.body);

    // Validação simples para garantir que os dados essenciais foram enviados
    if (!newUser.name || !newUser.email || !newUser.password) {
        return {
            statusCode: 400, // Bad Request
            body: JSON.stringify({ message: 'Nome, email e senha são obrigatórios.' }),
        };
    }

    // Lê o arquivo do banco de dados existente
    const dbRaw = fs.readFileSync(dbPath, 'utf-8');
    const users = JSON.parse(dbRaw);

    // Adiciona o novo usuário à lista, gerando um ID único
    const userToSave = {
      id: crypto.randomUUID(), // Gera um ID universalmente único
      name: newUser.name,
      email: newUser.email,
      password: newUser.password, // Em um app real, a senha deveria ser criptografada aqui!
      avatar: newUser.avatar || null, // Usa o avatar enviado ou define como nulo
    };

    users.push(userToSave);

    // Salva a lista atualizada de volta no arquivo JSON
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));

    // Retorna uma resposta de sucesso com os dados do usuário criado
    return {
      statusCode: 201, // Created
      body: JSON.stringify(userToSave),
    };

  } catch (error) {
    // Em caso de qualquer erro, retorna uma resposta de erro do servidor
    console.error('Erro ao criar usuário:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ocorreu um erro interno no servidor.' }),
    };
  }
};
