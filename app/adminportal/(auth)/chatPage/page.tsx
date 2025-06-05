'use client';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8080', { autoConnect: false });

type Message = {
    text: string;
    sender: 'user' | 'admin';
    timestamp: string;
};

export default function AdminChatPanel() {
    const [users, setUsers] = useState<string[]>([]);         // list of emails
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // 1️⃣ Load user list (replace with real API)
    useEffect(() => {
        fetch('http://localhost:8080/admin/chats')
            .then((res) => res.json())
            .then((chats: { userEmail: string }[]) => {
                setUsers(chats.map((c) => c.userEmail));
            });
    }, []);

    // 2️⃣ When admin selects a user
    useEffect(() => {
        if (!selectedUser) return;

        // load chat history
        fetch(`http://localhost:8080/chat/messages/${selectedUser}`)
            .then((res) => res.json())
            .then((data: Message[]) => {
                setMessages(data);
                setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
            });

        socket.connect();
        socket.emit('join', selectedUser);

        socket.on('receive_message', (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
            setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
        });

        return () => {
            socket.off('receive_message');
            socket.disconnect();
            setMessages([]);
        };
    }, [selectedUser]);

    const sendReply = () => {
        if (!input.trim()) return;
        socket.emit('send_message', {
            email: selectedUser,
            text: input,
            sender: 'admin',
        });
        setInput('');
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Heading */}
            <header className="bg-red-600 p-4">
                <h1 className="text-2xl font-bold text-orange-100 text-center">
                    WWAH Admin
                </h1>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Users */}
                <aside className="w-1/4 bg-orange-50 p-4 space-y-2 border-r border-red-200 overflow-y-auto">
                    <h2 className="text-lg font-semibold text-red-700 mb-4">Students</h2>
                    {users.map((email) => (
                        <button
                            key={email}
                            onClick={() => setSelectedUser(email)}
                            className={`block w-full text-left px-4 py-2 rounded-lg hover:bg-orange-100 transition ${selectedUser === email
                                ? 'bg-red-200 text-red-900'
                                : 'text-red-700'
                                }`}
                        >
                            {email}
                        </button>
                    ))}
                </aside>

                {/* Main Chat Area */}
                <section className="flex-1 flex flex-col bg-orange-50">
                    {/* Chat history */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                        {selectedUser ? (
                            messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'
                                        }`}
                                >
                                    <div
                                        className={`px-4 py-2 rounded-xl inline-block max-w-[70%] break-words ${msg.sender === 'admin'
                                            ? 'bg-red-100 text-red-900'
                                            : 'bg-orange-200 text-orange-900'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                    <span className="text-xs text-red-600 mt-1">
                                        {msg.sender === 'admin' ? 'Admin' : 'User'},{' '}
                                        {new Date(msg.timestamp).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-red-600 mt-10">
                                Select a user to chat
                            </p>
                        )}
                        <div ref={scrollRef} />
                    </div>

                    {/* Message input */}
                    {selectedUser && (
                        <div className="p-4 border-t border-red-200 flex items-center gap-2 bg-orange-50">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendReply()}
                                className="flex-1 border border-red-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                                placeholder="Type your reply..."
                            />
                            <button
                                onClick={sendReply}
                                className="bg-red-600 text-orange-100 px-4 py-2 rounded-full hover:bg-red-700 transition"
                            >
                                Send
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
