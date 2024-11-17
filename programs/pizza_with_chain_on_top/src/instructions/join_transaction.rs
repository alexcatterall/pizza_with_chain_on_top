export default function Component() {
    return (
      <pre className="text-sm">
        {`
  use anchor_lang::prelude::*;
  use crate::state::TransactionState;
  
  #[derive(Accounts)]
  pub struct JoinTransaction<'info> {
      #[account(mut)]
      pub transaction: Account<'info, TransactionState>,
      pub vendor: Signer<'info>,
  }
  
  pub fn run_join_transaction(ctx: Context<JoinTransaction>) -> Result<()> {
      let transaction = &mut ctx.accounts.transaction;
      transaction.vendor = ctx.accounts.vendor.key();
      Ok(())
  }
        `}
      </pre>
    )
  }