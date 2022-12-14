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
    delete(logo) //Doesnt work
    //document.removeChild(logo);//doesnt work 
    let create_meeting = document.createElement('button');
    create_meeting.innerText = "Create Meetings";
    create_meeting.location.href = '/def'
    create_meeting.addEventListener('click',()=> {
        roomId.setAttribute("href","/"+userRoomInput.value)
    })
    body.appendChild(create_meeting)
}
function onClick(element) {
    document.getElementById("img01").src = element.src;
    document.getElementById("modal01").style.display = "block";
    var captionText = document.getElementById("caption");
    captionText.innerHTML = element.alt;
  }
  
  
  // Toggle between showing and hiding the sidebar when clicking the menu icon
  var mySidebar = document.getElementById("mySidebar");
  
  function w3_open() {
    if (mySidebar.style.display === 'block') {
      mySidebar.style.display = 'none';
    } else {
      mySidebar.style.display = 'block';
    }
  }
  
  // Close the sidebar with the close button
  function w3_close() {
      mySidebar.style.display = "none";
  }