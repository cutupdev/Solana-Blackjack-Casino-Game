export type Jackpot = {
  "version": "0.1.0",
  "name": "jackpot",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "playGame",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gamePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "codyWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bet3Wallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "jerzyWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "experWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "teamWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ts",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "enterGame",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gamePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "codyWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bet3Wallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "jerzyWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "experWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "teamWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimReward",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gamePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "winner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultBump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "gamePool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startTs",
            "type": "u64"
          },
          {
            "name": "rand",
            "type": "u64"
          },
          {
            "name": "totalDeposit",
            "type": "u64"
          },
          {
            "name": "claimed",
            "type": "u64"
          },
          {
            "name": "winner",
            "type": "publicKey"
          },
          {
            "name": "entrants",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "depositAmounts",
            "type": {
              "vec": "u64"
            }
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAdmin",
      "msg": "Invalid Admin Address"
    },
    {
      "code": 6001,
      "name": "AlreadyClaimed",
      "msg": "Already Claimed Game"
    },
    {
      "code": 6002,
      "name": "NotWinner",
      "msg": "The Account is Not Winner"
    }
  ]
};

export const IDL: Jackpot = {
  "version": "0.1.0",
  "name": "jackpot",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "playGame",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gamePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "codyWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bet3Wallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "jerzyWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "experWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "teamWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ts",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "enterGame",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gamePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "codyWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bet3Wallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "jerzyWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "experWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "teamWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimReward",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gamePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "winner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "solVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultBump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "gamePool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startTs",
            "type": "u64"
          },
          {
            "name": "rand",
            "type": "u64"
          },
          {
            "name": "totalDeposit",
            "type": "u64"
          },
          {
            "name": "claimed",
            "type": "u64"
          },
          {
            "name": "winner",
            "type": "publicKey"
          },
          {
            "name": "entrants",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "depositAmounts",
            "type": {
              "vec": "u64"
            }
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAdmin",
      "msg": "Invalid Admin Address"
    },
    {
      "code": 6001,
      "name": "AlreadyClaimed",
      "msg": "Already Claimed Game"
    },
    {
      "code": 6002,
      "name": "NotWinner",
      "msg": "The Account is Not Winner"
    }
  ]
};
