#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF");

#[program]
pub mod basic {
    use super::*;

    pub fn create_entry(ctx: Context<CreateEntry>, title: String, data: String) -> Result<()> {
        let entry = &mut ctx.accounts.entry;
        entry.owner = ctx.accounts.owner.key();
        entry.title = title;
        entry.data = data;
        Ok(())
    }

    pub fn update_entry(ctx: Context<UpdateEntry>, title: String, data: String) -> Result<()> {
        let entry = &mut ctx.accounts.entry;
        require_keys_eq!(entry.owner, ctx.accounts.owner.key(), CustomError::Unauthorized);
        require!(entry.title == title, CustomError::TitleMismatch);

        entry.data = data;
        Ok(())
    }

    pub fn delete_entry(_ctx: Context<DeleteEntry>, _title: String) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateEntry<'info> {
    #[account(
        init,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        space = 8 + EntryState::INIT_SPACE,
        payer = owner,
    )]
    pub entry: Account<'info, EntryState>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct UpdateEntry<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
    )]
    pub entry: Account<'info, EntryState>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteEntry<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        close = owner,
    )]
    pub entry: Account<'info, EntryState>,
    #[account(mut)]
    pub owner: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct EntryState {
    pub owner: Pubkey,
    #[max_len(50)]
    pub title: String,
    #[max_len(50)]
    pub data: String,
}

#[error_code]
pub enum CustomError {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("Title mismatch.")]
    TitleMismatch,
}
