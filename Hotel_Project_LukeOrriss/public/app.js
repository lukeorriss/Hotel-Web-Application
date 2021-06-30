const express = require('express');

const app = express();
app.use(express.json())

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlParser = bodyParser.urlencoded();

app.use(bodyParser.urlencoded({ extended: true }));


const ejs = require('ejs')

app.set('view engine', 'ejs');

const env = process.env.NODE_ENV || 'development';

const config = require('./config.js')[env];

const pg = require('pg');

const pool = new pg.Pool(config);

app.use(express.static('public'));

app.get('/booking', (req,res)=>{
res.render('booking', {message:"", allRoomsAreOk : true, stdD:"", stdT:"", supD:"", supT:""}); 

});
	
	
app.post('/booking', async function(req,res){ 
	 console.log(req.body);                 // takes information from booking form and allocates to variables 
	 const checkIn = req.body.start;
	 const checkOut = req.body.end;
	 const start = new Date(checkIn)       // turns check in and checout into dates 
	 const end = new Date(checkOut)
	 const Difference_In_Time = end.getTime() - start.getTime(); 
	 const nights = Difference_In_Time / (1000 * 3600 * 24); // calculates number of nights based on dates 
	 const guest = req.body.guest;
	 const roomNo = req.body.room_no;						 // the number of rooms they requested 
	 const room = req.body.room;	                         // all room types have name "room" so the types are sent as a list 
	 let results; 	 
	 var counts = {std_d:0, std_t:0, sup_d:0, sup_t:0};    //creates a dictionary of the 4 room types and assigns values to 0 
	 for (i=0; i < roomNo; i++){							// iterates through room choices up to the number of rooms chosen and 	
		 var roomType = room[i];                              // adds to total depending on room type 
		 counts[roomType]++;
	 }
	 const client = await pool.connect();
	 const q = `SET SEARCH_PATH to hotelbooking; SELECT r_class, COUNT(r_class) AS availablerooms FROM room as r, roombooking as b WHERE r.r_no= b.r_no AND b.r_no NOT IN (SELECT r_no from roombooking WHERE checkin <= '${checkOut}' AND '${checkIn}'<= checkout) GROUP BY r_class`;
	 console.log(q);
	 await client.query(q).then(results =>{      //runs the queries
		 client.release();
		 console.log(results);
		 data = results[1].rows;                // takes data from second query
		 var available = {std_d:0, std_t:0, sup_d:0, sup_t:0};  //creates an empty dictionary of room types 
		 for ( i = 0; i < data.length; i++){
			available[data[i].r_class]= data[i].availablerooms;    //iterates each row and assigns value of total room count to relevant  
		  }															// room type 
		 var allRoomsAreOk = true;								// sets a flag so that message only shows on booking page if false 
		 for (const room in counts){							// loops through counts dictionary values and if the total requested 
			 if (counts[room] > available[room]){               // room type is greater than the available rooms, executes code 
				 allRoomsAreOk = false;							// flag set to false so message will display on site. 
				const message = 'Sorry, those rooms are not available on those dates. Please see below for the rooms available:' 
				var roomsAvailable ={std_d:0, std_t:0, sup_d:0, sup_t:0};
				for (var availRooms in available){              // displays number of rooms available from 0-5, then for any room type 
					if (available[availRooms]=== 0){            // that has 6 or more rooms, it will display '6 or more' rather than the 
							roomsAvailable[availRooms]= 0;      // exact number 
						}
					else if (available[availRooms]=== 1){
						roomsAvailable[availRooms]= 1;
					}
					else if (available[availRooms]=== 2){
						roomsAvailable[availRooms]= 2;
					}
			
					else if (available[availRooms]=== 3){
							roomsAvailable[availRooms]= 3;
						}
					else if (available[availRooms]=== 4){
							roomsAvailable[availRooms]= 4;
						}
					
					else if (available[availRooms]=== 5){
							roomsAvailable[availRooms]= 5;
						}
						
					else{ 
						roomsAvailable[availRooms]= '6 or more';
					}
				}
				 const stdD = roomsAvailable['std_d'];    // assigns the number of rooms for each type to variables 
				 const stdT = roomsAvailable['std_t'];
				 const supD = roomsAvailable['sup_d'];
				 const supT = roomsAvailable['sup_t'];
				 res.render('booking', {allRoomsAreOk:false, message:message, stdD:stdD, stdT:stdT, supD:supD, supT:supT})
			 }
		 }
			 if (allRoomsAreOk){                 // if all requested rooms are available 
				 const stdD = counts['std_d'];   // assigns number of reqested rooms for each type to a variable 
				 const stdT = counts['std_t'];
				 const supD = counts['sup_d'];
				 const supT = counts['sup_t'];
				 const stdDcost = stdD*65;       // finds out the cost for each room type 
				 const stdTcost = stdT*62;
				 const supDcost = supD*77;
				 const supTcost = supT*75;
				 const totalCost= nights*(stdDcost + stdTcost + supDcost + supTcost); //calculates the total booking cost 
				 res.render('payment', {totalCost:totalCost, checkIn:checkIn, checkOut:checkOut, stdD:stdD, stdT:stdT, supD:supD, supT:supT, nights:nights, guest:guest}) //passes data through to payment page 
				
			 }
			 else{
				 const message = 'Sorry, those rooms are not available on those dates. Please see below for the rooms available:' 
				var roomsAvailable ={std_d:0, std_t:0, sup_d:0, sup_t:0};
				for (var availRooms in available){
					if (available[availRooms]=== 0){
							roomsAvailable[availRooms]= 0;
						}
					else if (available[availRooms]=== 1){
						roomsAvailable[availRooms]= 1;
					}
					else if (available[availRooms]=== 2){
						roomsAvailable[availRooms]= 2;
					}
			
					else if (available[availRooms]=== 3){
							roomsAvailable[availRooms]= 3;
						}
					else if (available[availRooms]=== 4){
							roomsAvailable[availRooms]= 4;
						}
					
					else if (available[availRooms]=== 5){
							roomsAvailable[availRooms]= 5;
						}
						
					else{ 
						roomsAvailable[availRooms]= '6 or more';
					}
				}
				 const stdD = roomsAvailable['std_d']; //allocates the number of each room type required to a variable
				 const stdT = roomsAvailable['std_t'];
				 const supD = roomsAvailable['sup_d'];
				 const supT = roomsAvailable['sup_t'];
				 res.render('booking', {allRoomsAreOk:false, message:message, stdD:stdD, stdT:stdT, supD:supD, supT:supT})
			 }
				 
			 
			 
		
	 },
	  err => { console.log(err.stack)
			errors = err.stack.split(" at ");
			res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
		});
			
});	

