
var EToken = artifacts.require("EToken");

contract ("EToken", function(accounts){
   var Instance ; 
 it("sets state variables ",function(){
    return EToken.deployed().then(function(instance){
        Instance = instance;
      return Instance.name(); 
    }).then(function(name){
        assert.equal(name ,"EToken","etoken has correct name");
      return Instance.symbol();  
    }).then(function(symbol){
        assert.equal(symbol,"ETk","sets token symbol to ETk");
     
    });
 });
  it("sets total supply and allocates them  to token holder",function(){
     return EToken.deployed().then(function(instance){
         Instance=instance;
         return Instance.TotalSupply();
     }).then(function(deployedamount){
         assert.equal(deployedamount,"1000000","sets initialsupply to a million ");
         return Instance.BalanceOf(accounts[0]);
     }).then(function(tokenholderbalance){
         assert(tokenholderbalance.toNumber(),"1000000","sets the token holders amount to a million ");
     });
  });
  it("returns total supply of tokens ",function(){
      return EToken.deployed().then(function(instance){
          Instance = instance;
          return Instance.TotalSupply();
      }).then(function(totalsupply){
          assert.equal(totalsupply,"1000000","total supply is a million ");
      });
  });
  it("return tokens of a  particular account ", function(){
      return EToken.deployed().then(function(instance){
          Instance = instance;
          return Instance.BalanceOf(accounts[2]);
      }).then(function(balance){
          assert.equal(balance.toNumber(),"0" ,"returns zero balance for account 2 since  no token has been transfered to it");
      });
  });
   it("should be allow token holders transfer tokens",function(){
       return EToken.deployed().then(function(instance){
             Instance = instance;
             return Instance.transfer(accounts[3],10000000,{from:accounts[2]});
       }).then(assert.fail).catch(function(error){
             assert(error.message.indexOf("revert")>=0,"error message must contain revert if try to transfer more than what is in account");
             return Instance.transfer(accounts[2],1000,{from:accounts[0]});
       }).then(function(receipts){
              assert.equal(receipts.logs.length, 1,"has got only one log");
              assert.equal(receipts.logs[0].event,"Transfer","trigger transfer event");
              assert.equal(receipts.logs[0].args._value,  1000, " has argument to which token is being sent to");
              assert.equal(receipts.logs[0].args._from, accounts[0], " has argument to which token is being sent to");
              assert.equal(receipts.logs[0].args._to, accounts[2], " has argument to which token is being sent to");
            return Instance.BalanceOf(accounts[2]);
       }).then(function(balance){
             assert.equal(balance.toNumber(),"1000","shows it has added account 2 with the tokens");
             return Instance.BalanceOf(accounts[0]);
       }).then(function(balance){
             assert.equal(balance.toNumber(),"999000","should have  deducted ammount from th eacccout");
             return Instance.transfer.call(accounts[2],1000,{from: accounts[0]});
       }).then(function(success){
             assert.equal(success,true,"returns succeess on transfer");
       });
   });
   it(" sets  spender to withdraw fromm their account",function(){
       return EToken.deployed().then(function(instance){
          Instance = instance;
          return Instance.approve.call(accounts[4],1000,{from:accounts[0]});
       }).then(function(success){
           assert.equal(success,true,  "allowed to withdraw 1000 tokens ");
           return Instance.approve(accounts[3],1000,{from:accounts[0]});
       }).then(function(receipts){
            return Instance.allowance(accounts[0],accounts[3]);
       }).then(function(allowed){
           assert.equal(allowed.toNumber(),1000,"allowed to withdraw 100 tokens ");
           return Instance.approve(accounts[2],10000000,{from:accounts[5]});
       }).then(assert.fail).catch(function(error){
           assert(error.message.indexOf("revert")>=0,"should revert because there is no enough token in the account");
           return Instance.approve(accounts[3],100000,{from:accounts[0]});
       }).then(function(receipts){
           assert.equal(receipts.logs.length, 1, "has got only one log");
           assert.equal(receipts.logs[0].event, "Approval", " triggers  approval event");
          assert.equal(receipts.logs[0].args._value, 100000, " has argument value");
       });
   
   });
  
   it ("should allow delegated withdrawal ",function(){
       return EToken.deployed().then(function(instance){
           Instance = instance;
           return Instance.transfer(accounts[5],500,{from:accounts[0]});
       }).then(function(receipt){
           return Instance.approve(accounts[4],400,{from:accounts[5]});
       }).then(function(receipt){
           return Instance.transferFrom(accounts[5],accounts[3],600,{from:accounts[4]});
       }).then(assert.fail).catch(function(error){
           assert(error.message.indexOf("revert")>=0,"should revert if no enough token in account");
           return Instance.transferFrom(accounts[5],accounts[3],600,{from:accounts[4]});
       }).then(assert.fail).catch(function(error){
           assert(error.message.indexOf("revert")>=0,"should revertt if try to transfer is not enough than allocated");
            return Instance.transferFrom(accounts[5],accounts[3],300,{from:accounts[4]});
       }).then(function(receipts){
           assert.equal(receipts.logs.length, 1, "has got only one log");
           assert.equal(receipts.logs[0].event, "Transfer", " triggers  approval event");
           assert.equal(receipts.logs[0].args._value, 300, " has argument value");
           assert.equal(receipts.logs[0].args._from, accounts[5], " has argument to which token is being sent from");
           assert.equal(receipts.logs[0].args._to, accounts[3], " has argument to which token is being sent to");
           return Instance.balanceOf(accounts[5]);
       }).then(function(balance){
           assert.equal(balance.toNumber(),"200","should have deducted");
           return Instance.BalanceOf(accounts[3]);
       }).then(function(balance){
           assert(balance.toNumber(),"300","should have transfered token");
           return Instance.transferFrom.call(accounts[5],accounts[3],50,{from:accounts[4]});
       }).then(function(success){
           assert.equal(success,true,"should return true on complete transaction");
           return Instance.allowance(accounts[5],accounts[4]);
       }).then(function(allowed){
           assert.equal(allowed.toNumber(),"100","should deduct the amout spender can still deduct");
       });
   });
});