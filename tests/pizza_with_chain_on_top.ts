import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PizzaWithChainOnTop } from "../target/types/pizza_with_chain_on_top";

describe("pizza_with_chain_on_top", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.PizzaWithChainOnTop as Program<PizzaWithChainOnTop>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
