
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
    const transactionSignature = await provider.connection.requestAirdrop(transactionKeypair.publicKey, 12 * anchor.web3.LAMPORTS_PER_SOL);
    const customerSignature = await provider.connection.requestAirdrop(customerKeypair.publicKey, 12 * anchor.web3.LAMPORTS_PER_SOL);
    const vendorSignature = await provider.connection.requestAirdrop(vendorKeypair.publicKey, 12 * anchor.web3.LAMPORTS_PER_SOL);    
    console.log('airdrop succeed')

    // Wait for the airdrop transactions to be confirmed
    await provider.connection.confirmTransaction(transactionSignature);
    await provider.connection.confirmTransaction(customerSignature);
    await provider.connection.confirmTransaction(vendorSignature);
    
    // print balance of customerKeyPair
    const transactionBalance = await provider.connection.getBalance(transactionKeypair.publicKey);
    console.log(`Transaction Account Balance: ${transactionBalance / anchor.web3.LAMPORTS_PER_SOL} SOL`);
    
    const customerBalance = await provider.connection.getBalance(customerKeypair.publicKey);
    console.log(`Customer Account Balance: ${customerBalance / anchor.web3.LAMPORTS_PER_SOL} SOL`);
    
    const vendorBalance = await provider.connection.getBalance(vendorKeypair.publicKey);
    console.log(`Vendor Account Balance: ${vendorBalance / anchor.web3.LAMPORTS_PER_SOL} SOL`);
  });

  it("Creates a transaction", async () => {
    console.log('create a txn')
    await program.methods
      .createTransaction()
      .accounts({
        transaction: transactionKeypair.publicKey,
        customer: customerKeypair.publicKey,
      })
      .signers([transactionKeypair, customerKeypair])
      .rpc();
    console.log('txn don')
    const transactionAccount = await program.account.transactionState.fetch(transactionKeypair.publicKey);
    console.log('txn don 1')
    expect(transactionAccount.customer.toString()).to.equal(customerKeypair.publicKey.toString());
    console.log('txn don 2')
    expect(transactionAccount.placed).to.be.false;
    console.log('txn don 3')
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
    const accounts = {
      transaction: transactionKeypair.publicKey,
      customer: customerKeypair.publicKey,
    };
    await program.methods
      .order()
      .accounts(accounts)
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
      