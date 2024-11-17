
import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { PizzaExchange } from "./types/pizza_exchange";
import idl from "./idl/pizza_exchange.json";

export class PizzaExchangeSDK {
  private program: Program<PizzaExchange>;

  constructor(provider: anchor.AnchorProvider, programId: anchor.web3.PublicKey) {
    this.program = new Program(idl as any, programId, provider);
  }

  async createTransaction(customer: anchor.web3.Keypair): Promise<anchor.web3.PublicKey> {
    const transaction = anchor.web3.Keypair.generate();
    await this.program.methods
      .createTransaction()
      .accounts({
        transaction: transaction.publicKey,
        customer: customer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([transaction, customer])
      .rpc();
    return transaction.publicKey;
  }

  async joinTransaction(transaction: anchor.web3.PublicKey, vendor: anchor.web3.Keypair): Promise<void> {
    await this.program.methods
      .joinTransaction()
      .accounts({
        transaction,
        vendor: vendor.publicKey,
      })
      .signers([vendor])
      .rpc();
  }

  async order(transaction: anchor.web3.PublicKey, customer: anchor.web3.Keypair): Promise<void> {
    await this.program.methods
      .order()
      .accounts({
        transaction,
        customer: customer.publicKey,
      })
      .signers([customer])
      .rpc();
  }

  async startTransaction(transaction: anchor.web3.PublicKey, vendor: anchor.web3.Keypair): Promise<void> {
    await this.program.methods
      .startTransaction()
      .accounts({
        transaction,
        vendor: vendor.publicKey,
      })
      .signers([vendor])
      .rpc();
  }

  async getTransaction(transaction: anchor.web3.PublicKey): Promise<any> {
    return await this.program.account.transactionState.fetch(transaction);
  }

  async getAllTransactions(): Promise<any[]> {
    return await this.program.account.transactionState.all();
  }

  async getTransactionsByCustomer(customer: anchor.web3.PublicKey): Promise<any[]> {
    return await this.program.account.transactionState.all([
      {
        memcmp: {
          offset: 8, // Discriminator
          bytes: customer.toBase58(),
        },
      },
    ]);
  }

  async getTransactionsByVendor(vendor: anchor.web3.PublicKey): Promise<any[]> {
    return await this.program.account.transactionState.all([
      {
        memcmp: {
          offset: 40, // Discriminator + customer
          bytes: vendor.toBase58(),
        },
      },
    ]);
  }
}
      