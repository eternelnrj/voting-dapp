// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract Vote {
    uint256 public constant MAX_NUMBER_CANDIDATES = 5;
    uint256 public constant LENGTH_REGISTRATION_IN_BLOCKS = 20;
    uint256 public constant LENGTH_VOTING_IN_BLOCKS = 50;

    uint256 public endRegistration = 0;
    uint256 public endVoting = 0;

    address[] voters;
    address[] candidates;

    mapping(address => bool) accountToHasVoted;
    mapping(address => bool) accountToRegistration;
    mapping(address => uint256) public accountToVotesReceived;

    function initiateElection() public {
        require(block.number > endVoting, "Patience, the current voting is not over.");

        endRegistration = block.number + LENGTH_REGISTRATION_IN_BLOCKS;
        endVoting = endRegistration + LENGTH_VOTING_IN_BLOCKS;

        resetMappings();
        resetArrays();
    }

    function signupAsCandidate() public {
        require(block.number <= endRegistration, "You can no longer register as a candidate for this election.");
        require(candidates.length < MAX_NUMBER_CANDIDATES, "Maximum number of candidates reached for this election.");
        require(msg.sender == tx.origin, "Only externally owned accounts have the right register as candidates.");
        require(!accountToRegistration[msg.sender], "You are already registered as a candidate for this election.");
        
        accountToRegistration[msg.sender] = true;
        candidates.push(msg.sender);
    }

    function vote(address candidate) public {
        require(block.number > endRegistration, "Patience, the registration period is not over!"); 
        require(block.number <= endVoting, "The vote is over."); 
        require(msg.sender == tx.origin, "Only externally owned accounts have the right to vote.");
        require(accountToRegistration[candidate], "This address is not registered as a candidate."); 
        require(!accountToHasVoted[msg.sender], "You have already voted.");

        accountToHasVoted[msg.sender] = true;
        accountToVotesReceived[candidate] += 1;
        voters.push(msg.sender);
    }

    function getResults() public view returns (address[MAX_NUMBER_CANDIDATES] memory, uint256[MAX_NUMBER_CANDIDATES] memory) {
        address[MAX_NUMBER_CANDIDATES]  memory candidates_;
        uint256[MAX_NUMBER_CANDIDATES]  memory votes_;

        for (uint256 i=0; i < candidates.length; i++) {
            candidates_[i] = candidates[i];
            votes_[i] = accountToVotesReceived[candidates[i]];
        }

        return (candidates_, votes_);
    }

    function getNumberCandidates() public view returns (uint256) {
        return candidates.length;
    }

    function resetMappings() internal {
        for (uint256 i=0; i < candidates.length; i++) {
            accountToRegistration[candidates[i]] = false;
            accountToVotesReceived[candidates[i]] = 0;
        }
            
        for (uint256 i=0; i < voters.length; i++) {
            accountToHasVoted[voters[i]] = false;
        }
    }

    function resetArrays() internal {
        delete voters;
        delete candidates;
    }

}
