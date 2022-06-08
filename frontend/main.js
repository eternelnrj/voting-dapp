const info = require("../build/deployments/0x93d25DC2b079e13463022d8250990467714d4293.json");
const abi = info["abi"];
const deployment = info["deployment"];
let alreadyDone = false;

const serverUrl = "https://rjfi3tltmxvh.usemoralis.com:2053/server";
const appId = "97wagl7iRrfE4SiHD8Y0aR77PrX5Btie0sisKP26";
const contractAddress = deployment["address"];

Moralis.start({ serverUrl, appId });


async function connect() { 
    if (!Moralis.User.current()) {
      await Moralis.authenticate({
        signingMessage: "Log in using Moralis",
      });
    }
    let user = Moralis.User.current();
    document.getElementById("user").innerHTML  = "User: " + user.get("ethAddress");
  }


async function disconnect() { 
    let user = Moralis.User.current();

    if (user)
    { 
      Moralis.User.logOut();
    }

  }
  

async function refresh() {

    const readOptionsNumberCandidates = {
        contractAddress: contractAddress,
        functionName: "getNumberCandidates",
        abi: abi,
      };
    const readOptionsResults = {
        contractAddress: contractAddress,
        functionName: "getResults",
        abi: abi,
      };

    const numberCandidates = await Moralis.executeFunction(readOptionsNumberCandidates);
    const [candidates, votes] = await Moralis.executeFunction(readOptionsResults);

    if (alreadyDone) {
      for (let i = 0; i < numberCandidates; i++) {

        var elem = document.getElementById("vote-btn " + i);
        elem.parentNode.removeChild(elem);
      }

    }
    

    for (let i = 0; i < numberCandidates; i++) {
        let btn = document.createElement("button");
        btn.innerHTML = "Vote " + candidates[i] + " Current score: " + votes[i];
        btn.type = "submit";
        btn.name = "vote-btn " + i;
        btn.id= "vote-btn " + i;

        const readOptionsVote= {
            contractAddress: contractAddress,
            functionName: "vote",
            abi: abi,
            params:  {candidate : candidates[i]}
          };

        btn.onclick = async function () {
          await vote(candidates[i]);
        };  
        document.body.appendChild(btn);

        }
        alreadyDone = true;

    }   



async function initiateElection() {

    const readOptionsInitiateElection = {
        contractAddress: contractAddress,
        functionName: "initiateElection",
        abi: abi,
    };

    const numberCandidates = await Moralis.executeFunction(readOptionsNumberCandidates);
    for (let i = 0; i < numberCandidates; i++) {

      var elem = document.getElementById("vote-btn " + i);
      elem.parentNode.removeChild(elem);
    }
    await Moralis.executeFunction(readOptionsInitiateElection);

    await refresh();

 }


async function signupAsCandidate() {
    const readOptionsSignupAsCandidate = {
        contractAddress: contractAddress,
        functionName: "signupAsCandidate",
        abi: abi,
    };

    await Moralis.executeFunction(readOptionsSignupAsCandidate);
    await refresh();

}


 
async function vote(candidate) {
    const readOptionsVote = {
        contractAddress: contractAddress,
        functionName: "vote",
        abi: abi,
        params: { candidate : candidate}
    };

    await Moralis.executeFunction(readOptionsVote);
    await refresh();



}


document.getElementById("connect-btn").onclick = connect;
document.getElementById("disconnect-btn").onclick = disconnect;
document.getElementById("initiate-btn").onclick = initiateElection;
document.getElementById("refresh-btn").onclick = refresh;
document.getElementById("signup-btn").onclick = signupAsCandidate;
 
