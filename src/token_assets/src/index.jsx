import ReactDOM from 'react-dom'
import React from 'react'
import App from "./components/App";
import { AuthClient } from "@dfinity/auth-client";

const init = async () => {


  const authClient = await AuthClient.create();

  if (await authClient.isAuthenticated()) {
    handleAuthenticated(authClient);
  } else {
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: () => {
        handleAuthenticated(authClient);
      },
      onError: (err) => {
        console.error(err);
      },
    });
  }
}

async function handleAuthenticated(authClient) {
  const identity = await authClient.getIdentity();
  const userPrincipal = identity._principal.toString();
  console.log("User Principal ID: ", userPrincipal);
  ReactDOM.render(<App loggedInPrincipal={userPrincipal}/>, document.getElementById("root"));
  console.log("Logged in!");
};

init();


