var express = require('express');
var app = express();


const env = process.env.NODE_ENV || 'development';
const config = require('./config.js')[env];

const pg = require('pg');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlParser = bodyParser.urlencoded({ extended:  true });
const pool = new pg.Pool(config);
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/housekeeping', async function(req, res){
    const body = req.body;
    const client = await pool.connect();    //brings up all rooms with a status of C or X 
    const query = `set search_path to hotelbooking; select * from room WHERE r_status = 'C' OR r_status = 'X' ORDER BY r_status, r_no;`;
    console.log(query)
    await client.query(query).then(results => {
        client.release();
        console.log(results[1]);
        data = results[1].rows;
		const update = false
        res.render('housekeeping', {data:data, update:false})

    },
     err => { console.log(err.stack)
			errors = err.stack.split(" at ");
			res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
		});
    
})

app.post('/housekeeping', async function(req, res){
    const roomNumber= req.body.roomNumber;
	const roomStatus= req.body.roomStatus;
    const client = await pool.connect();    // updates a room status to the given status 
    const query = `set search_path to hotelbooking; UPDATE room SET r_status = '${roomStatus}' WHERE r_no = ${roomNumber};`;
    console.log(query)
    await client.query(query).then(results => {
        client.release();
        console.log(results[2]);
        res.render('housekeeping', {roomStatus:roomStatus, roomNumber:roomNumber, update:true})
    },
     err => { console.log(err.stack)
			errors = err.stack.split(" at ");
			res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
		});
})

    

app.get('/recep', async function(req, res){
	const update= false;
	res.render('recep', {update:false})
})


	
	
app.get('/checkin',urlParser, async function(req, res){
		const update= false;
        res.render('checkin', {update:false})
    
})

app.post('/checkin', async function(req, res){
    const bookingRef= req.body.bookingRef;
    const client = await pool.connect();       //selects all informaiton for a given booking 
    const query = `set search_path to hotelbooking; SELECT * from roombooking WHERE b_ref = ${bookingRef};`;
    console.log(query)
    await client.query(query).then(results => {
        client.release();
        console.log(results[1]);
		data = results[1].rows;
		console.log(data);
		const roomNo = data[0].r_no;
		const checkin = data[0].checkin;
		const checkout = data[0].checkout;
        res.render('checkin2', {bookingRef:bookingRef, roomNo:roomNo, checkin:checkin, checkout:checkout, update:false})
    },
     err => { console.log(err.stack)
			errors = err.stack.split(" at ");
			res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
		});
})

app.get('/checkin2',  async function(req, res){
		const update = false;
        res.render('checkin',{bookingRef:bookingRef, roomNo:roomNo, checkin:checkin, checkout:checkout,update:false})

})
    



app.post('/checkin2', async function(req, res){
    const roomNo= req.body.roomNo;
	const bookingRef = req.body.bookingRef;
	const checkin = req.body.checkin;
	const checkout = req.body.checkout;
    const client = await pool.connect();      //updates the room status to O for a given room number 
    const query = `set search_path to hotelbooking; UPDATE room SET r_status = 'O' WHERE r_no = ${roomNo};`;
    console.log(query)
    await client.query(query).then(results => {
        client.release();
        console.log(results[1]);
        res.render('checkin2', {update:true,bookingRef:bookingRef, roomNo:roomNo, checkin:checkin, checkout:checkout})
    },
     err => { console.log(err.stack)
			errors = err.stack.split(" at ");
			res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
		});
})

app.get('/checkout', async function(req, res){
	const update= false;
    res.render('checkout', {update:false})
		
})

app.post('/checkout', async function(req, res){
    const bookingRef = req.body.bookingRef
    const client = await pool.connect();       //gets details for a given booking reference 
    const query = `set schema 'hotelbooking'; set search_path to hotelbooking; SELECT b.b_ref, b.b_outstanding, b.b_notes, c.c_no, c.c_name, c.c_address, c.c_cardtype, c.c_cardexp, c.c_cardno FROM booking as b JOIN customer as c ON c.c_no = b.c_no WHERE b.b_ref=${bookingRef};`
    console.log(query)
    await client.query(query).then(results => {
        client.release();
        console.log(results[2]);
        data = results[2].rows;
		const bookingRef = data[0].b_ref;  //assigns the details to variables to pass through to checkout2 
		const outstanding =data[0].b_outstanding;
		const notes =data[0].b_notes;
		const cno =data[0].c_no;
		const name =data[0].c_name;
		const address =data[0].c_address;
		const ctype =data[0].c_cardtype;
		const cexpiry =data[0].c_cardexp;
		const cardno =data[0].c_cardno; 
		const total = outstanding;
		const extra = 0;
        res.render('checkout2', {update:false, extra:extra, total:total,  bookingRef:bookingRef, outstanding:outstanding,notes:notes, cno:cno, name:name, address:address, ctype:ctype, cexpiry:cexpiry,cardno:cardno})

    },
     err => { console.log(err.stack)
			errors = err.stack.split(" at ");
			res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
		});
})

app.get('/checkout2', async function(req, res){
	const update= false;
	const total = outstanding;
	const extra = 0; 
    res.render('checkout2', {update:false, extra:extra, bookingRef:bookingRef,total:total, outstanding:outstanding,notes:notes, cno:cno, name:name, address:address, ctype:ctype, cexpiry:cexpiry,cardno:cardno})
		
})

