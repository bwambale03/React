class MessageParser {
    constructor(actionProvider) {
      this.actionProvider = actionProvider;
    }
  
    parse(message) {
      const lowerCase = message.toLowerCase();
      if (lowerCase.includes('help')) {
        this.actionProvider.handleHelp();
      } else if (lowerCase.includes('services')) {
        this.actionProvider.handleServices();
      } else if (lowerCase.includes('contact')) {
        this.actionProvider.handleContact();
      } else {
        this.actionProvider.handleDefault();
      }
    }
  }
  
  export default MessageParser;