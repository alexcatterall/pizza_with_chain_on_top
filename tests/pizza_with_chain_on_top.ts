
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PizzaExchange } from "../target/types/pizza_exchange";
import { expect } from "chai";

describe("pizza-exchange", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.PizzaExchange as Program<PizzaExchange>;

  let transactionKeypair: anchor.web3.Keypair;
  let customerKeypair: anchor.web3.Keypair;
  let vendorKeypair: anchor.web3.Keypair;

  before(async () => {
    transactionKeypair = anchor.web3.Keypair.generate();
    customerKeypair = anchor.web3.Keypair.generate();
    vendorKeypair = anchor.web3.Keypair.generate();

    // Airdrop SOL to customer and vendor
    await provider.connection.requestAirdrop(customerKeypair.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.requestAirdrop(vendorKeypair.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
  });

  it("Creates a transaction", async () => {
    await program.methods
      .createTransaction()
      .accounts({
        transaction: transactionKeypair.publicKey,
        customer: customerKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([transactionKeypair, customerKeypair])
      .rpc();

    const transactionAccount = await program.account.transactionState.fetch(transactionKeypair.publicKey);
    expect(transactionAccount.customer.toString()).to.equal(customerKeypair.publicKey.toString());
    expect(transactionAccount.placed).to.be.false;
  });

  it("Joins a transaction", async () => {
    await program.methods
      .joinTransaction()
      .accounts({
        transaction: transactionKeypair.publicKey,
        vendor: vendorKeypair.publicKey,
      })
      .signers([vendorKeypair])
      .rpc();

    const transactionAccount = await program.account.transactionState.fetch(transactionKeypair.publicKey);
    expect(transactionAccount.vendor.toString()).to.equal(vendorKeypair.publicKey.toString());
  });

  it("Places an order", async () => {
    await program.methods
      .order()
      .accounts({
        transaction: transactionKeypair.publicKey,
        customer: customerKeypair.publicKey,
      })
      .signers([customerKeypair])
      .rpc();

    const transactionAccount = await program.account.transactionState.fetch(transactionKeypair.publicKey);
    expect(transactionAccount.placed).to.be.true;
  });

  it("Starts a transaction", async () => {
    await program.methods
      .startTransaction()
      .accounts({
        transaction: transactionKeypair.publicKey,
        vendor: vendorKeypair.publicKey,
      })
      .signers([vendorKeypair])
      .rpc();

    const transactionAccount = await program.account.transactionState.fetch(transactionKeypair.publicKey);
    expect(transactionAccount.transactionState).to.deep.equal([1]);
  });
});
      