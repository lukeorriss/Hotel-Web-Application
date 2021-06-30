function buttonOne(){
	window.open('https://www.museums.norfolk.gov.uk/norwich-castle');
}
	
function buttonTwo(){
	window.open('https://www.dragonhallnorwich.org.uk/');
}

function buttonThree(){
	window.open('https://www.cathedral.org.uk/');
}


b1= document.querySelector("#button1");
b1.addEventListener('click', buttonOne, false);

b2= document.querySelector("#button2");
b2.addEventListener('click', buttonTwo, false);

b3= document.querySelector("#button3");
b3.addEventListener('click', buttonThree, false);


document.getElementById("button1").style.cursor = "pointer";

document.getElementById("button2").style.cursor = "pointer";

document.getElementById("button3").style.cursor = "pointer";


