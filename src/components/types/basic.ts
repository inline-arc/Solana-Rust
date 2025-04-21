import { Idl } from '@coral-xyz/anchor';

export const BasicIDL: Idl = {
  "version": "0.1.0",
  "name": "basic",
  "instructions": [
    {
      "name": "createGiftCard",
      "accounts": [
        {
          "name": "giftCard",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
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
        },
        {
          "name": "unlockDate",
          "type": "i64"
        }
      ]
    },
    {
      "name": "claimGiftCard",
      "accounts": [
        {
          "name": "giftCard",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receiver",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "giftCard",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "unlockDate",
            "type": "i64"
          },
          {
            "name": "claimed",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AlreadyClaimed",
      "msg": "Gift card has already been claimed"
    },
    {
      "code": 6001,
      "name": "TimeNotReached",
      "msg": "Cannot claim before unlock date"
    }
  ]
}
