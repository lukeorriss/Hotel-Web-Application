var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
if(dd<10){
  dd='0'+dd
} 
if(mm<10){
  mm='0'+mm
} 

today = yyyy+'-'+mm+'-'+dd;
document.getElementById("start").setAttribute("min", today);



document.getElementById('end').onchange= function(){
	
	var startDate = document.getElementById('start').value;
	var endDate = document.getElementById('end').value;
	if(Date.parse(endDate) <= Date.parse(startDate)){
		alert("Check-out date must be after check-in date");
        document.getElementById("end").value = "";
	}
}



document.getElementById('room_no').onchange = function(){
	
	number = document.getElementById('room_no');  
	idx= number.selectedIndex;                        //gets the index of the option chosen for number of rooms   
	var room_numbers = number.options[idx].value;     //gets the value chosen for number of rooms. 
	var allrooms= document.getElementsByClassName("room");     //puts the room types into an array 
	
	for (var i = 0; i < allrooms.length; i++){                
		classList= allrooms[i].classList;
		if (i < room_numbers){
			classList.add("roomshow");
			classList.remove("roomhide");
		}
		else {
			classList.add("roomhide");
			classList.remove("roomshow");
		}
			
	}
}


		
