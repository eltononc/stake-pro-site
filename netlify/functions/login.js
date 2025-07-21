import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email e senha são obrigatórios.' }),
      };
    }

    // Cria uma consulta para encontrar um usuário com o email e senha correspondentes
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email), where("password", "==", password));
    
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Usuário encontrado
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Login bem-sucedido!', user: { id: userDoc.id, name: userData.name, email: userData.email } }),
      };
    } else {
      // Usuário não encontrado
      return {
        statusCode: 401,
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
