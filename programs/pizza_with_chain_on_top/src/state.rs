use anchor_lang::prelude::*;

#[account]
pub struct TransactionState {
    pub customer: Pubkey,
    pub vendor: Pubkey,
    pub transaction_state: Vec<u8>,
    pub placed: bool,
}

impl TransactionState {
    pub const MAX_SIZE: usize = 32 + 32 + 32 + 1 + 8; // customer + vendor + max transaction_state + placed + discriminator
}