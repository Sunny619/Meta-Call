let userRoomInput =document.getElementById("userRoom")
let roomId =document.getElementById("roomId")
userRoomInput.onchange = () =>{
    roomId.setAttribute("href","/"+userRoomInput.value)
}