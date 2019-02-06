var EToken =artifacts.require("./EToken.sol");
// var Registration = artifacts.require("./registration.sol");
 var Houses = artifacts.require("./Houses.sol");
 var Interface = artifacts.require("./Interface.sol");

module.exports = function(deployer){
    // deployer.deploy(EToken,1000000);
    // deployer.deploy(Interface);
    // deployer.deploy(Houses);
     deployer.deploy(EToken,1000000).then(function(){
        return deployer.deploy(Houses);
    }).then(function(){
        return deployer.deploy(Interface, Houses.address,EToken.address,20);
    });
};