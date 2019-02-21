App = {
 web3Provider:"null",
 contracts:{},
 accounts:"0x0",
 loggedin:false,


 init: function() {
      console.log("app.initialized");
      return App.initweb3();
 },

    initweb3: function() {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(App.web3Provider);
        } else {
            // set the provider you want from Web3.providers
            App.web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
            web3 = new Web3(App.web3Provider);
        }
        return App.initcontracts();
    },
    initcontracts: function(){
       $.getJSON("EToken.json",
           function (etoken) {
           App.contracts.EToken = TruffleContract(etoken);
           App.contracts.EToken.setProvider(App.web3Provider);
            }).done(function(){
         $.getJSON("Houses.json",
             function (house) {
              App.contracts.Houses = TruffleContract(house); 
              App.contracts.Houses.setProvider(App.web3Provider);
              App.contracts.Houses.deployed().then(function(instance){
                console.log(instance.address);
              });
            
        }).done(function(){
            $.getJSON("Interface.json", 
                function (interface) {
                   App.contracts.Interface = TruffleContract(interface);
                   App.contracts.Interface.setProvider(App.web3Provider);
                   App.contracts.Interface.deployed().then(function (instance) {
                       console.log(instance.address);
                        return App.Render();
                   });
                  
                });
        });
        });
    },
    Render:function(){
        web3.eth.getCoinbase(function(err,res){
            if(err === null){
                App.accounts = res;
            }
        });
        
        App.contracts.EToken.deployed().then(function(instance){
            Instance = instance;
            return Instance.balanceOf(App.accounts);
        }).then(function(bal){
            console.log(bal.toNumber());
            $("#tokenbal").html( bal.toNumber());

        });
        App.contracts.Interface.deployed().then(function(instance){
            return instance.Users(App.accounts);
        }).then(function(user){
            console.log(user);
            $("#semail").html(user[1] );
            $("#sname").html(user[0]);
            $("#accadd").html(App.accounts);
        });
        App.contracts.Interface.deployed().then(function(instance) {
            return instance.usersdipslay();
          }).then(function(users) {
         
              for (var i = 0; i < users.length;i++ ){
                  $("#ownerhouses").append(users[i] +"<br>");
                
              }
          
          });
        App.contracts.Houses.deployed().then(function(instance){
          return instance.registeredhouses();
        }).then(function(houses){
          
           // console.log(houses);
            for (var i = 0; i < houses.length; i++) {
                $("#displayhouses").append(web3.toAscii(houses[i])+ "<br>");
               

            }
            // var j = 0;

            // while(j < houses.length){
            //     $("#displayhouses").html(web3.toAscii(houses[j]));
            //     j ++;
            //     console.log(houses[1]);
            // }
        });
        App.contracts.Houses.deployed().then(function (instance) {
            Instance = instance;
            return Instance.registeredhouses();
        }).then(function (house) {
            for(var p= 0;p<house.length;p++){
                var k = house[p];
                console.log(house[p]);
                return Instance.registeredhousesRooms(k);
            }
        }).then(function(rooms){
            console.log(rooms);
            for (var i = 0; i < rooms.length; i++) {
                $("#displayrooms").append(rooms[i] + "<br>");
          }
        });


    },
    Registration: function(){
        var Name = $("#name").val();
        var Ethadd = $("#ethadd").val();
        var Email = $("#email").val();
        var Password = $("#password").val();
        var cpassword = $("#cpassword").val();

        var namereg = /^[a-zA-Z]+$/;
        var passEx = /^[a-zA-Z0-9]+$/;
       
        var issaaddress = web3.isAddress(Ethadd);
        if (!Name.match(namereg)) {
          //  $("#name").closest(".form-control").addClass("has-error");
            $("#name").effect("shake");
        }else if(!issaaddress) {
            $("#ethadd").effect("shake");
        }else if(!Password.match(passEx)){
            $("#password").effect("shake");
        } else if (!Password.match(cpassword)) {
            $("#cpassword").effect("shake");
        }else {
        App.contracts.Interface.deployed().then(function(instance){
            return instance.register(Ethadd, Password, Email, Name, {
                from: App.accounts,
                gas: 500000
            });
        }).then(function(receipts){
            console.log(receipts);
            alert("successfully registered you can login in now");
            $("#userregistration").modal('hide');
            $("#userlogin").modal({
                backdrop: "static"
            });
        });
    }
    },

    Login:function(){

        var loginpassword = $("#pass").val();
        
        App.contracts.Interface.deployed().then(function(instance){
            Instance = instance;
            return Instance.login.call(loginpassword,{from:App.accounts,gas:500000});
        }).then(function(receipts){
            if(receipts){
               App.loggedin = true;
               $("#homepage").show();
                $("#userlogin").modal("hide");
            }else{
                $("#pass").effect("shake");
                $("#p1").html("wrong password");
            }
        });
    },
    registerHouse: function(){
        var Hname = $("#hname").val();
        var Location = $("#location").val();
        var Owner = $("#owner").val();
        var Company = $("#company").val();
        var name = /^[a-zA-Z]+$/;
         if(!Hname.match(name)){
             $("#hname").effect("shake");
         } else if (!Location.match(name)) {
             $("#location").effect("shake");
         } else if (!Owner.match(name)) {
             $("#owner").effect("shake");
         } else if (!Company.match(name)) {
             $("#company").effect("shake");
         } else {
        var HOname = web3.fromAscii(Hname);
        App.contracts.Houses.deployed().then(function(instance){
            Instance = instance;
            return Instance.registerHouse(HOname, Location, Owner, Company, {
                from: App.accounts,
                gas: 500000
            });
        }).then(function(re){
            console.log(re);
            alert("you have successfully registered"+Hname);
            $("#houseregistration").hide();
            $("#inside").show();

        });
    }
    },
    registerRoom:function(){
        var HName = $("#Hname").val();
        var Rnumber = $("#rnumber").val();
        var Facilities =$("#facilities").val();
        var name = /^[a-zA-Z]+$/;
        var namee = /^[0-9]+$/;
        var Room = $("#roomname").val();
        if (!HName.match(name)) {
            $("#Hname").effect("shake");
        } else if (!Facilities.match(name)) {
            $("#facilities").effect("shake");
        } else if (!Room.match(name)) {
            $("#roomname").effect("shake");
        } else if(!Rnumber.match(namee)){
            $("#rnumber").effect("shake");
        }else {
        App.contracts.Houses.deployed().then(function(instance){
            Instance = instance;
            return Instance.registerRoom(HName,Rnumber,Facilities,Room,{from:App.accounts,gas:500000});
        }).then(function(re){
            console.log(re);
            alert("you have succesfully registered");
        });
    }

    },
    TransferToken: function(){
        var to = $("#to").val();
        var tokenamount = $("#tokenamount").val();
        var issaaddress = web3.isAddress(to);
        if (!issaaddress){
             alert("invalid address");
        }else{
        App.contracts.EToken.deployed().then(function(instance){
            Instance = instance;
            return Instance.transfer(to,tokenamount,{from:App.accounts,gas:500000});
        }).then(function(receipts){
            console.log(receipts);
            alert("you have succesfully transfered"+tokenamount+"to"+to);
        });
    }
    },
    CheckBalance: function(){
        var accountbal = $("#accountof").val();
        var issaaddress = web3.isAddress(accountbal);
        if (!issaaddress) {
            alert("invalid address");
        } else {
        App.contracts.EToken.deployed().then(function(instance){
            Instance = instance;
            return Instance.BalanceOf(accountbal,{from:App.accounts,gas:500000});
        }).then(function(re){
            balance = re.toNumber();
            console.log(balance);
            $("#accountofbalance").html(balance + "tokens");
        });
    }
    },
    RentRoom:function(){
        var house = $("#housenumber").val();
        var room = $("#roomnumber").val();
        var rent = $("#rentamount").val();
        App.contracts.Interface.deployed().then(function (instance) {
            Instance = instance;
            return Instance.rentRoom(house,room,rent, { from: App.accounts, gas: 500000 });
        }).then(function (re) {
            if(re){
                alert("you have successfully booked rooom");
            }else{
                alert("room cant be booked now doesnt exit or already booked");
            }
        });
    }  
};
$(document).ready(function(){
   App.init();
   $("#homepage").hide();
    $("#userlogin").modal({ backdrop: "static" });
    $("#signup").click(function(){
        signup();
      //  $("#homepage").hide();
        // $("#userregistration").modal('hide');
        // $("#userlogin").modal({ backdrop: "static" });
    });
  function signup(){
      $("#userlogin").modal("hide");
      $("#userregistration").modal({ backdrop: "static" });
  }
  $("#homereg").click(function(){
      $("#inside").hide();
      $("#houseregistration").show();
      $("#roomregistration").hide();
      $("#tokensform").hide();
      $("#balanceform").hide();
  });
  $("#roomreg").click(function(){
      $("#inside").hide();
      $("#houseregistration").hide();
      $("#roomregistration").show();
      $("#tokensform").hide();
      $("#balanceform").hide();
      $("#Rentform").hide();

      
  });
    $("#TransferToken").click(function () {
      $("#inside").hide();
      $("#houseregistration").hide();
      $("#roomregistration").hide();
        $("#tokensform").show();
        $("#balanceform").hide();
        $("#Rentform").hide();

  });
    $("#checkbalance").click(function () {
        $("#inside").hide();
        $("#houseregistration").hide();
        $("#roomregistration").hide();
        $("#tokensform").hide();
        $("#balanceform").show();
        $("#Rentform").hide();

    });
    $("#rentroom").click(function () {
        $("#inside").hide();
        $("#houseregistration").hide();
        $("#roomregistration").hide();
        $("#tokensform").hide();
        $("#balanceform").hide();
        $("#Rentform").show();
    
    });
});
