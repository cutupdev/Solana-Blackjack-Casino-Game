/* eslint-disable @next/next/no-img-element */
import moment from "moment";
import { useState } from "react"
import { base58ToGradient } from "../../utils/util";
import { Downarrow, UserIcon } from "../Svglist"
export default function ChatItem(props: { name: string, time: number, message: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="flex flex-col rounded-[8px] mb-7">
            <div className="flex flex-row items-start p-4 bg-[#04134A] justify-between rounded-t-lg">
                <div className="flex items-center">
                    {/* <img className="w-10 h-10" src="/img/bear.png" alt="" /> */}

                    <UserIcon color={base58ToGradient(props.name).color} />
                    <div className="flex flex-col ml-2">
                        <p className={`text-sm font-semibold`} style={{ color: base58ToGradient(props.name).color }}>{props?.name?.length > 10 ? (props.name.slice(0, 3) + "..." + props.name.slice(-3)) : props.name}</p>
                        <p className="text-[10px] text-[#FFFFFFA8] ">{moment(props.time).fromNow()}</p>
                    </div>
                </div>
                {props?.message?.length > 30 &&
                    <button className="mt-2" onClick={() => setOpen(!open)}>
                        <Downarrow className={`w-3 h-3 ${open ? "rotate-180" : ""}`} />
                    </button>
                }
            </div>
            <div className={`px-4 pb-4 bg-[#03144E] rounded-b-lg ${!open ? "h-8 overflow-hidden" : ""}`}>
                <p className="text-[14px] text-white">{props.message}</p>
            </div>
        </div >
    )
}