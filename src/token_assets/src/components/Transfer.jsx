import React, { useState } from "react";
import { token, canisterID, createActor } from "../../../declarations/token";
import { Principal } from "@dfinity/principal";
import { AuthClient } from "@dfinity/auth-client";

function Transfer() {

  const [recipientID, setID] = useState("");
  const [amount, setAmount] = useState("");
  const [isDisabled, setDisabled] = useState(false);
  // for a feedback after the transfer
  const [feedback, setFeedback] = useState("");
  // the feedback will be hidden at the beginning
  const [isHidden, setHidden] = useState(true);

  async function handleClick() {
    setHidden(true); // setting the hidden attribute of the p-tag with the transfer-info to true, so that it is not visible
    setDisabled(true);
    const recipient = Principal.fromText(recipientID); // converting what the user entered to a Principal ID


    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const authenticatedCanister = createActor(canisterID, {
      agentOptions: {
        identity,
      },
    });

    // the first parameter is the Principal ID of the account we want to transfer tokens to
    // we get this from the value within the input field
    //const result = await token.transfer(recipient, Number(amount)); // the second parameter is the amount of tokens we want to transfer
    const result = await authenticatedCanister.transfer(recipient, Number(amount)); 
    setFeedback(result);
    setHidden(false); // setting the hidden attribute of the p-tag with the transfer-info to false, so that it is visible
    setDisabled(false);
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                value={recipientID}
                onChange={(e) => setID(e.target.value)} // whenever the input changes, we update the recipientID state variable with the new value
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)} // whenever the input changes, we update the amount state variable with the new value
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          <button
            id="btn-transfer"
            onClick={handleClick}
            disabled={isDisabled}
          >
            Transfer
          </button>
        </p>
        <p hidden={isHidden}>{feedback}</p>
      </div>
    </div>
  );
}

export default Transfer;
