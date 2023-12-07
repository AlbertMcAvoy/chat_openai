'use client';
import {useEffect, useRef, useState} from "react";
import {io, Socket} from 'socket.io-client';
import Messages from "@/app/chat/messages";
import SendMessage from "@/app/chat/sendMessage";
import Username from "@/app/chat/username";
import Traduction from "@/app/chat/traduction";
import {IMessage} from "@/app/chat/message";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;

const socket = io('http://localhost:3001');
let loaded = false;

const Chat = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);

    const [username, setUsername] = useState('');

    const [language, setLanguage] = useState('');
    
    const [suggestions, setSuggestions] = useState([]);


    useEffect(() => {
        socket.emit('chat-messages');
        socket.on('connect', () => {
            console.log('connected');
        });
        socket.on('chat-message', (data: any) => {
            setMessages((msg: any[]) => [...msg, data] as any);
            if (username !== '' && data.username !== username) {
                socket.emit('chat-suggestions', {msg: data.content, language})
            }
        });
        socket.on('chat-messages', (data: any) => {
            if (! loaded) {
                setMessages(data);
                loaded = true;
            }
        });
        socket.on('chat-suggestions', (data: any) => {
            setSuggestions(data.msg);
        });
    }, []);

    useEffect(() => {
        let cMsg = messages.slice(-1)[0];
        if (username !== '' && cMsg !== undefined && cMsg.username !== username) {
            socket.emit('chat-suggestions', {msg: cMsg.content, language})
        }
    }, [messages]);

    // debug
    const disconnectAll = () => {
        socket.emit('chat-disconnect-all');
    }

    return (
        <div className="flex mb-4">
            <div className="flex flex-col items-center w-full gap-5 mt-5">
                {/*debug*/}
                <button onClick={disconnectAll}
                    className="flex-shrink-0 border-transparent border-4 text-sm py-1 px-2 rounded bg-red-800 text-white"> Déconnecter tous les clients (pour react) </button>
                {/*debug*/}
                <h1> Chat </h1>
                <Username socket={socket} setUsername={setUsername} username={username} />
                <Traduction language={language} setLanguage={setLanguage} />
                <Messages messages={messages} username={username} socket={socket} language={language} />
                <SendMessage username={username} socket={socket} suggestions={suggestions} />
            </div>
        </div>
    );
}

export default Chat;