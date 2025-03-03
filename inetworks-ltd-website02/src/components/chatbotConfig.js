import { createChatBotMessage } from 'react-chatbot-kit';

const config = {
  initialMessages: [
    createChatBotMessage('Hello! How can I assist you today?', {
      withAvatar: true,
      delay: 500,
    }),
  ],
  botName: 'iNetBot',
  customStyles: {
    botMessageBox: { backgroundColor: '#007bff' },
    chatButton: { backgroundColor: '#007bff' },
  },
};

export default config;