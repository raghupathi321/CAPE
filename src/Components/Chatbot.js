import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle, RefreshCw, Minimize2, Maximize2 } from 'lucide-react';

function Chatbot() {
    const [messages, setMessages] = useState([
        { id: 1, from: 'bot', text: 'Hello! I\'m here to help. What can I assist you with today?', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('connected');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when component mounts or is maximized
    useEffect(() => {
        if (!isMinimized && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isMinimized]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = {
            id: Date.now(),
            from: 'user',
            text: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        const currentInput = input.trim();
        setInput('');
        setIsLoading(true);
        setConnectionStatus('connecting');

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: currentInput })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const botMsg = {
                id: Date.now() + 1,
                from: 'bot',
                text: data.reply || 'I received your message but couldn\'t generate a response.',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMsg]);
            setConnectionStatus('connected');
        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg = {
                id: Date.now() + 1,
                from: 'bot',
                text: 'I\'m having trouble connecting right now. Please try again in a moment.',
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev => [...prev, errorMsg]);
            setConnectionStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([
            { id: 1, from: 'bot', text: 'Chat cleared! How can I help you?', timestamp: new Date() }
        ]);
        setConnectionStatus('connected');
    };

    const formatTime = (timestamp) => {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusColor = () => {
        switch (connectionStatus) {
            case 'connected': return 'bg-green-500';
            case 'connecting': return 'bg-yellow-500';
            case 'error': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    if (isMinimized) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setIsMinimized(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                >
                    <Bot size={24} />
                    {connectionStatus === 'error' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Bot size={20} />
                    <div>
                        <h3 className="font-semibold text-sm">Support Assistant</h3>
                        <div className="flex items-center space-x-1 text-xs opacity-90">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
                            <span className="capitalize">{connectionStatus}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={clearChat}
                        className="p-1 hover:bg-white/20 rounded transition-colors"
                        title="Clear chat"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={() => setIsMinimized(true)}
                        className="p-1 hover:bg-white/20 rounded transition-colors"
                        title="Minimize"
                    >
                        <Minimize2 size={16} />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.from === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-md'
                                    : msg.isError
                                        ? 'bg-red-100 text-red-800 border border-red-200 rounded-bl-md'
                                        : 'bg-white text-gray-800 shadow-sm border border-gray-200 rounded-bl-md'
                                }`}
                        >
                            <div className="flex items-start space-x-2">
                                {msg.from === 'bot' && (
                                    <div className={`flex-shrink-0 mt-0.5 ${msg.isError ? 'text-red-600' : 'text-blue-600'}`}>
                                        {msg.isError ? <AlertCircle size={16} /> : <Bot size={16} />}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                    <p className={`text-xs mt-1 opacity-70 ${msg.from === 'user' ? 'text-white' : 'text-gray-500'
                                        }`}>
                                        {formatTime(msg.timestamp)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-200 flex items-center space-x-2">
                            <Bot size={16} className="text-blue-600" />
                            <Loader2 size={16} className="animate-spin text-blue-600" />
                            <span className="text-sm text-gray-600">Typing...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-end space-x-2">
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Type your message..."
                            rows="1"
                            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            style={{
                                minHeight: '40px',
                                maxHeight: '120px',
                            }}
                            disabled={isLoading}
                        />
                        {input.trim() && (
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                                {input.length}/500
                            </div>
                        )}
                    </div>
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className={`p-2 rounded-xl transition-all duration-200 ${input.trim() && !isLoading
                                ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-lg'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        title="Send message (Enter)"
                    >
                        {isLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Send size={18} />
                        )}
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                    Press Enter to send • Shift+Enter for new line
                </p>
            </div>
        </div>
    );
}

export default Chatbot;