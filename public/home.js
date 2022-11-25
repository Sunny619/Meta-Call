let userRoomInput =document.getElementById("userRoom")
let roomId =document.getElementById("roomId")
userRoomInput.onchange = () =>{
    roomId.setAttribute("href","/"+userRoomInput.value)
}
let body = document.body;
var logo = document.getElementsByClassName("gradient-text");
let HomePage = document.getElementsByClassName("Homepage");
logo.onmouseover = function(){  
    body.className = 'hovered'
}
logo.onmouseout = function(){
    body.className = ''
}
// This Fuction is meant to Remove the Initial logo and add elements like the create meeting button and Add most of the elements into home.ejs
//Currently finding ways to do that -Monish 
function Transition(){
    alert("Testing Function");
    
}
const nav_links = document.querySelector(".nav-links");
const menuBtn_open= document.querySelector("#menu-btn_open");
const menuBtn_close= document.querySelector("#menu-btn_close");
//console.log(nav_links,menuBtn_open,menuBtn_close);
menuBtn_open.onclick = ()=> toggler();
menuBtn_close.onclick = ()=> toggler();
function toggler(){
    nav_links.classList.toggle("active");
    menuBtn_open.classList.toggle("close");
    menuBtn_close.classList.toggle("open");
}