/* eslint-disable @next/next/no-img-element */
import { Roundarrow } from "./Svglist";

export default function Statlist(props: { color: string, value: string, message: number, button: string }) {
    return (
        <div className=" relative flex flex-col h-[205px] w-[calc((100%-40px)/3)] rounded-[8px] border-[1.33px] border-[#FFFFFF1A]">
            <button className={`flex justify-center items-center mt-6 ml-6 bg-[#7A5AF8] rounded-[8px] w-[46px] h-[46px]`}>
                <img className="w-[26px]" src="/img/icons8-dice-64 2.png" alt="" />
            </button>
            <p className="text-[42.7px] text-white-100 font-bold leading-[52px] mt-[13.35px] ml-6">${(12354).toLocaleString()}</p>
            <p className="text-[21.36px] text-white-100 font-normal leading-[26px] mt-[10.73px] ml-6">Amount Wagered</p>
            <button className="absolute top-5 right-2">
                <Roundarrow />
            </button>
        </div>
    )
}