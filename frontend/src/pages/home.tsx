/* eslint-disable @next/next/no-img-element */
import {
  Roundarrow,
  Tripledot,
} from "../components/Svglist";
import Playhistory from "../components/Playhistory";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div className="flex min-h-[100vh] bg-bg bg-cover bg-no-repeat w-full">
      <Sidebar />
      <main className="xl:w-[calc(100%-280px)] w-full flex flex-col md:ml-[70px] lg:ml-[280px]">
        <div className="mt-0 flex-col relative w-full pb-20">
          <div className="h-[280px] md:h-[480px] overflow-hidden">
            <img
              src="/img/home-banner.jpg"
              alt=""
            />
          </div>
          <div className="pl-4 pr-4">
            <p className="font-font-mono text-[26.7px] font-normal mt-[38px] text-white-100 leading-10">
              Statistics
            </p>
            <div className="flex flex-wrap mt-[18px] rounded-[8px] gap-[13px]">
              <div className=" relative flex flex-col h-[205px] lg:w-[calc((100%-40px)/3)] w-full rounded-[8px] border-[1.33px] border-[#FFFFFF1A]">
                <button className="flex justify-center items-center mt-6 ml-6 bg-[#444CE4] rounded-[8px] w-[46px] h-[46px]">
                </button>
                <p className="text-[32px] text-white-100 font-bold leading-[52px] mt-[13.35px] ml-6">
                  ${(4300).toLocaleString()}
                </p>
                <p className="text-md text-white-100 font-normal leading-[26px] mt-[10.73px] ml-6">
                  Amount Wagered
                </p>
                <button className="absolute top-5 right-2">
                  <Tripledot />
                </button>
              </div>
              <div className=" relative flex flex-col h-[205px] lg:w-[calc((100%-40px)/3)] w-full rounded-[8px] border-[1.33px] border-[#FFFFFF1A]">
                <button className="flex justify-center items-center mt-6 ml-6 bg-[#F257A0] rounded-[8px] w-[46px] h-[46px]">
                </button>
                <p className="text-[32px] text-white-100 font-bold leading-[52px] mt-[13.35px] ml-6">
                  {(123532).toLocaleString()}
                </p>
                <p className="text-md text-white-100 font-normal leading-[26px] mt-[10.73px] ml-6">
                  Amount Wagered
                </p>
                <button className="absolute top-5 right-2">
                  <Tripledot />
                </button>
              </div>
              <div className=" relative flex flex-col h-[205px] lg:w-[calc((100%-40px)/3)] w-full rounded-[8px] border-[1.33px] border-[#FFFFFF1A]">
                <button className="flex justify-center items-center mt-6 ml-6 bg-[#7A5AF8] rounded-[8px] w-[46px] h-[46px]">
                </button>
                <p className="text-[32px] text-white-100 font-bold leading-[52px] mt-[13.35px] ml-6">
                  ${(12354).toLocaleString()}
                </p>
                <p className="text-md text-white-100 font-normal leading-[26px] mt-[10.73px] ml-6">
                  Amount Wagered
                </p>
                <button className="absolute top-5 right-2">
                  <Roundarrow />
                </button>
              </div>
            </div>
            <p className="font-font-mono text-[26.7px] font-normal mt-[29.36px] text-white-100 leading-10">
              Recent Plays
            </p>

            <div className="w-full overflow-x-auto">
              <div className="min-w-[650px]">
                <div className="flex flex-row mt-[19px] mb-2">
                  <p className="w-1/4 text-sm text-[#FFFFFFA8] pl-10">Game</p>
                  <p className="w-[calc(29%)] text-sm text-[#FFFFFFA8]">
                    Username
                  </p>
                  <p className="w-[calc(13%)] text-sm text-[#FFFFFFA8]">Bet</p>
                  <p className="w-[calc(15%)] text-sm text-[#FFFFFFA8]">Payout</p>
                  <p className="text-sm text-[#FFFFFFA8]">TX</p>
                </div>

                <Playhistory
                  game="DiceRoyale"
                  user="LordPlay@0115"
                  bet=".5 SOL"
                  payout="4.5 SOL"
                />
                <Playhistory
                  game="DiceRoyale"
                  user="JamesRanking@1178"
                  bet=".5 SOL"
                  payout="4.5 SOL"
                />
                <Playhistory
                  game="DiceRoyale"
                  user="HostyTheDev@0332"
                  bet=".5 SOL"
                  payout="4.5 SOL"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
