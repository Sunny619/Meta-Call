let userRoomInput =document.getElementById("roomcode")
let roomId =document.getElementById("roomId")
let pass =document.getElementById("password")
let name1 =document.getElementById("username")
let roomval = ""
let passval = ""
// userRoomInput.onchange = () =>{
//     roomval = userRoomInput.value
//     roomId.setAttribute("href","/"+roomval+"?pass="+passval)
// }
// pass.onchange = () =>{
//     passval = pass.value
//     roomId.setAttribute("href","/"+roomval+"?pass="+passval)
// }
function join()
{
    window.location = "/"+userRoomInput.value+"?pass="+pass.value+"&username="+name1.value;
}
