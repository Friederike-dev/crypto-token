import React, { useState } from "react";
import { Principal } from "@dfinity/principal";
import { token } from "../../../declarations/token";

function Balance() {

  const [inputValue, setInput] = useState(""); //using the REACT useState hook to create a state variable called inputValue and a function to update it called setInput.
  const [balanceResult, setBalance] = useState("");
  const [cryptoSymbol, setSymbol] = useState("");
  const [isHidden, setHidden] = useState(true);

  async function handleClick() {
    console.log(inputValue);
    const principal = Principal.fromText(inputValue); // converting what the user entered to a Principal ID
    const balance = await token.balanceOf(principal);
    setBalance(balance.toLocaleString()); // converting the balance to a string and updating the balanceResult state variable with the new value
    setSymbol(await token.getSymbol()); 
    setHidden(false); // setting the hidden attribute of the p-tag to false, so that it is visible
  }


  return (
    <div className="window white">
      <label>Check account token balance:</label>
      <p>
        <input
          id="balance-principal-id"
          type="text"
          placeholder="Enter a Principal ID"
          value={inputValue}
          onChange={(e) => setInput(e.target.value)} // whenever the input changes, we update the inputValue state variable with the new value
        />
      </p>
      <p className="trade-buttons">
        <button
          id="btn-request-balance"
          onClick={handleClick}
        >
          Check Balance
        </button>
      </p>
      <p hidden={isHidden}>This account has a balance of {balanceResult} {cryptoSymbol}.</p>
    </div>
  ); // for the beginning we want the hidden attribute of the p-tag to be true.
}

export default Balance;
