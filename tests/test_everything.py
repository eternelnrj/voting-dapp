import pytest
from brownie import accounts, Vote, chain, web3

@pytest.fixture(scope="module")
def vote(Vote, accounts):
    return Vote.deploy({"from": accounts[0]})


def test_initiation(vote, accounts):
    vote.initiateElection()
    vote.signupAsCandidate({'from': accounts[0]})

    candidates, votes = vote.getResults()
    number_candidates = vote.getNumberCandidates()

    assert votes[0] == 0
    assert number_candidates == 1
    

def test_signup(vote, accounts):
    vote.signupAsCandidate({'from': accounts[1]})
    vote.signupAsCandidate({'from': accounts[2]})

    number_candidates = vote.getNumberCandidates()
    assert number_candidates == 3

    candidates, votes = vote.getResults()
    registered_candidates = set(candidates[:3])
    count = 0

    for i in range(3):
        if accounts[i] in registered_candidates:
            count += 1

    assert count == number_candidates


    for i in range(3):
        assert votes[i] == 0

    
def test_vote(vote, accounts):
    chain.mine(25)

    vote.vote(accounts[0], {'from': accounts[3]})
    vote.vote(accounts[0], {'from': accounts[4]})
    vote.vote(accounts[1], {'from': accounts[5]})

    candidates, votes = vote.getResults()

    for i in range(3):
        if candidates[i] == accounts[0]:
            assert votes[i] == 2
        elif candidates[i] == accounts[1]:
            assert votes[i] == 1
        else:
            assert votes[i] == 0