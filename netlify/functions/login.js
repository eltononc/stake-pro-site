const fs = require('fs');
const path = require('path');

// Caminho para o ficheiro que serve como banco de dados
const dbPath = path.resolve(__dirname, 'users-db.json');

// Função segura para ler o banco de dados
const readDatabase = () => {
  try {
    // Se o ficheiro não existir, retorna uma lista vazia
    if (!fs.existsSync(dbPath)) {
      return [];
    }
    const dbRaw = fs.readFileSync(dbPath, 'utf-8');
    // Se o ficheiro estiver vazio, retorna uma lista vazia, senão, interpreta o JSON
    return dbRaw.trim() === '' ? [] : JSON.parse(dbRaw);
  } catch (error) {
    console.error("Erro ao ler o banco de dados, a retornar uma lista vazia.", error);
    return [];
  }
};

exports.handler = async (event, context) => {
  // Permite apenas requisições do tipo POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405, // Method Not Allowed
      body: JSON.stringify({ message: 'Apenas o método POST é permitido' }),
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    // Validação simples
    if (!email || !password) {
      return {
        statusCode: 400, // Bad Request
        body: JSON.stringify({ message: 'Email e senha são obrigatórios.' }),
      };
    }

    const users = readDatabase();

    // Procura por um usuário com o email e senha correspondentes
    const foundUser = users.find(user => user.email === email && user.password === password);

    if (foundUser) {
      // Usuário encontrado, retorna sucesso
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Login bem-sucedido!', user: { id: foundUser.id, name: foundUser.name, email: foundUser.email } }),
      };
    } else {
      // Usuário não encontrado ou senha incorreta
      return {
        statusCode: 401, // Unauthorized
        body: JSON.stringify({ message: 'Email ou senha inválidos.' }),
      };
    }
  } catch (error) {
    console.error('Erro no processo de login:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ocorreu um erro interno no servidor.' }),
    };
  }
};
