import Principal "mo:base/Principal";
// principal type: it is a type for a user-defined type
// with a principal id we can assign tokens to a user/owner

import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";

actor Token {

Debug.print("starting");

    let owner : Principal = Principal.fromText("vmxjc-bwydw-5xadp-sd45n-dmbzw-zkgkr-2jxp3-we64s-nwq2x-2d7si-jqe") : Principal; // type of principal
    // we get the text and convert it to a principal

    let totalSupply : Nat = 1000000000; // 1 billion tokens
    let symbol : Text = "jeddis";


    

    //then we create a ledger to store the id of the particular user or canister and the amount of tokens that they possess
    // with the attributes we can assign the datatype for the key and the value
    // the key is the principal id of the user and the value is the amount of tokens that they possess
    // then with the () we initialize the ledger and provide 3 inputs:
    // first the initial size of the ledger (HashMap) which we set to 1
    // second the function to compare the keys (Principal.equal) which is a function that checks if two principals are equal to check if the user is already in the ledger
    // third the function to hash the keys (Principal.hash) which is a function that hashes the principal id of the user to store it in the ledger
    private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
    if (balances.size() < 1) {
        balances.put(owner, totalSupply);   // just in case someone else downloads the code and deploys it
        // then we can add our owner to the ledger as our first entry
    }


    private stable var balanceEntries: [(Principal, Nat)] = []; // this is a stable variable that stores the balance entries of the users even during an update with dfx deploy
    // it takes a lot of computing power to store the data in a stable variable array. that is why we use a HashMap for "balances"
    // so we use this stable variable to store the balance just if we do an update to the canister
    // the following functions will be triggered just before and after the upgrade of the canister
    system func preupgrade() {
        balanceEntries := Iter.toArray(balances.entries()); //the entrries method will iterate through the items of the HashMap and return something that can be turned into an Array
    };
    system func postupgrade() {
        balances := HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 1, Principal.equal, Principal.hash);
        if (balances.size() < 1) {
            // then we can add our owner to the ledger as our first entry
            // in .put we supply a key and a value and it will overwrite the value if the key already exists
            balances.put(owner, totalSupply);
        }
    };

    public query func balanceOf(who : Principal) : async Nat {
        // this function returns the balance of the user asynchronously as a Nat
        // we check if the user is in the ledger and return the value
        // if the user is not in the ledger we return 0
        let balance : Nat = switch (balances.get(who)) {
            case null 0; // if the user is not in the ledger we return 0
            case (?balance) balance; // if the user is in the ledger we return the value
        };
        return balance;

    };

    public query func getSymbol() : async Text {
        return symbol;
    };

// with a shared (msg) function we can identify the caller of the function
    public shared (msg) func payOut() : async Text {
        Debug.print(debug_show (msg.caller)); //this gets printed in the terminal where i entered dfx start

        if (balances.get(msg.caller) == null) {
            //does the user key already have a balance?
            let amount = 10000;


            // here we can call the transfer function from within the actor
            // that way the caller will be this canister and not the frontend user
            // so the tokens will be transferred from the canister to the user (msg.caller)
            let result = await transfer(msg.caller, amount); 


            return result;
        } else {
            // if the user is already in the ledger we return an error message
            return "User already has tokens";
        }

    };

    // in the transfer function we need two parameters: who we are going to transfer to and how much.
    public shared (msg) func transfer(to : Principal, amount : Nat) : async Text {
        
        // whoever triggers the function is going to be the one who is going to pay out (the frontend user)
        let caller = msg.caller;
        let fromBalance = await balanceOf(msg.caller);

        if (fromBalance > amount) {
            
            let newFromBalance : Nat = fromBalance - amount; // this is the new balance of the user who is sending the tokens
            balances.put(caller, newFromBalance); // this updates the balance of the user who is sending the tokens
            
            let toBalance : Nat = await balanceOf(to);
            let newToBalance : Nat = toBalance + amount; // this is the new balance of the user who is receiving the tokens
            balances.put(to, newToBalance); // this updates the balance of the user who is receiving the tokens
            return "The amount has been transferred";
        } else {
            return "Insufficient funds";
        }
        
    };

};
