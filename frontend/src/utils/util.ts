import { useQuery } from "@tanstack/react-query";
import { SOL_PRICE_API } from "../config";

export const useSolanaPrice = () => {
    const { isLoading, isError, data, error } = useQuery(["solanaPrice"], async () => {
        const response = await fetch(SOL_PRICE_API);
        const data = await response.json();
        return data.solana?.usd;
    });

    return { isLoading, isError, data, error };
};


export const base58ToColor = (publicKey: string) => {
    let hex = '';
    for (let i = 0; i < publicKey.length; i++) {
        let code = publicKey.charCodeAt(i).toString(16);
        hex += code.padStart(2, '0');
    }
    return "#" + hex.slice(0, 6);
};

export const base58ToGradient = (publicKey: string) => {
    const intNumber = publicKey.slice(0, 3).split('').map(char => char.charCodeAt(0)).join('');
    return colors[parseInt(intNumber) % 18];
}

const colors = [
    {
        gradient: "linear-gradient(180deg, #B28EFF 0%, #7230FF 100%)",
        color: "#B28EFF",
        shadow: "inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25) "
    },
    {
        gradient: "linear-gradient(180deg, #FF7E7E 0%, #E14646 100%)",
        color: "#FF7E7E",
        shadow: "inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #7EB2FF 0%, #467BE1 100%)",
        color: "#7EB2FF",
        shadow: "inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #FFE37E 0%, #DEE146 100%)",
        color: "#FFE37E",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #A8FF7E 0%, #81E146 100%)",
        color: "#A8FF7E",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #7EFFE0 0%, #46D8E1 100%)",
        color: "#7EFFE0",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #7EA2FF 0%, #5C46E1 100%)",
        color: "#7EA2FF",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #C67EFF 0%, #C246E1 100%)",
        color: "#C67EFF",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #FF7EE3 0%, #E146A3 100%)",
        color: "#FF7EE3",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #E77070 0%, #E71515 100%)",
        color: "#E77070",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #6C98DB 0%, #255FCF 100%)",
        color: "#6C98DB",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #CDB767 0%, #BCBF29 100%)",
        color: "#CDB767",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #82C861 0%, #67CD29 100%)",
        color: "#82C861",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #67CEB5 0%, #25A4AC 100%)",
        color: "#67CEB5",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #5873BA 0%, #3821BF 100%)",
        color: "#5873BA",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #A367D2 0%, #AC2FCB 100%)",
        color: "#A367D2",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #C05CAA 0%, #C22684 100%)",
        color: "#C05CAA",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
    {
        gradient: "linear-gradient(180deg, #93C4FF 0%, #4A8CDD 100%)",
        color: "#93C4FF",
        shadow: " inset 0px 8px 4px rgba(0, 0, 0, 0.1), inset 0px -8px 4px rgba(0, 0, 0, 0.25)"
    },
]