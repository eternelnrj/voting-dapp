import {votingInfo} from "./contracts_and_abi.js"
import {vote} from "./main.js"


async function refresh() {
  const numberCandidates = await getNumberCandidates();
  const [candidates, votes] = await getResults();

  for (let i = 0; i < numberCandidates; i++) {
    let btn = document.getElementById("vote-btn " + i);
    if (!btn) {btn = createVoteButton(i); console.log("button " + i + " created")}

    btn.innerHTML = "Vote " +  "<span style='color: white;'>" + candidates[i] + "</span>" +
    "<br/>" + "Current score: " + "<span style='color: brown;'>" + votes[i] + "</span>";
    btn.style=`background-color:#767275; left: 320px; top: ${350 + i * 50}px; position: absolute; width:500px;`
    btn.onclick = async function () {await vote(candidates[i]);};

    document.body.appendChild(btn);
  }
}

function createVoteButton(index) {
  const btn = document.createElement("button");
  btn.type = "button";
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
    contractAddress: votingInfo["contractAddress"],
    functionName: "getNumberCandidates",
    abi: votingInfo["abi"],
  };
  
  const numberCandidates = await Moralis.executeFunction(readOptionsNumberCandidates);
  return numberCandidates;
}

async function getResults() {
  const readOptionsResults = {
    contractAddress: votingInfo["contractAddress"],
    functionName: "getResults",
    abi: votingInfo["abi"],
  };
  
  const [candidates, votes] = await Moralis.executeFunction(readOptionsResults);
  return [candidates, votes];
}


export {refresh, createVoteButton, removeVoteButtons, getNumberCandidates, getResults};