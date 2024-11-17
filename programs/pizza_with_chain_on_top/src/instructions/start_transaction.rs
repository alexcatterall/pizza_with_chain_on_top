use anchor_lang::prelude::*;
  use crate::state::TransactionState;
  use crate::errors::PizzaExchangeError;
  
  #[derive(Accounts)]
  pub struct StartTransaction<'info> {
      #[account(mut)]
      pub transaction: Account<'info, TransactionState>,
      pub vendor: Signer<'info>,
  }
  
  pub fn run_start_transaction(ctx: Context<StartTransaction>) -> Result<()> {
      let transaction = &mut ctx.accounts.transaction;
      
      require!(transaction.customer != Pubkey::default(), PizzaExchangeError::CustomerNotJoined);
      require!(transaction.vendor == ctx.accounts.vendor.key(), PizzaExchangeError::UnauthorizedVendor);
      require!(transaction.placed, PizzaExchangeError::OrderNotPlaced);
      
      transaction.transaction_state = vec![1]; // Set initial state
      Ok(())
  }