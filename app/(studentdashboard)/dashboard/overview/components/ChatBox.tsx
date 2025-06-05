'use client';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { X } from 'lucide-react';
const socket = io('http://localhost:8080', { autoConnect: false });

type Message = {
    text: string;
    sender: 'user' | 'admin';
    timestamp: string;
};

interface ChatModalProps {
    userEmail: {
        email: string;
    };
    onClose: () => void;
}
export default function ChatModal({ userEmail, onClose }: ChatModalProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!userEmail) return;
        console.log(userEmail, 'User email for chat');
        const mail = userEmail.email
        // fetch history
        fetch(`http://localhost:8080/chat/messages/${mail}`)
            .then((res) => res.json())
            .then((data: Message[]) => {
                setMessages(data);
                setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
            });

        socket.connect();
        socket.emit('join', userEmail);
        socket.on('receive_message', (msg: Message) => {
            console.log('Received message');
            setMessages(prev => [...prev, msg]);
            setTimeout(() =>
                scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
        });

        return () => {
            socket.off('receive_message');
            socket.disconnect();
            setMessages([]);
        };
    }, [userEmail]);

    const sendMessage = () => {
        if (!input.trim()) return;
        console.log('Sending message:', input);
        socket.emit('send_message', { email: userEmail, text: input, sender: 'user' });
        setInput('');
    };

    return (
        <div className="fixed bottom-0 right-0 h-[500px] w-full max-w-md p-4 z-50">
            <div className="relative bg-white rounded-2xl shadow-xl h-full flex flex-col overflow-hidden">

                {/* Close Icons */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-4 text-white z-20"
                    aria-label="Close chat"
                >
                    <X size={20} />
                </button>


                {/* Header */}
                <div className="bg-red-600 p-4">
                    <h2 className="text-xl font-bold text-orange-100 text-center">
                        WWAH Live Chat
                    </h2>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-orange-50">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                        >
                            <div
                                className={`px-4 py-2 rounded-xl inline-block max-w-[80%] break-words ${msg.sender === 'user'
                                    ? 'bg-orange-200 text-orange-900'
                                    : 'bg-red-100 text-red-900'
                                    }`}
                            >
                                <p className="text-sm">{msg.text}</p>
                            </div>
                            <span className="text-xs text-red-600 mt-1">
                                {msg.sender === 'user' ? 'You' : 'Admin'},{' '}
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-red-200 flex items-center gap-2 bg-white">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1 border border-red-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                        placeholder="Type your message..."
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-red-600 text-orange-100 rounded-full px-4 py-2 hover:bg-red-700 transition"
                    >
                        Send
                    </button>
                </div>

            </div>
        </div>
    );
}