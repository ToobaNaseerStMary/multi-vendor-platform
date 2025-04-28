// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Escrow {
    address public buyer;
    address payable public seller;
    address public admin;
    uint256 public amount;
    bool public isDelivered;
    bool public isDisputed;

    constructor(address _buyer, address payable _seller, uint256 _amount, address _admin) {
        buyer = _buyer;
        seller = _seller;
        amount = _amount;
        admin = _admin;
        isDelivered = false;
        isDisputed = false;
    }

    function deposit() public payable {
        require(msg.sender == buyer, "Only buyer can deposit funds");
        require(msg.value == amount, "Incorrect amount");
    }

    function confirmDelivery() public {
        require(msg.sender == buyer, "Only buyer can confirm delivery");
        require(!isDisputed, "Cannot confirm a disputed transaction");
        isDelivered = true;
        seller.transfer(amount);
    }

    function raiseDispute() public {
        require(msg.sender == buyer, "Only buyer can raise a dispute");
        require(!isDelivered, "Cannot dispute after delivery");
        isDisputed = true;
    }

    function resolveDispute(bool releaseFunds) public {
        require(msg.sender == admin, "Only admin can resolve disputes");
        require(isDisputed, "No dispute to resolve");

        if (releaseFunds) {
            seller.transfer(amount);
        } else {
            payable(buyer).transfer(amount);
        }

        isDisputed = false;
    }
}
