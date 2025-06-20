/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { MobileMenuIcon } from "./Svglist";

export default function Sidebar() {
  const [mobilMenuState, setMobileMenuState] = useState<boolean>(true);
  return (
    <nav
      className={`${mobilMenuState ? "w-[80px]" : "w-[280px]"
        } lg:w-[280px] flex-col lg:flex fixed left-0 top-0 h-full z-50 border-r-2 border-[#ffffff32] bg-[#200a6d] md:bg-transparent`}
    // style={{ background: "linear-gradient(90deg, #05104C 0%, #09185A 100%)" }}
    >
      <div
        className={`flex lg:hidden w-full  ${mobilMenuState ? "justify-center" : "justify-end"
          } items-center cursor-pointer p-5`}
        onClick={() => setMobileMenuState(!mobilMenuState)}
      >
        <MobileMenuIcon color="white" />
      </div>
      <div
        className={`h-full overflow-y-auto scrollbar overflow-x-hidden ${mobilMenuState ? "space-y-4" : "lg:space-y-0"
          } `}
      >
        <div className={`px-6 lg:block ${mobilMenuState ? "hidden" : "block"}`}>
          <h1
            style={{ color: "transparent" }}
            className="text-[32px] bg-gra_font font-fontInter bg-clip-text pt-[32px] font-[900]"
          >
            SlowRUG
          </h1>
          <div
            className={`w-full my-6 lg:block ${mobilMenuState ? "hidden" : "block"
              }`}
          >
            {/* <WalletMultiButton /> */}
          </div>
        </div>
        <p
          className={` font-normal text-[#ffffff] mt-6 border-[#ffffff32] pb-3 mx-6 lg:block ${mobilMenuState ? "hidden" : "block"
            }`}
        >
          Games
        </p>
        <div className="border-[1px] border-[#ffffff32] mx-4" />
        <Link href="/play" passHref>
          <a>
            <div className="flex my-4 hover:bg-[#ffffff12] hover:border-r-2 hover:border-[#D9D9D9] px-6 items-center">
              <img
                src="/img/tower.png"
                alt=""
                className="w-6 h-6 mr-4 object-contain"
              />
              <p
                className={`lg:block cursor-pointer font-bold text-[#ffffff] py-[15px] ${mobilMenuState ? "hidden" : "block"
                  }`}
              >
                Tower Of Power
              </p>
            </div>
          </a>
        </Link>
        <p
          className={`font-normal text-[#ffffff] mt-6 border-[#ffffff32] pb-3 mx-6 lg:block ${mobilMenuState ? "hidden" : "block"
            }`}
        >
          Support
        </p>
        <div className="border-[1px] border-[#ffffff32] mx-4" />
        <Link href=" https://discord.gg/aejTFT6hKY">
          <a className="">
            <div className="mt-4 flex hover:bg-[#ffffff12] hover:border-r-2 hover:border-[#D9D9D9] px-6 items-center">
              <img
                src="/img/discord.png"
                alt=""
                className="w-6 h-6 mr-4 object-contain"
              />
              <p
                className={`lg:block cursor-pointer font-bold text-[#ffffff] py-[15px] ${mobilMenuState ? "hidden" : "block"
                  }`}
              >
                Discord
              </p>
            </div>
          </a>
        </Link>
        <Link href=" https://x.com/ptcbink">
          <a className="">
            <div className="mt-4 flex hover:bg-[#ffffff12] hover:border-r-2 hover:border-[#D9D9D9] px-6 items-center">
              <img
                src="/img/twitter1.png"
                alt=""
                className="w-6 h-6 mr-4 object-contain"
              />
              <p
                className={`lg:block cursor-pointer font-bold text-[#ffffff] py-[15px] ${mobilMenuState ? "hidden" : "block"
                  }`}
              >
                Twitter
              </p>
            </div>
          </a>
        </Link>
      </div>
    </nav>
  );
}
