import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const API_URL = 'http://localhost:8000/api/chat';

// Simple markdown to HTML converter for bold, lists, and line breaks
function formatMessage(text) {
  if (!text) return '';
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // bold
    .replace(/\n/g, '<br/>') // line breaks
    .replace(/\d+\. /g, match => `<br/>${match}`); // numbered lists
  return html;
}

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'robo', text: 'Hi! I am ROBO, your Cryptocurrency assistant. Want to know about the latest news, price, and more?' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input })
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { sender: 'robo', text: data.response || 'Sorry, I could not get a response.' }]);
    } catch (e) {
      setMessages(msgs => [...msgs, { sender: 'robo', text: 'Error connecting to server.' }]);
    }
    setLoading(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {!open && (
        <button className="robo-chatbot-button" onClick={() => setOpen(true)} title="Chat with ROBO">
          🤖
        </button>
      )}
      {open && (
        <div className="robo-chatbot-popup">
          <div className="robo-chatbot-header">
            {/* No text, only close button */}
            <button className="robo-chatbot-close" onClick={() => setOpen(false)}>&times;</button>
          </div>
          <div className="robo-chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`robo-chatbot-msg ${msg.sender}`}
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="robo-chatbot-input-row">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Type your message..."
              disabled={loading}
              className="robo-chatbot-input"
            />
            <button onClick={handleSend} disabled={loading || !input.trim()} className="robo-chatbot-send">Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot; 