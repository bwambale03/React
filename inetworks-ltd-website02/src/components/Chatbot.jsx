import React, { useState } from 'react';
import { Chatbot } from 'react-chatbot-kit';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Chatbot.css';
import config from './chatbotConfig';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';

const ChatBotComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(config.initialMessages);

  const toggleChatbot = () => setIsOpen(!isOpen);

  // Custom fallback response handler
  const handleUserMessage = (message) => {
    const lowerCase = message.toLowerCase();
    let response = 'Sorry, I didn’t catch that. Try "help", "services", or "contact".';
    if (lowerCase.includes('help')) response = 'I’m here to assist! Ask about services or contact info.';
    else if (lowerCase.includes('services')) response = 'We offer Web, Mobile, and Desktop Development. Which one interests you?';
    else if (lowerCase.includes('contact')) response = 'Email: info@inetworks.com, Phone: +1-555-123-4567';

    const botMessage = { message: response, sender: 'bot', timestamp: new Date().getTime() };
    setMessages((prev) => [...prev, { message, sender: 'user' }, botMessage]);
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={toggleChatbot}>
        {isOpen ? 'Close' : 'Chat with Us'}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-wrapper"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3 }}
          >
            <Chatbot
              config={{
                ...config,
                initialMessages: messages, // Use local state
                state: { messages }, // Pass state
                customComponents: {
                  userChatMessage: (props) => (
                    <div className="react-chatbot-kit-user-chat-message">
                      {props.message}
                    </div>
                  ),
                  botChatMessage: (props) => (
                    <div className="react-chatbot-kit-chat-bot-message">
                      {props.message}
                    </div>
                  ),
                },
              }}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
              headerText="iNetworks Support Bot"
              placeholderText="Type your question..."
              handleUserMessage={handleUserMessage} // Custom handler
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBotComponent;