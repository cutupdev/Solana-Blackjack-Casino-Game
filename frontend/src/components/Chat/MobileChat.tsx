/* eslint-disable @next/next/no-img-element */
import { useWallet } from "@solana/wallet-adapter-react"
import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../config";
import { useSocket } from "../../context/SocketContext";
import { Discordimage, RightSvg } from "../Svglist"
import ChatItem from "./ChatItem"

export default function MobileChat(props: { opened: boolean, setOpen: Function }) {
    const wallet = useWallet();
    const [message, setMessage] = useState("");
    const { messages, onlined } = useSocket();
    const { opened, setOpen } = props;

    const handleMessage = (value: string) => {
        setMessage(value);
    }

    const handleKeyDown = (event: { keyCode: number; }) => {
        if (event.keyCode === 13) {
            console.log("message =>", message)
            handleSubmit();
        }
    }
    const handleSubmit = async () => {
        if (wallet.publicKey === null) return;
        try {
            await axios.post(`${API_URL}writeMessage/`, {
                user: wallet.publicKey.toBase58(),
                msg: message
            });
            setMessage("");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={`fixed w-[300px] flex-col px-4 pt-4 border-[1px] flex  transition-transform duration-300 border-[#FFFFFF3D] right-0 top-0 h-[100vh] md:hidden ${!opened ? "translate-x-[320px]" : "translate-x-0"} z-20 bg-[#06104d]`}>
            <div className="flex flex-row justify-between items-center">
                <p className="text-[18px] text-[#FFFFFFA8] font-normal uppercase">Welcome!</p>
                <button className="flex justify-center w-6 h-6 rounded-[7px] border-[1.34px] border-[#FFFFFF0F] bg-[#03144E] items-center"
                    onClick={() => setOpen(false)}>
                    <RightSvg className="w-2 h-2" />
                </button>
            </div>
            <p className="text-[12px] text-[#ffffff] font-normal pb-3 mt-3 leading-[29px] border-b-[1.33px] border-[#FFFFFF0F]">{onlined} Players Online</p>
            <div className="h-[calc(100vh-270px)] overflow-auto scrollbar mt-2 flex flex-col-reverse">
                {messages && messages.length !== 0 &&
                    messages.map((item, key) => (
                        <ChatItem name={item.user_name} time={item.timestamp} message={item.message} key={key} />
                    ))}
            </div>
            <div className="absolute -bottom-0.5 right-0 w-full px-4 border-t-[1px] bg-[#06104d] border-[#FFFFFF3D]">
                <div className="border-t-[1.33px] border-[#FFFFFF0F]"></div>
                <input
                    type="text"
                    className="w-full mt-5 bg-[#03144E] text-[14px] text-white-100 border-[1.33px] border-[#FFFFFF21] rounded-[8px] py-3 px-3"
                    value={message}
                    onChange={(e: any) => handleMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Say something in chat..."
                />
                <div className="flex flex-row my-4 items-center justify-between">
                    <div className="flex items-center">
                        <Discordimage />
                        <p className="uppercase text-[12px] text-white leading-3 ml-1">tearms of sevice & rules</p>
                    </div>
                    <button
                        className="bg-[#03144E] rounded-[8px] border-[1px] border-[#FFFFFF42] h-8 items-center text-center text-[12px] text-white-100 px-3 font-bold"
                        onClick={() => handleSubmit()}
                    >SEND</button>
                </div>
            </div>
        </div >
    )
}
