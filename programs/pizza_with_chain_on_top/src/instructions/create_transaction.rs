export default function Component() {
    return (
      <pre className="text-sm">
        {`
  use anchor_lang::prelude::*;
  use crate::state::TransactionState;
  
  #[derive(Accounts)]
  pub struct CreateTransaction<'info> {
      #[account(init, payer = customer, space = TransactionState::MAX_SIZE)]
      pub transaction: Account<'info, TransactionState>,
      #[account(mut)]
      pub customer: Signer<'info>,
      pub system_program: Program<'info, System>,
  }
  
  pub fn run_create_transaction(ctx: Context<CreateTransaction>) -> Result<()> {
      let transaction = &mut ctx.accounts.transaction;
      transaction.customer = ctx.accounts.customer.key();
      transaction.placed = false;
      Ok(())
  }
        `}
      </pre>
    )
  }