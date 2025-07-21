// Importa as funções necessárias do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Configuração do Firebase lida a partir das variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Inicializa a aplicação Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

exports.handler = async (event, context) => {
  try {
    // Busca todos os documentos da coleção "users"
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);
    
    // Mapeia os documentos para um formato de array de objetos
    const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return {
      statusCode: 200,
      body: JSON.stringify(userList),
    };
  } catch (error) {
    console.error('Erro ao ler usuários:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ocorreu um erro interno ao ler os usuários.' }),
    };
  }
};
