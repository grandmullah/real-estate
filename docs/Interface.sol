pragma solidity ^0.5.0;
import './EToken.sol';
import './Houses.sol';

contract Interface {

    address[] public registeredUsers;
    Houses public HouseContract;
    EToken public EtokenContract;
    uint256 public roomPrice;
    address owner;
    

    struct User {
        string name;
        string email;
        string password;
        bool  registered;
    }

    mapping(address=>User)public Users;
    constructor (Houses _HouseContract ,EToken _EtokenContract,uint256 _price) public{
        HouseContract = _HouseContract;
        EtokenContract =  _EtokenContract;
        roomPrice = _price;
    }

   

    function register(address _user, string memory _password,string memory _email, string memory _name)public returns(bool success) {
        address[] storage registed = registeredUsers;
        User storage user = Users[msg.sender];
        registed.push(msg.sender);
        require(!user.registered); 
        require(msg.sender == _user);

        user.password = _password;
        user.name = _name;
        user.email = _email;
        user.registered = true;
        return true;
    } 

     function login(string memory _password)public view returns(bool ) {
        User storage user = Users[msg.sender];
        require(user.registered);
         return (keccak256(abi.encodePacked(user.password)) == keccak256(abi.encodePacked(_password)));
         

     }
     function rentRoom(bytes32 _housename,uint256 _roomnumber, uint256 _amount)public returns(bool success){
         require(_amount>=roomPrice);
         //require(HouseContract.registeredHouses(_housename).registered);
         EtokenContract.sendFromTo(address(this),msg.sender, _amount);
         HouseContract.updateRentRoom(_housename,_roomnumber);
         return true;
     }
     function usersdipslay()public view returns(address[] memory) {
         return registeredUsers;
     }
}