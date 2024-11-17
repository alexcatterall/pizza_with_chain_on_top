export default function Component() {
    return (
      <pre className="text-sm">
        {`
  use anchor_lang::prelude::*;
  
  pub mod state;
  pub mod instructions;
  pub mod errors;
  
  use instructions::*;
  
  declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
  
  #[program]
  pub mod pizza_exchange {
      use super::*;
  
      pub fn create_transaction(ctx: Context<CreateTransaction>) -> Result<()> {
          instructions::create_transaction::run_create_transaction(ctx)
      }
  
      pub fn join_transaction(ctx: Context<JoinTransaction>) -> Result<()> {
          instructions::join_transaction::run_join_transaction(ctx)
      }
  
      pub fn order(ctx: Context<Order>) -> Result<()> {
          instructions::order::run_order(ctx)
      }
  
      pub fn start_transaction(ctx: Context<StartTransaction>) -> Result<()> {
          instructions::start_transaction::run_start_transaction(ctx)
      }
  }
        `}
      </pre>
    )
  }