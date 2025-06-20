/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      fontFamily: {
        fontInter: "inter"
      },
      textColor: {
        "gradient": "linear-gradient(#FFFFFF,#669BDB);"
      },
      colors: {
        "black-100": '#000000',
        "black-80": 'rgb(0,0,0,0.8)',
        "black-60": 'rgb(0,0,0,0.6)',
        "black-20": 'rgb(0,0,0,0.2)',
        "black-10": 'rgb(0,0,0,0.1)',
        "white-100": '#FFFFFF',
        "green": '#008F5C',
        "linear": 'background: linear-gradient(180deg, #FB857A 0.01%, #D16FAF 100.01%)',
        "solana": 'background:linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(263.66deg, #0FCE93 -2.5%, #C634F6 97.5%)',
        "white-5": 'rgba(255, 255, 255, 0.05)',
        "white-10": 'rgba(255, 255, 255, 0.1)',
        "white-20": 'rgba(255, 255, 255, 0.2)',
        "white-30": 'rgba(255, 255, 255, 0.3)',
        "white-40": 'rgba(255, 255, 255, 0.4)',
        "white-50": 'rgba(255, 255, 255, 0.5)',
        "white-60": 'rgba(255, 255, 255, 0.6)',
        "white-70": 'rgba(255, 255, 255, 0.7)',
        "white-80": 'rgba(255, 255, 255, 0.8)',
        "white-90": 'rgba(255, 255, 255, 0.9)',
        "white-100": 'rgba(255, 255, 255, 1)',
        "neutral-1": '#F8F9FA',
        "neutral-2": '#EAEDF1',
        "neutral-3": '#DDE1E8',
        "neutral-4": '#CDD4DE',
        "neutral-5": '#BCC5D2',
        "neutral-6": '#A1ADC0',
        "neutral-7": '#8292AC',
        "neutral-8": '#637694',
        "neutral-9": '#4F5E76',
        "neutral-10": '#29303D',
        "dark-1": '#3D404A',
        "dark-2": '#31343F',
        "dark-3": '#252834',
        "dark-4": '#191C28',
        "dark-5": '#0D101D',
        "primary-1": '#F6FCFE',
        "primary-2": '#DEF3FC',
        "primary-3": '#B0E2F7',
        "primary-4": '#81D1F3',
        "primary-5": '#53BFEE',
        "primary-6": '#24AEEA',
        "primary-7": '#1391C8',
        "primary-8": '#0F6F9A',
        "primary-9": '#0A4E6B',
        "primary-10": '#062C3C',
        "green-1": '#F6FDF9',
        "green-2": '#D4F7E1',
        "green-3": '#A8F0C3',
        "green-4": '#7DE8A4',
        "green-5": '#52E086',
        "green-6": '#23C45E',
        "green-7": '#1FAD53',
        "green-8": '#17823E',
        "green-9": '#0F572A',
        "green-10": '#0B3D1D',
        "red-1": '#FDF2F2',
        "red-2": '#F9D2D2',
        "red-3": '#F2A6A6',
        "red-4": '#EC7979',
        "red-5": '#E54D4D',
        "red-6": '#DF2020',
        "red-7": '#B21A1A',
        "red-8": '#861313',
        "red-9": '#590D0D',
        "red-10": '#470A0A',
        "yellow-1": '#FEF9EC',
        "yellow-2": '#FCF0CF',
        "yellow-3": '#FAE19E',
        "yellow-4": '#F7D26E',
        "yellow-5": '#F5C33D',
        "yellow-6": '#F2B40D',
        "yellow-7": '#C2900A',
        "yellow-8": '#916C08',
        "yellow-9": '#614805',
        "yellow-10": '#4D3904',
        "transparent": 'transparent'
      },
      boxShadow: {
        "subtle-shadow1": "0px 4px 6px rgba(3, 7, 18, 0.1)",
        "input-component-shadow": "0px 2px 2px -1px rgba(9, 23, 74, 0.12), 0px 0px 0px 3px #E2E9FE",
        "new-icon-effect": "inset 0px 20px 20px rgba(255, 255, 255, 0.25), inset 0px -80px 40px rgba(0, 0, 0, 0.15), inset 0px -60px 120px rgba(0, 0, 0, 0.25)",
        "drop-shadow": "0px 0px 49px rgba(0, 0, 0, 0.5)",
      },
      backgroundImage: {
        'dicer': "url(/img/images.jfif)",
        'bg': "linear-gradient(122.82deg, #431687 0.26%, #08025B 97.09%)",
        'gallery': "url('/img/gallery.png')",
        'ustaking': "url('/img/ustaking.png')",
        'mainstaking': "url('/img/mainstaking.png')",
        'emptystaking': "url('/img/emptystaking.png')",
        'staking': "url('/img/staking.png')",
        'breadhead': "url('/img/breadhead.png')",
        'gradient': " linear-gradient(85.26deg, #05104C 41%, #dddee217 96.81%)",
        'gra_font': "linear-gradient(177.57deg, #6D6BE8 0.11%, #FFFFFF 71.34%, #669BDB 90.67%);",
        'leaderboard': "url('/img/leaderboard.png')",
        'tower': "linear-gradient(90deg, #04134A 0%, #669bdb2e 50%,  #669bdb00 85.25%)",
        'disconnect': "linear-gradient(90deg, #444CE4 0%, #669BDB 99.99%, #000DFE 100%);"
      },
      outlineWidth: {
        1: '1px'
      },
      backdropSepia: {
        "bb": "blur(24px)"
      },
      fontFamily: {
        'font-inter': 'Inter',
        'font-mono': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;'
      },
    }
  },
  plugins: [],
}