app.post('/checkout2',  async function(req, res){
		const extra = req.body.extras;
		const bookingRef = req.body.bookingRef
		const outstanding = req.body.outstanding;
		const notes = req.body.notes;
		const cno = req.body.cno;
		const name = req.body.name;
		const address = req.body.address;
		const ctype = req.body.ctype;
		const cexpiry = req.body.cexpiry;
		const cardno = req.body.cardno; 
		const total = parseInt(extra) + parseInt(outstanding);   //calculates the total amount due including any extras 
	res.render('checkout3',{total:total,update:false,bookingRef:bookingRef, outstanding:outstanding,notes:notes, cno:cno, name:name, address:address, ctype:ctype, cexpiry:cexpiry,cardno:cardno})
})

app.get('/checkout3', async function(req, res){
	const update= false;
    res.render('checkout2', {update:false, bookingRef:bookingRef,total:total, outstanding:outstanding,notes:notes, cno:cno, name:name, address:address, ctype:ctype, cexpiry:cexpiry,cardno:cardno})
		
})

app.post('/checkout3', async function(req, res){
		const bookingRef = req.body.bookingRef;
		var outstanding = req.body.outstanding;
		const notes = req.body.notes;
		const cno = req.body.cno;
		const name = req.body.name;
		const address = req.body.address;
		const ctype = req.body.ctype;
		const cexpiry = req.body.cexpiry;
		const cardno = req.body.cardno; 
		const extra = req.body.extras;
		const total =  0;
		const client = await pool.connect();   //sets the outstading amount due to 0 for a given booking ref. 
		const query1 = `set search_path to hotelbooking; UPDATE booking SET b_outstanding = 0 WHERE b_ref = ${bookingRef};`;
		console.log(query1)
		client.query(query1).then(results => {  // refreshes the data so outstading balance says 0. 
			const query2 = `set search_path to hotelbooking; SELECT b.b_ref, b.b_outstanding, b.b_notes, c.c_no, c.c_name, c.c_address, c.c_cardtype, c.c_cardexp, c.c_cardno FROM booking as b JOIN customer as c ON c.c_no = b.c_no WHERE b.b_ref=${bookingRef};`;
			client.query(query2).then(results => {
				client.release();
				console.log(results[1]);
				data = results[1].rows;
				var outstanding = data[0].b_outstanding;
				res.render('checkout3', {update:true,bookingRef:bookingRef, outstanding:outstanding,notes:notes, cno:cno, name:name, address:address, ctype:ctype, cexpiry:cexpiry,cardno:cardno, extra:extra, total:total})
		},
		 err => { console.log(err.stack)
				errors = err.stack.split(" at ");
				res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
			});
		},err => { console.log(err.stack)
				errors = err.stack.split(" at ");
				res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
			});
})

app.get('/income', urlParser, async function(req, res){
	res.render('income')
})


app.post('/income', urlParser, async function (req,res){
	const start = req.body.start;        //takes dates entered by user 
	const end = req.body.end;
	const client = await pool.connect(); //calculates the total value of bookings between a given date range 
	const query =`set search_path to hotelbooking; SELECT SUM(b.b_cost) as total from booking as b JOIN roombooking as r ON b.b_ref = r.b_ref WHERE r.checkout BETWEEN '${start}' AND  '${end}';`;
	await client.query(query).then(results => {
		client.release();
		console.log(results[1]);
		data = results[1].rows;
		console.log(data);
		const total = data[0].total; 
		res.render('report',{total:total, start:start, end:end})  //sends information to report page. 
		},
	 err => {console.log(err.stack)
			errors = err.stack.split(" at ");
			res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
		});
})

app.get('/availability', urlParser, async function (req,res){
	res.render('availability')
})

app.post('/availability', urlParser, async function (req,res){
	const start = req.body.start;
	const end = req.body.end;
	const client = await pool.connect(); //selects the room number and type for rooms that are availabile between a given date range 
	const query = `set search_path to hotelbooking; select DISTINCT room.r_no, room.r_class from roombooking JOIN room on roombooking.r_no = room.r_no WHERE room.r_no NOT IN (SELECT r_no from roombooking WHERE checkin <= '${end}' AND '${start}' <= checkout) ORDER BY room.r_no;`;
	await client.query(query).then(results => {
		client.release();
		console.log(results[1]);
		data = results[1].rows;
		console.log(data);
		res.render('availability_report',{data:data, start:start, end:end})
		},
	 err => {console.log(err.stack)
			errors = err.stack.split(" at ");
			res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
		});
})

app.get('/occupancy', urlParser, async function (req,res){
	res.render('occupancy')
})

app.post('/occupancy', urlParser, async function (req,res){
	const start = req.body.start;
	const end = req.body.end;
	const client = await pool.connect(); //counts number of rooms booked between a given set of dates 
	const query = ` set search_path to hotelbooking; select COUNT(r_no) AS roomsbooked from roombooking WHERE checkin BETWEEN '${start}' AND '${end}' AND checkout BETWEEN '${start}' AND '${end}';`;
	await client.query(query).then(results => {
		client.release();
		console.log(results[1]);
		data = results[1].rows;
		console.log(data);
		const rooms = data[0].roomsbooked;
		res.render('occupancy_report',{rooms:rooms, start:start, end:end})
		},
	 err => {console.log(err.stack)
			errors = err.stack.split(" at ");
			res.json({ message:'Sorry something went wrong! The data has not been processed ' + errors[0]});
		});
})

	
app.listen(5000, function(){
    console.log("Express app listening on port 5000")
})