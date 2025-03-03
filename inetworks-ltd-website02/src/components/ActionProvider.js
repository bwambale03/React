import { createChatBotMessage } from 'react-chatbot-kit';

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleHelp() {
    const message = this.createChatBotMessage('I’m here to assist! Ask about services, contact info, or anything else.');
    this.updateChatbotState(message);
  }

  handleServices() {
    const message = this.createChatBotMessage('We offer Web, Mobile, and Desktop Development. Which one interests you?');
    this.updateChatbotState(message);
  }

  handleContact() {
    const message = this.createChatBotMessage('Email us at info@inetworks.com or call +1-555-123-4567!');
    this.updateChatbotState(message);
  }

  handleDefault() {
    const message = this.createChatBotMessage('Sorry, I didn’t understand. Try "help", "services", or "contact".');
    this.updateChatbotState(message);
  }

  updateChatbotState(message) {
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  }
}

export default ActionProvider;