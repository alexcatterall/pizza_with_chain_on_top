export default function Component() {
    return (
      <pre className="text-sm">
        {`
  use anchor_lang::prelude::*;
  use crate::state::TransactionState;
  use crate::errors::PizzaExchangeError;
  
  #[derive(Accounts)]
  pub struct Order<'info> {
      #[account(mut, has_one = customer)]
      pub transaction: Account<'info, TransactionState>,
      pub customer: Signer<'info>,
  }
  
  pub fn run_order(ctx: Context<Order>) -> Result<()> {
      let transaction = &mut ctx.accounts.transaction;
      
      require!(transaction.vendor != Pubkey::default(), PizzaExchangeError::VendorNotJoined);
      
      transaction.placed = true;
      Ok(())
  }
        `}
      </pre>
    )
  }