'use client';
import {useEffect, useState} from "react";
import {Socket} from "socket.io-client";

export interface Props {
    socket: Socket;
    username: string;
    suggestions: any[];
}

const SendMessage = ({socket, username, suggestions} : Props) => {

    const [text, setText] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        socket.on('chat-verified', () => {
            setIsLoading(false);
        });
    }, []);


    const sendMessage = (event: any, value: any) => {
        event.preventDefault();
        if (value === '') return;
        if (event.type === 'click' || event.type === 'submit' || event.type === 'keyup' && event.key == 'Enter') {
            if (username === '') {
                alert('Vous devez saisir un pseudo pour converser !');
                return;
            }
            socket.emit('chat-message', {
                content: value,
                username: username,
                timeSent: new Date().toISOString()
            });

            setText('');
        }
    }

    const verifyInformations = () => {
        setIsLoading(true);
        socket.emit('chat-verify');
    }

    const truncate = (input: string) => {
        return input?.length > 30 ? `${input.substring(0, 29)}...` : input;
    }


    const getButtonText = () => {
        return isLoading ? 'Vérification...' : 'Vérifier'
    }

    return (
        <div className="flex flex-col justify-center">
            <div className="flex flex-row gap-3">
                <form className="w-full max-w-sm"
                      onSubmit={(event) => {sendMessage(event, text)}}>
                    <div className="flex items-center border-b border-purple-500 py-2">
                        <input className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                               value={text}
                               placeholder="Votre message"
                               onChange={e => { setText(e.currentTarget.value); }}
                               type="text"
                               onKeyUp={(event) => {sendMessage(event, text)}}/>
                        <button type='submit'
                                className="flex-shrink-0 border-transparent border-4 text-purple-900 hover:text-purple-500 text-sm py-1 px-2 rounded"> Envoyer le message</button>
                    </div>
                </form>
                <div>
                    <button className="border-green-300 border-2 rounded p-2 hover:bg-green-300 hover:text-white hover:cursor-pointer"
                            onClick={() => verifyInformations()}> {getButtonText()} </button>
                </div>
            </div>
            <div className="flex flex-row justify-between gap-5 mt-5">
                {suggestions.map((sug: any, index: number) => (
                    <div key={index} className="border-slate-500 border-2 rounded p-2 hover:bg-slate-500 hover:text-white hover:cursor-pointer"
                        onClick={(e) => sendMessage(e, sug)}>
                        {truncate(sug)}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SendMessage;