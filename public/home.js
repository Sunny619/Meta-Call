let userRoomInput =document.getElementById("userRoom")
let roomId =document.getElementById("roomId")
let pass =document.getElementById("password")
let roomval = ""
let passval = ""
userRoomInput.onchange = () =>{
    roomval = userRoomInput.value
    roomId.setAttribute("href","/"+roomval+"?pass="+passval)
}
pass.onchange = () =>{
    passval = pass.value
    roomId.setAttribute("href","/"+roomval+"?pass="+passval)
}