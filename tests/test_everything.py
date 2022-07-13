import pytest
from brownie import accounts, Vote, chain
import brownie


@pytest.fixture(scope="module")
def vote():
    return Vote.deploy({"from": accounts[0]})

def test_initiation(vote):
    vote.initiateElection()

    end_registration = vote.endRegistration()
    end_voting = vote.endVoting()

    assert end_registration < end_voting
    
def test_signup(vote):
    vote.signupAsCandidate({'from': accounts[0]})
    vote.signupAsCandidate({'from': accounts[1]})
    vote.signupAsCandidate({'from': accounts[2]})

    number_candidates = vote.getNumberCandidates()
    assert number_candidates == 3

    candidates, _ = vote.getResults()
    assert set(accounts[:3]) == set(candidates[:3])

def test_vote(vote):
    candidates, votes = vote.getResults()
    for i in range(3):
        assert votes[i] == 0

    length_registration = vote.LENGTH_REGISTRATION_IN_BLOCKS()
    chain.mine(length_registration + 1)

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

def test_initiation_before_voting_ends(vote):
    with brownie.reverts("Patience, the current voting is not over."):
        vote.initiateElection()
    

def test_signup_after_registration_ends(vote):
    with brownie.reverts("You can no longer register as a candidate for this election."):
        vote.signupAsCandidate({'from': accounts[3]})
