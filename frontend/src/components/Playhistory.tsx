import Link from "next/link";

/* eslint-disable @next/next/no-img-element */
export default function Playhistory(props: { game: string, user: string, bet: string, payout: string }) {
    return (
        <div className="flex flex-row items-center justify-between mb-1 border-[1px] border-[#FFFFFF1C] py-2 rounded-[8px] px-2">
            <div className="flex justify-center items-center w-1/4">
                <img className="w-6 h-6 object-cover mr-1" src="/img/dice.png" alt="" />
                <p className="text-sm text-[#FFFFFFA8] leading-[26px]">{props.game}</p>
            </div>
            <p className="w-[calc(29%)] text-sm text-[#FFFFFFA8] leading-[26px]">{props.user}</p>
            <p className="w-[calc(13%)] text-sm text-[#FFFFFFA8] leading-[26px]">{props.bet}</p>
            <p className="w-[calc(15%)] text-sm text-[#5BDCC6] leading-[26px]">{props.payout}</p>
            <Link href="https://solscan.io/" passHref>
                <a target="_blank" >
                    <div className="text-center py-[7px] border-[1px] px-2 border-[#FFFFFF1C] text-[13.35px] rounded-[8px] text-[#FFFFFFA8] font-mono">
                        VIEW SOLSCAN
                    </div>
                </a>
            </Link>
        </div>
    )
}