app.get('/payment',(req,res)=>{
	res.render('payment',{totalCost:totalCost, checkIn:checkIn, checkOut:checkOut, stdD:stdD, stdT:stdT, supD:supD, supT:supT, nights:nights, guest:guest}); 

});
	

app.post('/payment', async function(req,res){
		console.log(req.body)// takes information from payment form and allocates to variables 
	 const name = req.body.name;
	 const email = req.body.email;
	 const address = req.body.address;
	 const notes = req.body.notes;
	 const cardType = req.body.cardType;
	 const cardNo = req.body.c_cardno;
	 const cardExp= req.body.c_cardexp;
	 const totalCost = req.body.totalCost;
	 const nights = req.body.nights;
	 const guest = req.body.guest;
	 const checkIn= req.body.checkIn;
	 const checkOut = req.body.checkOut;
	 const std_d = req.body.std_d;
	 const std_t = req.body.std_t;
	 const sup_t = req.body.sup_t;
	 const sup_d = req.body.sup_d;
	 const client = await pool.connect();
	 const qOne = `SET SEARCH_PATH to hotelbooking; SELECT MAX(c_no) AS lastCNo from customer; SELECT MAX(b_ref) AS lastBR from booking;`;
	 console.log(qOne);
	 await client.query(qOne).then(results =>{      //runs the queries
		 console.log(results);
		 const custNo = results[1].rows; 
		 const lastCNo= custNo[0].lastcno;        //takes last used c_no and adds 1 to get the next c_no
		 const nextCNo = lastCNo + 1;
		 const bookRef= results[2].rows;          // takes last used b_ref and adds 1 to get next b_ref 
		 const lastBR = bookRef[0].lastbr; 
		 const nextBR = lastBR +1;
		 const qTwo = `SET SEARCH_PATH to hotelbooking; INSERT into customer    
		 VALUES(${nextCNo},'${name}', '${email}','${address}', '${cardType}','${cardExp}', ${cardNo}); 
		 INSERT into booking 
		 VALUES(${nextBR},${nextCNo}, ${totalCost},${totalCost},'${notes}');`		 //inserts new customer and new booking  
		 console.log(qTwo);
		 client.query(qTwo).then( results =>{ 
			for (let i =0; i< std_d; i++){         //iterates through each std_d room and allocates room number 
			const qThree = `SET SEARCH_PATH to hotelbooking; 
			SELECT MIN(r_no) as rchosen from room  
			WHERE r_no NOT IN (SELECT r_no from roombooking WHERE checkin <= '${checkOut}' AND '${checkIn}'<= checkout) AND room.r_class = 'std_d';` 
			client.query(qThree).then(results =>{
				data = results[1].rows;
				var roomNo= data[0].rchosen;   //takes room number allocated and assigns to variable 
				console.log(roomNo)            // inserts info into roombooking table 
				var qFour= `SET SEARCH_PATH to hotelbooking; INSERT into roombooking VALUES(${roomNo},${nextBR},'${checkIn}','${checkOut}');`
				client.query(qFour).then(results =>{
					console.log(qFour);
				},
				
				err => { console.log(err.stack)
					errors = err.stack.split(" at ");
					res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
			 })
				
			});
			}
			for (let i =0; i< std_t; i++){
				const qThree = `SET SEARCH_PATH to hotelbooking; SELECT MIN(r_no) as rchosen from room  WHERE r_no NOT IN (SELECT r_no from roombooking WHERE checkin <= '${checkOut}' AND '${checkIn}'<= checkout) AND room.r_class = 'std_t';` 
				client.query(qThree).then(results =>{
					data = results[1].rows;
					var roomNo= data[0].rchosen;
					console.log(roomNo)
					var qFour= `SET SEARCH_PATH to hotelbooking; INSERT into roombooking     VALUES(${roomNo},${nextBR},'${checkIn}','${checkOut}');`
					client.query(qFour).then(results =>{
						console.log(qFour);
					},
				
				err => { console.log(err.stack)
					errors = err.stack.split(" at ");
					res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
			 })
				
			});
			}
			for (let i =0; i< sup_d; i++){
				const qThree = `SET SEARCH_PATH to hotelbooking; SELECT MIN(r_no) as rchosen from room  WHERE r_no NOT IN (SELECT r_no from roombooking WHERE checkin <= '${checkOut}' AND '${checkIn}'<= checkout) AND room.r_class = 'sup_d';` 
				client.query(qThree).then(results =>{
					data = results[1].rows;
					var roomNo= data[0].rchosen;
					console.log(roomNo)
					var qFour= `SET SEARCH_PATH to hotelbooking; INSERT into roombooking     VALUES(${roomNo},${nextBR},'${checkIn}','${checkOut}');`
					client.query(qFour).then(results =>{
						console.log(qFour);
					},
					
					err => { console.log(err.stack)
						errors = err.stack.split(" at ");
						res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
				 })
				
			});
			}
			for (let i =0; i< sup_t; i++){
				const qThree = `SET SEARCH_PATH to hotelbooking; SELECT MIN(r_no) as rchosen from room  WHERE r_no NOT IN (SELECT r_no from roombooking WHERE checkin <= '${checkOut}' AND '${checkIn}'<= checkout) AND room.r_class = 'sup_t';` 
				client.query(qThree).then(results =>{
					data = results[1].rows;
					var roomNo= data[0].rchosen;
					console.log(roomNo)
					var qFour= `SET SEARCH_PATH to hotelbooking; INSERT into roombooking     VALUES(${roomNo},${nextBR},'${checkIn}','${checkOut}');`
					client.query(qFour).then(results =>{
						console.log(qFour);
					},
					
					err => { console.log(err.stack)
						errors = err.stack.split(" at ");
						res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
				 })
					
				});
			}
	 
		 res.render('confirmation',{nextBR:nextBR, totalCost:totalCost, name:name, nights:nights, guest:guest, checkIn:checkIn, checkOut:checkOut});
	 },
	 
	 err => { console.log(err.stack)
			errors = err.stack.split(" at ");
			res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
	 

   

	 },
	
	 
	 err => { console.log(err.stack)
			errors = err.stack.split(" at ");
			res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
		});
	 
	});

});

app.get('/confirmation',(req,res)=>{
	res.render('confirmation',{nextBR:nextBR, totalCost:totalCost, name:name, nights:nights, guest:guest, checkIn:checkIn, checkOut:checkOut}); 

});
	



app.listen(5000, function(){
	console.log('Express app listening on port 5000...')
});


	
	