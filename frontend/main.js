const info = require("../build/deployments/4/0x16bd00f54E11f6b671A0f6a96de20b000a875c71.json");
const abi = info["abi"];
const deployment = info["deployment"];
const contractAddress = deployment["address"];

const serverUrl = "https://rjfi3tltmxvh.usemoralis.com:2053/server";
const appId = "97wagl7iRrfE4SiHD8Y0aR77PrX5Btie0sisKP26";
Moralis.start({ serverUrl, appId });


async function connect() { 
  if (!Moralis.User.current()) {
    await Moralis.authenticate({ signingMessage: "Log in using Moralis"});
  }
  refresh();
}

async function disconnect() { 
    const user = Moralis.User.current();
    if (user) {Moralis.User.logOut();}
  }

async function initiateElection() {
  const numberCandidates = await getNumberCandidates();

  const writeOptionsInitiateElection = {
    contractAddress: contractAddress,
    functionName: "initiateElection",
    abi: abi,
  };
  const tx = await Moralis.executeFunction(writeOptionsInitiateElection);
  await tx.wait();

  removeVoteButtons(numberCandidates);

  await refresh();
  }

async function signupAsCandidate() {
  const writeOptionsSignupAsCandidate = {
    contractAddress: contractAddress,
    functionName: "signupAsCandidate",
    abi: abi,
  };
  
  const tx = await Moralis.executeFunction(writeOptionsSignupAsCandidate);
  await tx.wait();
  await refresh();
  }
  
async function vote(candidate) {
  const writeOptionsVote = {
    contractAddress: contractAddress,
    functionName: "vote",
    abi: abi,
    params: {candidate:candidate}
  };

  const tx = await Moralis.executeFunction(writeOptionsVote);
  await tx.wait();
  await refresh();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Secondary functions
  
async function refresh() {
  const numberCandidates = await getNumberCandidates();
  const [candidates, votes] = await getResults();

  for (let i = 0; i < numberCandidates; i++) {
    console.log("inside loop: ", numberCandidates);
     
    let btn = document.getElementById("vote-btn " + i);
    if (!btn) {btn = createVoteButton(i);}

    btn.innerHTML = "Vote " + candidates[i] + " Current score: " + votes[i];
    btn.onclick = async function () {await vote(candidates[i]);};
    document.body.appendChild(btn);
  }

}

function createVoteButton(index) {
  const btn = document.createElement("button");
  btn.type = "submit";
  btn.name = "vote-btn " + index;
  btn.id = "vote-btn " + index;
  return btn;
}

async function removeVoteButtons(numberCandidates) {
  for (let i = 0; i < numberCandidates; i++) {
    const elem = document.getElementById("vote-btn " + i);
    if (elem) {
      elem.parentNode.removeChild(elem);
    }
  }
}

async function getNumberCandidates() {
  const readOptionsNumberCandidates = {
    contractAddress: contractAddress,
    functionName: "getNumberCandidates",
    abi: abi,
  };

  let numberCandidates = await Moralis.executeFunction(readOptionsNumberCandidates);
  numberCandidates = numberCandidates.toNumber();
  console.log("Number candidates: ", numberCandidates);
  return numberCandidates;
}

async function getResults() {
  const readOptionsResults = {
    contractAddress: contractAddress,
    functionName: "getResults",
    abi: abi,
  };

  const [candidates, votes] = await Moralis.executeFunction(readOptionsResults);
  return [candidates, votes];

}


document.getElementById("connect-btn").onclick = connect;
document.getElementById("disconnect-btn").onclick = disconnect;
document.getElementById("initiate-btn").onclick = initiateElection;
//document.getElementById("refresh-btn").onclick = refresh;
document.getElementById("signup-btn").onclick = signupAsCandidate;
 
//<button id="refresh-btn"> Refresh </button>
