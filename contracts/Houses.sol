pragma solidity ^0.5.0;

contract Houses {
    struct House {
        bool registered;
        address owneradd;
        string location;
        string owner;
        string company;
        uint256[] rooms;
    }
    bytes32[] public  houseNames;
     mapping(bytes32=>House)public registeredHouses;
     mapping(bytes32=>mapping(uint256=>Rooms)) public registeredRooms;
     mapping(address=>bytes32[])public ownerHouse;

    struct Rooms {
        bool registered;
        string facilities;
        string name;
        bool rented;
    }

    function registerHouse(bytes32   _housename, string memory _location, string memory _owner,string memory _company) public returns(bool success) {
            bytes32[] storage housen = houseNames;   
            House storage house = registeredHouses[_housename];
            bytes32[] storage ownerh = ownerHouse[msg.sender];
            house.owneradd = msg.sender;
            house.location = _location;
            house.owner = _owner;
            house.company = _company;
            house.registered = true; 
            housen.push(_housename);
            ownerh.push(_housename);
            return true;
        
    }

    function registerRoom( bytes32  _housename, uint256 _roomnumber, string memory _facilities,string memory _name)public returns(bool success) {
        Rooms storage room = registeredRooms[_housename][_roomnumber];
        House storage house = registeredHouses[_housename];
        uint256[] storage houseroom = registeredHouses[_housename].rooms;
        require(house.owneradd == msg.sender);
        room.facilities = _facilities;
        room.name = _name;
        room.registered = true;
        houseroom.push(_roomnumber);
        return true;
    }
    function updateRentRoom(bytes32 _housename, uint256 _roomnumber)public {
         Rooms storage room = registeredRooms[_housename][_roomnumber];
         room.rented = true;
    }
    function checkOut(bytes32  _housename, uint256 _roomnumber)public {
        Rooms storage room = registeredRooms[_housename][_roomnumber];
         room.rented = false;

    }
    function  registeredhouses()public view returns(bytes32[] memory) {
           // for (uint8 i = 1; i < houseNames.length; i++) {
                    return houseNames;
          //  }
    }
    function registeredhousesRooms(bytes32 _housename) public view returns(uint256[] memory) {
        return  registeredHouses[_housename].rooms;
    }
}