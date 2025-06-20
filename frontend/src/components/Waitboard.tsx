import { useMemo } from "react";
import { useSocket } from "../context/SocketContext";
import { base58ToGradient } from "../utils/util";

export default function Waitboard() {
    const { gameData } = useSocket()
    const pies = useMemo(() => {
        let piesList: {
            publicKey: string,
            bgColor: string,
            shadow: string,
            height: number
        }[] = [];
        if (gameData && gameData?.players) {
            const sumBets = gameData?.players.reduce((sum: number, item: any) => sum + item.amount, 0);
            gameData?.players?.map((item: any) => {
                piesList.push({
                    publicKey: item.player,
                    bgColor: base58ToGradient(item.player).gradient,
                    shadow: base58ToGradient(item.player).shadow,
                    height: (item.amount / sumBets) * 100
                })
            })
        }
        return piesList
    }, [gameData])

    return (
        <div className="w-full h-full rounded-lg overflow-hidden">
            {
                pies.map((pie, key) => (
                    <div className={`overflow-hidden`} key={key}
                        style={{
                            background: `${pie.bgColor}`,
                            height: `${pie.height}%`,
                            boxShadow: pie.shadow
                        }}>
                    </div>
                ))
            }
        </div>
    )
}