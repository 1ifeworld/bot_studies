// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import {IdRegistry} from "imp/IdRegistry.sol";
import {NodeRegistry} from "imp/NodeRegistry.sol";
import {DelegateRegistry} from "imp/DelegateRegistry.sol";
import {AttestationRegistry} from "imp/AttestationRegistry.sol";

contract ImpSetupScript is Script {

    IdRegistry public idRegistry;
    NodeRegistry public nodeRegistry;
    DelegateRegistry public delegateRegistry;    
    AttestationRegistry public attestationRegistry;    
    
    function setUp() public {}

    function run() public {
        bytes32 privateKeyBytes = vm.envBytes32("PRIVATE_KEY");
        uint256 deployerPrivateKey = uint256(privateKeyBytes);

        vm.startBroadcast(deployerPrivateKey);

        nodeRegistry = new NodeRegistry();
        idRegistry = new IdRegistry();
        delegateRegistry = new DelegateRegistry(address(idRegistry));
        attestationRegistry = new AttestationRegistry();

        vm.stopBroadcast();
    }
}

// ======= DEPLOY SCRIPTS =====

// source .env
// forge script script/ImpSetup.s.sol:ImpSetupScript -vvvv --rpc-url $RPC_URL --broadcast --verify --verifier-url https://api-goerli-optimistic.etherscan.io/api
// forge script script/ImpSetup.s.sol:ImpSetupScript -vvvv --rpc-url $RPC_URL --broadcast --verify --verifier-url https://api-optimistic.etherscan.io/api
// forge script script/ImpSetup.s.sol:ImpSetupScript -vvvv --rpc-url $RPC_URL --broadcast --verify --verifier-url https://api.arbiscan.io/api
// forge script script/ImpSetup.s.sol:ImpSetupScript -vvvv --rpc-url $RPC_URL --broadcast --verify --verifier-url https://api-goerli.arbiscan.io/api
// forge script script/ImpSetup.s.sol:ImpSetupScript -vvvv --rpc-url $RPC_URL --broadcast --gas-estimate-multiplier 200 --verify --verifier-url https://api-nova.arbiscan.io/api
// forge script script/ImpSetup.s.sol:ImpSetupScript -vvvv --broadcast --fork-url http://localhost:8545