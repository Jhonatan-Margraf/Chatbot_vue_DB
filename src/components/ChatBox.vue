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
      <input v-model="userInput" type="text" placeholder="Digite sua mensagem..." class="chat-input">
      <button @click="sendMessage" class="send-button">Enviar</button>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'ChatBox', // Corrigido para ChatBox
  data() {
    return {
      userInput: '',
      messages: []
    };
  },
  methods: {
    async sendMessage() {
      if (this.userInput.trim() !== '') {
        // Adiciona a mensagem do usuário à lista
        this.messages.push({ text: this.userInput, type: 'user-message' });
        this.userInput = ''; 

        try {
          const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: this.userInput })
          });

          const data = await response.json();
          const aiMessage = data.aiMessage;

          // Adiciona a resposta da IA à lista
          this.messages.push({ text: aiMessage, type: 'ai-message' });

          // Role para a última mensagem
          const chatBox = document.getElementById("chat-box");
          chatBox.scrollTop = chatBox.scrollHeight;
        } catch (error) {
          console.error("Erro ao enviar a mensagem:", error);
        }
      }
    }
  }
};
</script>

<style scoped>
/* Adicione aqui os estilos CSS do seu Chat.vue, se desejar */
</style>