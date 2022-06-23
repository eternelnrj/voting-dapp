from scripts.helpful_scripts import get_account
from brownie import Vote 


def main():
    account = get_account(index=None) #index=None for deployment on a public blockchain
    vote = Vote.deploy({"from": account})

