export default function Component() {
    return (
      <pre className="text-sm">
        {`
  pub mod create_transaction;
  pub mod join_transaction;
  pub mod order;
  pub mod start_transaction;
  
  pub use create_transaction::*;
  pub use join_transaction::*;
  pub use order::*;
  pub use start_transaction::*;
        `}
      </pre>
    )
  }