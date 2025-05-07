import React, { useState } from "react";
import { token, canisterID, createActor } from "../../../declarations/token";
import { AuthClient } from "@dfinity/auth-client";
import { isPropertySignature } from "../../../../node_modules/typescript/lib/typescript";

function Faucet() {

  const [isDisabled, setDisabled] = useState(false);
  const [buttonText, setText] = useState("Gimme gimme");

  async function handleClick(event) {
   
    setDisabled(true);
    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const authenticatedCanister = createActor(canisterID, {
      agentOptions: {
        identity,
      },
    });
    const result = await authenticatedCanister.payOut(); // calling the payOut function from the token actor (frontend)
    // for the live internet computer blockchain, we need to use the createActor function to create an authenticated actor
    // locally we can just use "await token.payOut()"
    setText(result); // setting the button text to the result of the payOut function
    //setDisabled(false); 
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>Get your free jeddis tokens here! Claim 10,000 jeddis coins to your account with the id {props.userPrincipal}.</label>
      <p className="trade-buttons">
        <button id="btn-payout" onClick={handleClick} disabled={isDisabled}>
          {buttonText}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
