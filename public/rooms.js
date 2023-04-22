// This function updates the rooms container with the latest room data
function updateRoomsContainer() {
    let roomsContainer = document.getElementById('rooms-container');
    roomsContainer.innerHTML = '';
  
    rooms.forEach((value, key) => {
      let roomTile = document.createElement('div');
      roomTile.classList.add('room-tile');
  
      let roomName = document.createElement('h2');
      roomName.innerText = key;
      roomTile.appendChild(roomName);
  
      let roomUsers = document.createElement('p');
      roomUsers.innerText = Array.from(value).join(', ');
      roomTile.appendChild(roomUsers);
  
      roomsContainer.appendChild(roomTile);
    });
  }
  
  // Update the rooms container initially
  updateRoomsContainer();
  
  // Use websockets to update the rooms container in real-time
  const socket = io();
  socket.on('roomsUpdate', (data) => {
    // Update the rooms data
    rooms = new Map(data.rooms);
  
    // Update the rooms container with the latest data
    updateRoomsContainer();
  });
  