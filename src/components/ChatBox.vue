<template>
  <div class="chat-container">
    <header class="chat-header">
      <h1>Chat de IA sobre Fisiculturismo</h1>
    </header>
    <main class="chat-main">
      <div id="chat-box" class="chat-box">
        <div v-for="(message, index) in messages" :key="index" :class="message.type">
          {{ message.text }}
        </div>
      </div>
    </main>
    <footer class="chat-footer">
      <input v-model="promptdousuario" type="text" placeholder="Digite sua mensagem..." class="chat-input">
      <button @click="sendMessage" class="send-button">Enviar</button>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'ChatBox',
  data() {
    return {
      promptdousuario: '', // Alterado para promptdousuario
      messages: []
    };
  },
  methods: {
    async sendMessage() {
      if (this.promptdousuario.trim() !== '') {
        // Adiciona a mensagem do usuário à lista
        this.messages.push({ text: this.promptdousuario, type: 'user-message' });

        try {
          const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: this.promptdousuario }) // Envia promptdousuario
          });

          const data = await response.json();
          const aiMessage = data.aiMessage;

          // Adiciona a resposta da IA à lista
          this.messages.push({ text: aiMessage, type: 'ai-message' });

          // Role para a última mensagem
          const chatBox = document.getElementById("chat-box");
          chatBox.scrollTop = chatBox.scrollHeight;

          this.promptdousuario = ''; // Limpa promptdousuario após enviar
        } catch (error) {
          console.error("Erro ao enviar a mensagem:", error);
        }
      }
    }
  }
};
</script>
<style scoped>

:root {
  --amarelo-principal: #FFD700;
  --preto-principal: #363636;
}

body {
  font-family: 'Roboto Slab', serif;
  background-color: var(--preto-principal);
  color: white;
  margin: 0;
  align-items: center;
  min-height: 100vh;
  background-image: url("../assets/anonymous-hacker-data-breach-5k-6000x4004-7.jpg");
}

.chat-container {
  margin-top: 5vh;
  width: 80%;
  height: 90vh;
  max-width: 600px;
  background-color: #282828;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
}

.chat-header {
  background-color: var(--amarelo-principal);
  color: var(--preto-principal);
  padding: 15px;
  text-align: center;
}

.chat-main {
  padding: 33px;
  height: 400px;
  overflow-y: auto;
}

.chat-box {
  display: flex;
  flex-direction: column;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  max-width: 80%;
}

.user-message {
  background-color: #444444;
    align-self: flex-end;
    color: white;
    width: 41vw;
}

.ai-message {
  background-color: var(--amarelo-principal);
  color: var(--preto-principal);
  align-self: flex-start;
    color: antiquewhite;
    padding: 15px;
    border-radius: 2%;
    margin-right: 7vw;
    width: 43vw;
    margin-top: 2vh;
}

.chat-footer {
  display: flex;
  padding: 10px;
  background-color: #333333;
}

.chat-input {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
  background-color: #444444;
  color: white;
}

.send-button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: var(--amarelo-principal);
  color: var(--preto-principal);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.send-button:hover {
  background-color: #e0c100;
}

</style>