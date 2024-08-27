const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const API_KEY = "AIzaSyCKE9Mq0SiUxY6U9bTQ2ZbcRKLiFqe_Wdk"; // Substitua pela sua chave de API do Google Gemini
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const PORT = process.env.PORT || 3000;

// Habilita CORS para permitir requisições de outros domínios
app.use(cors());
// Define o parser para JSON
app.use(bodyParser.json());

async function connectToDatabase() {
  const uri = "mongodb+srv://Jhonatan:99919228Jhonatan@chatbot.wdvj54i.mongodb.net/?retryWrites=true&w=majority&appName=chatbot"; // Substitua com sua string de conexão
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    console.log("Conectado ao MongoDB Atlas");
    return client.db("chatbot"); 
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB Atlas:", error);
    process.exit(1);
  }
}

// Rota para lidar com as requisições POST para /chat
app.post('/chat', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const conversasCollection = db.collection("conversas");

    const promptdousuario = req.body.prompt;
    var prompt = "chat, voce é um fisiculturista renomado, e todo e qualquer assunto deve ter relacao e levar o rumo da conversa para a area da academia, treino, dieta e fisiculturismo, voce so pode falar sobre fisiculturismo, apenas sobre isso, se eu te perguntar sobre carro, voce diz: carros sao otimos automoveis para ir para a academia"
    prompt = prompt + ". O usuario digitou o seguinte:" + promptdousuario;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const aiMessage = text;

    await conversasCollection.insertOne({
      usuario: promptdousuario,
      ia: aiMessage
    });

    res.json({
      aiMessage
    });

  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    res.status(500).json({ error: 'Erro ao processar a requisição' });
  }
});

// Define o diretório público
app.use(express.static(path.join(__dirname, 'public')));

// Define a rota para o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});