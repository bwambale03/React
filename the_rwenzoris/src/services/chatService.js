import { useState } from 'react';

export const useChat = () => {
  const [messages, setMessages] = useState([]);

  const sendMessage = (message) => {
    setMessages((prev) => [...prev, { text: message, sender: 'user' }]);
    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: 'How can I assist you?', sender: 'bot' }]);
    }, 1000);
  };

  return { messages, sendMessage };
};