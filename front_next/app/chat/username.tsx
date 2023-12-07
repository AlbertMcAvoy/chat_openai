'use client';
import {useEffect, useState} from "react";
import {Socket} from "socket.io-client";

interface Props {
    socket: Socket;
    setUsername: (username: string) => void;
    username: string;
}

const Username = ({socket, setUsername, username}: Props) => {

    const [cUsername, setCUsername] = useState('');

    const [isUsernameUsed, setIsUsernameUsed] = useState(undefined);

    useEffect(() => {
        socket.on('chat-check_username', (data: any) => {
            setIsUsernameUsed(data.isUsed);
        });
        socket.on('chat-username', (data: any) => {
            if (data.error) {
                alert("Ce nom est déjà utilisé");
            }
        });
    }, [socket]);


    const checkUsernameAvailability = (username: string) => {
        socket.emit('chat-check_username', { username });
    }

    const sendUsername = (event:any, username: string) => {
        event.preventDefault();
        if (username === '') return;
        if (event.type === 'submit') {
            socket.emit('chat-username', { username });

            if (! isUsernameUsed) {
                setUsername(cUsername);
                setCUsername('');
            }
        }
    }

    const getIsValidUsernameBorder = () => {
        if (isUsernameUsed === undefined) {
            return 'focus:border-purple-500'
        } else {
            return isUsernameUsed ? 'border-red-500 focus:border-red-500' : 'focus:border-green-500 border-green-500';
        }
    }

    return (
        <form className="w-full max-w-sm"
              onSubmit={(event) => {sendUsername(event, cUsername)}}>
            <div className="md:flex md:items-center mb-6">
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                       htmlFor="inline-full-name">
                    Pseudo
                </label>
                <div className="md:w-2/3">
                    <input
                        className={`bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white ${getIsValidUsernameBorder()}`}
                        id="inline-full-name" type="text" placeholder="Jane Doe"
                        onChange={e => { setCUsername(e.currentTarget.value); }}
                        onKeyUp={e => { checkUsernameAvailability(e.currentTarget.value); }}
                        value={cUsername} />
                </div>
                <button type='submit'
                        className="flex-shrink-0 border-transparent border-4 text-purple-900 hover:text-purple-500 text-sm py-1 px-2 rounded"> Choisir ce pseudo </button>
            </div>
            <div>Pseudo Actuel: {username} </div>
        </form>
    )
}

export default Username;