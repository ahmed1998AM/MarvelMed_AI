import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import aiService from '../services/aiService';
import { FiSend, FiMic, FiMicOff, FiPaperclip, FiX } from 'react-icons/fi';

export default function ChatPage() {
  const { agentId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentAgent, setCurrentAgent] = useState(agentId || 'general');
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (agentId) setCurrentAgent(agentId);
  }, [agentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() && selectedFiles.length === 0) return;

    const userMessage = { role: 'user', content: input, files: selectedFiles, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response;
      if (selectedFiles.length > 0) {
        const file = selectedFiles[0];
        if (file.type.startsWith('image/')) {
          response = await aiService.analyzeImage(file, currentAgent);
        } else {
          response = await aiService.analyzeDocument(file, currentAgent);
        }
      } else {
        const history = messages.map(m => ({ role: m.role, content: m.content }));
        response = await aiService.chatWithAgent(currentAgent, input, history);
      }

      const aiMessage = { role: 'assistant', content: response.response, agent: response.agent, timestamp: response.timestamp };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { role: 'assistant', content: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.', isError: true, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setSelectedFiles([]);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'ar-EG';
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => prev + ' ' + transcript);
        };

        recognitionRef.current.onerror = () => setIsRecording(false);
        recognitionRef.current.onend = () => setIsRecording(false);
        recognitionRef.current.start();
        setIsRecording(true);
      } else {
        alert('المتصفح لا يدعم التعرف على الصوت');
      }
    }
  };

  const agents = aiService.getAvailableAgents();

  return (
    <div className="main-content" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Agent Selector */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', overflowX: 'auto', padding: '8px 0' }}>
        {agents.map((agent) => (
          <button
            key={agent.name}
            onClick={() => setCurrentAgent(agent.name)}
            style={{
              padding: '8px 16px',
              border: currentAgent === agent.name ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
              background: currentAgent === agent.name ? 'rgba(0, 184, 148, 0.1)' : 'white',
              borderRadius: '20px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontWeight: currentAgent === agent.name ? '600' : '400',
              color: currentAgent === agent.name ? 'var(--primary-color)' : 'var(--text-secondary)',
            }}
          >
            {agent.name}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px', padding: '16px', background: 'white', borderRadius: 'var(--radius-lg)' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-light)' }}>
            <h3 style={{ marginBottom: '12px' }}>ابدأ محادثتك مع {aiService.getAgentById(currentAgent)?.name}</h3>
            <p>يمكنك رفع صور الأشعة، التحاليل، أو أي مستندات طبية للتحليل</p>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '16px',
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              background: msg.role === 'user' ? 'var(--primary-color)' : 'var(--bg-secondary)',
              color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
            }}>
              {msg.files && msg.files.map((file, i) => (
                <div key={i} style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.9 }}>📎 {file.name}</div>
              ))}
              <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
              <span style={{ fontSize: '12px', opacity: 0.7, marginTop: '8px', display: 'block' }}>
                {new Date(msg.timestamp).toLocaleTimeString('ar-EG')}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)' }}>
              <div className="loading-spinner" style={{ width: '24px', height: '24px' }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="card" style={{ padding: '16px' }}>
        {selectedFiles.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {selectedFiles.map((file, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '14px' }}>📎 {file.name}</span>
                <button onClick={() => removeFile(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-color)' }}><FiX /></button>
              </div>
            ))}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ cursor: 'pointer', padding: '8px', color: 'var(--text-secondary)' }}>
            <FiPaperclip size={20} />
            <input type="file" onChange={handleFileSelect} style={{ display: 'none' }} accept="image/*,.pdf,.doc,.docx,.txt" multiple />
          </label>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب رسالتك هنا..."
            style={{ flex: 1, padding: '12px 16px', border: '2px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit' }}
          />
          
          <button onClick={toggleRecording} style={{ padding: '8px', background: isRecording ? 'var(--danger-color)' : 'var(--bg-secondary)', border: 'none', borderRadius: '50%', cursor: 'pointer', color: isRecording ? 'white' : 'var(--text-secondary)' }}>
            {isRecording ? <FiMicOff size={20} /> : <FiMic size={20} />}
          </button>
          
          <button onClick={handleSend} disabled={isLoading || (!input.trim() && selectedFiles.length === 0)} className="btn btn-primary" style={{ padding: '12px 24px' }}>
            <FiSend /> إرسال
          </button>
        </div>
      </div>
    </div>
  );
}
