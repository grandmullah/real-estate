
var Interface = artifacts.require("./Interface.sol");
var Houses = artifacts.require("./Houses.sol");
var Etoken = artifacts.require("./EToken.sol");

contract ("Interface",function(accounts){
    it("have address of the other contracts",function(){
        return Interface.deployed().then(function(instance){
               Instance = instance;
            return Instance.HouseContract();
        }).then(function(re){
            assert.notStrictEqual(re,0x0);
            return Instance.EtokenContract();
        }).then(function(re){
              assert.notStrictEqual(re, 0x0);
        });
    });
     it("allows users to register",function(){
          return Interface.deployed().then(function (instance) {
             Instance =  instance;
             return Instance.register(accounts[1],"shiti","collins@gmail.com","collins",{from:accounts[2]});
          }).then(assert.fail).catch(function(error){
              assert(error.message.indexOf("revert")>=0,"should revert since accounts are not the same");
              return Instance.register(accounts[1], "shiti", "collins@gmail.com", "collins", { from: accounts[1] });
          }).then(function(receipts){
              return Instance.Users(accounts[1]);
          }).then(function(receipt){
              assert.equal(receipt.name,"collins","should save the anme collins to accounts 1");
              assert.equal(receipt.email, "collins@gmail.com", "should save the anme collins to accounts 1");
              assert.equal(receipt.registered, true, "should save the anme collins to accounts 1");
              assert.equal(receipt.password, "shiti", "should save the anme collins to accounts 1");
               return Instance.register(accounts[5], "shiti", "collins@gmail.com", "collins", {
               from: accounts[5]
               });
               }).then(function (receipts) {
               return Instance.registeredUsers(1);
           }).then(function(re){
              assert.equal(re, accounts[5], "should have pushed accounts1");
          });
     });
    it("allows users to login",function(){
          return Interface.deployed().then(function(instance){
              Instance= instance;
              return Instance.register(accounts[1], "shiti", "collins@gmail.com", "collins", { from: accounts[1] });
          }).then(function(receipt){
              return Instance.login("shiti",{from:accounts[3]});
          }).then(assert.fail).catch(function(error){
              assert(error.message.indexOf("revert")>=0,"shold revert when user is not registered");
                return Instance.register(accounts[3], "shiti", "collins@gmail.com", "collins", {
                    from: accounts[3]
                });
          }).then(function(re){
              return Instance.login("shiti", {
                  from: accounts[3]
              });
          }).then(function(re){
              assert.equal(re,true);
          });
    });
    it("should allow users yo rent rooms", async () =>{
            let instanceI = await Interface.deployed();
            let instanceH = await Houses.deployed();
            let instanceE = await Etoken.deployed();
            let better = web3.fromAscii("better");
            await instanceH.registerHouse(better, "kericho", "collins", "kempiski", {
                from: accounts[9]
            });
            await instanceH.registerRoom(better,1,"self","room3",{from:accounts[9]});
            await instanceH.registeredHouses(better);
            await instanceE.transfer(accounts[5],200,{from:accounts[0]});
           bal = await instanceI.rentRoom(better,1,50,{from:accounts[5]});
            await instanceE.balanceOf(accounts[5]);
           // bal = await instanceE.allowance(accounts[5],accounts[0]);
           // assert.strictEqual(bal,200,"sould have allowance");
           
    });
}); 