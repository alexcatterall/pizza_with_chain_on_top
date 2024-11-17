export default function Component() {
    return (
      <pre className="text-sm">
        {`
  use anchor_lang::prelude::*;
  
  #[error_code]
  pub enum PizzaExchangeError {
      #[msg("Vendor has not joined the transaction")]
      VendorNotJoined,
      #[msg("Customer has not joined the transaction")]
      CustomerNotJoined,
      #[msg("Unauthorized vendor")]
      UnauthorizedVendor,
      #[msg("Order has not been placed")]
      OrderNotPlaced,
  }
        `}
      </pre>
    )
  }