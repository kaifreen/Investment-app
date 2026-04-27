import { useState, useEffect, useRef } from 'react';
import './ChatBot.css';

function ChatBot({ token, riskLevel = 'moderate', investmentGoal = 'long-term growth' }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Investment Diversification Assistant. I can help you optimize your portfolio allocation, suggest investment tools, and personalize strategies based on your risk profile.\n\nAsk me anything about diversification, asset allocation, or investment strategies.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef(null);
  const API_URL = '/api';

  // Suggested quick questions
  const quickQuestions = [
    "How should I diversify my portfolio?",
    "What's the best allocation for my risk level?",
    "Should I invest in crypto?",
    "Explain stocks vs bonds vs ETFs"
  ];

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to backend
  const handleSendMessage = async (messageText = inputValue) => {
    if (!messageText.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      console.log('📤 Sending chat request to:', `${API_URL}/chat`);
      console.log('📤 Token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: messageText,
          riskLevel,
          investmentGoal
        })
      });

      console.log('📥 Response status:', response.status);
      const data = await response.json();
      console.log('📥 Response data:', data);

      if (response.ok && data.success) {
        // Add bot response with typing animation
        const botMessage = {
          id: Date.now() + 1,
          text: data.message,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Handle specific error messages
        let errorText = data.error || 'Failed to get response';
        
        // Check if it's an API key configuration issue
        const errorMessage = {
          id: Date.now() + 1,
          text: errorText,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered a network error while reaching the chat service. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chat Toggle Button */}
      {!showChat && (
        <button 
          className="chatbot-toggle"
          onClick={() => setShowChat(true)}
          title="Open Investment Assistant"
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {showChat && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="bot-icon">🤖</span>
              <div>
                <h3>Investment Assistant</h3>
                <p className="bot-status">Online</p>
              </div>
            </div>
            <button 
              className="close-btn"
              onClick={() => setShowChat(false)}
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`message ${msg.sender}-message`}
              >
                <div className="message-content">
                  {msg.sender === 'bot' && <span className="bot-avatar">🤖</span>}
                  <div className="message-text">
                    {msg.text.split('\n').map((line, idx) => (
                      <span key={idx}>
                        {line}
                        {idx < msg.text.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="message bot-message">
                <div className="message-content">
                  <span className="bot-avatar">🤖</span>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="quick-questions">
              <p className="section-label">Quick Questions:</p>
              <div className="questions-grid">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    className="quick-question-btn"
                    onClick={() => handleSendMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="chatbot-input-area">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about diversification, asset allocation, risk management..."
              rows="1"
              disabled={isLoading}
              className="chat-input"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputValue.trim()}
              className="send-btn"
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
