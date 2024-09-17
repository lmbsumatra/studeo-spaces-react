import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3002');

function App() {
    const [userId, setUserId] = useState('');
    const [recipientId, setRecipientId] = useState('');
    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState([]);

    useEffect(() => {
        // Handle receiving messages
        socket.on('receiveMessage', (data) => {
            setReceivedMessages((prevMessages) => [...prevMessages, data.message]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    const registerUser = () => {
        if (userId) {
            socket.emit('register', userId);
        }
    };

    const sendMessage = () => {
        if (recipientId && message) {
            socket.emit('sendMessage', { recipientId, message });
            setMessage('');
        }
    };

    return (
        <div>
            <h1>Socket.IO Messaging</h1>
            <div>
                <input
                    type="text"
                    placeholder="Your ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <button onClick={registerUser}>Register</button>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Recipient ID"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div>
                <h2>Received Messages</h2>
                <ul>
                    {receivedMessages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
