import Message, {IMessage} from "@/app/chat/message";
import {Socket} from "socket.io-client";

export interface Props {
    messages: IMessage[];
    username: string;
    socket: Socket;
    language: string;
}

const messages = ({messages, username, socket, language}: Props) => {

    return (
        <div className="flex flex-col gap-1 bg-gray-200 p-3 w-full">
            {messages.map((msg: any, index: number) => (
                <div key={msg.timeSent} className={`${msg.username === username ? 'self-end': ''}`}>
                    <Message username={username} message={msg} socket={socket} language={language} id={index} />
                </div>
            ))}
        </div>
    )
}

export default messages;