import {votingInfo} from "./contracts_and_abi.js"
import {removeVoteButtons, getNumberCandidates, refresh} from "./secondary_functions.js"

const moralisInfo = require("./.config.json");

const serverUrl = moralisInfo["serverUrl"];
const appId = moralisInfo["appId"];
Moralis.start({ serverUrl, appId });

if (Moralis.User.current()){ Moralis.User.logOut(); };

async function connect() { 
  if (!Moralis.User.current()) {
    await Moralis.authenticate({ signingMessage: "Log in using Moralis" });
  }
  await refresh();
}

async function initiateElection() {
  const writeOptionsInitiateElection = {
    contractAddress: votingInfo["contractAddress"],
    functionName: "initiateElection",
    abi: votingInfo["abi"],
  };

  const numberCandidates = await getNumberCandidates();

  const tx = await Moralis.executeFunction(writeOptionsInitiateElection);
  await tx.wait();
  removeVoteButtons(numberCandidates);
}

async function signupAsCandidate() {
  const writeOptionsSignupAsCandidate = {
    contractAddress: votingInfo["contractAddress"],
    functionName: "signupAsCandidate",
    abi: votingInfo["abi"],
  };
  
  const tx = await Moralis.executeFunction(writeOptionsSignupAsCandidate);
  await tx.wait();
  await refresh();
}

async function vote(candidate) {
  const writeOptionsVote = {
    contractAddress: votingInfo["contractAddress"],
    functionName: "vote",
    abi: votingInfo["abi"],
    params: {candidate:candidate}
  };
  
  const tx = await Moralis.executeFunction(writeOptionsVote);
  await tx.wait();
  await refresh();
}


document.getElementById("connect-btn").onclick = connect;
document.getElementById("initiate-btn").onclick = initiateElection;
document.getElementById("signup-btn").onclick = signupAsCandidate;
 
export {vote};