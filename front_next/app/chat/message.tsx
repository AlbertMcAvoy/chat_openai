'use client';

import {useEffect, useState} from "react";
import {Socket} from "socket.io-client";

export interface IMessage {
    id: string;
    content: string;
    timeSent: string;
    username: string;
}

export interface Props {
    username: string;
    message: IMessage;
    socket: Socket;
    language: string;
    id: number;
}

const message = ( { username, message, socket, language, id }: Props) => {

    const [traduction, setTraduction] = useState('');

    const [isSelected, setIsSelected] = useState(false);

    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        socket.on('chat-traduction', (data: any) => {
            if (data.id === id) {
                setTraduction(data.msg);
            }
        });

        socket.on('chat-verified', (data: any) => {
            data.responses.forEach((d: any) => {
                if (d.question === id) {
                    setIsVerified(d.response);
                }
            })
        });
    }, []);

    const traduct = (msg: string) => {
        socket.emit('chat-traduction', { msg, language, id });
    }

    const getBorderColor = () => {
        if (isSelected) {
            if (isVerified) {
                return 'border-green-500';
            }

            return 'border-red-500';
        } else {
            if (message.username === username) {
                return 'border-blue-300';
            } else {
                return 'border-purple-300';
            }
        }
    }

    const selectMessage = (ev: any, msg: string) => {

        if (ev.target.type !== 'button') {
            let reverseSelected = !isSelected;
            setIsSelected(reverseSelected);
            socket.emit('chat-select-message', {msg, isSelected: reverseSelected, id});
        }
    }

    return (
        <div className={`flex flex-col p-2 w-fit ${message.username === username ? 'bg-blue-300': 'bg-purple-300'} border border-1 ${getBorderColor()}`}
            onClick={(ev) => selectMessage(ev, message.content)}>
            <h1> {traduction == '' ? message.content : traduction} </h1>
            <small className="self-end text-red-700"> {message.username} </small>
            <p className="self-end text-xs text-slate-600"> {message.timeSent} </p>
            <button type="button" className="self-end text-xs text-black-700" onClick={() => { traduct(traduction == '' ? message.content : traduction) }}> Traduire </button>
        </div>
    );
}

export default message;