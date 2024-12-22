import React, { useState } from 'react';
import './App.css';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true
});

function App() {  
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = { text: inputValue, sender: 'user' };
      setMessages([...messages, userMessage]);
      setInputValue('');

      // Call OpenAI API
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: inputValue }],
        });

        const botMessage = { text: response.choices[0].message.content.trim(), sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error calling OpenAI API:', error);
      }
    }
  };

  const handleClearMessage = () => {
    setMessages([]);
    setInputValue('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Open AI Chat Application</h1>
        <div className="chat-container">
          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                <img
                  src={message.sender === 'user' ? '/user-icon.png' : '/bot-icon.png'}
                  alt={`${message.sender} icon`}
                  className="icon"
                />
                <div className="message-text">{message.text}</div>
              </div>
            ))}
          </div>
          <div className='input-container'>
            <input
              className="App-input"
              type='text'
              name='gtText'
              value={inputValue}
              placeholder='Enter your prompt here...' 
              onChange={handleInputChange}/>
            <button onClick={handleSendMessage}>Send</button> 
            <button onClick={handleClearMessage}>Clear</button> 
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;