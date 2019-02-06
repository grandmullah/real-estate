var Houses = artifacts.require("./Houses.sol");
var Web3 = require('web3');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

contract ("Houses",function(accounts){
    it("allows users to register homes",function(){
        return Houses.deployed().then( function(instance){
            Instance = instance;
             gateway = web3.fromAscii("gateway");
            return Instance.registerHouse(gateway, "kericho", "collins", "abno", {
                from: accounts[0]
            });
        }).then(function(re){
            return Instance.registeredHouses(gateway);
        }).then(function(house){
            assert.equal(house.company,"abno","assert abno has been registered");
            assert.strictEqual(house.owneradd,accounts[0], "assert abno has been registered");
            return Instance.houseNames(0);
        }).then(function(length){
            assert.equal(length, 0x6761746577617900000000000000000000000000000000000000000000000000, "1 should be added to arry");
        });
   
    });
    it("allows users to register rooms",function(){
        return Houses.deployed().then(function(instance){
            instance = Instance;
             return Instance.registerHouse(gateway, "kericho", "collins", "abno", {
                 from: accounts[0]
             });
        }).then(function(re){
             return Instance.registerRoom(gateway, 1, "self contained", "room one", {
                 from: accounts[0]
             });
        }).then(function(re){
            return Instance.registeredRooms(gateway,1);
        }).then(function(receipts){
            assert.strictEqual(receipts.facilities,"self contained");
            assert.strictEqual(receipts.name, "room one");
           
        });

    });
    it("should return registered houses",async () =>  {
        let instance = await Houses.deployed();
        let gatewa = web3.fromAscii("gatewa");
        await instance.registerHouse(gatewa, "kericho", "collins", "abno", {
            from: accounts[0]
        });
        array = await instance.registeredhouses();
        let gate = web3.toUtf8(array[2]);
        assert.strictEqual(gate,"gatewa", "should return single array");

        rooms = await instance.registeredhousesRooms(array[1]);
        assert.strictEqual(rooms[0].toNumber(),1,"should have 1");
    });
});