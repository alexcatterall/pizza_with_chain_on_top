use anchor_lang::prelude::*;

declare_id!("5NaXcDNZHSAK8q6G15bcuFkJEcDL54Qd1EGbHTz2Qye9");

#[program]
pub mod pizza_with_chain_on_top {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
