import { BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

export interface GiftCard {
  creator: PublicKey;
  amount: BN;
  unlockDate: BN;
  claimed: boolean;
}

export interface CreateGiftCardInput {
  amount: number;
  title: string;
  unlockDate: Date;
}
