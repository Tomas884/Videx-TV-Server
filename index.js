const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const saltRounds = 10

const app = express();

app.use(express.json());
//app.use(cors());
app.use(cors({
	origin: ["http://localhost:3000"],
	methods: ["GET", "POST"],
	credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
	key: "userId",
	secret: "subscribe",
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 60 * 60 * 24,
	},
}));

const db = mysql.createConnection({
	user: "root",
	host: "localhost",
	password: "",
	database: "vidextv",
});

app.post('/register', (req, res) => {
	
	const usersEmail = req.body.usersEmail;
	const usersUsername = req.body.usersUsername;
	const usersPassword = req.body.usersPassword;
	
	bcrypt.hash(usersPassword, saltRounds, (err, hash) => {
		
		if (err) {
			console.log(err);
		}
		
		db.query("INSERT INTO vidextvdb (usersEmail, usersUsername, usersPassword) VALUES (?, ?, ?)", [usersEmail, usersUsername, hash], (err, result) => {
		console.log(err);
	    });
		
	});
	
});

app.get("/login", (req, res) => {
	if (req.session.user) {
		res.send({loggedIn: true, user: req.session.user});
	} else {
		res.send({loggedIn: false});
	}
});

app.post('/login', (req, res) => {
	
	const usersEmail = req.body.usersEmail;
	const usersUsername = req.body.usersUsername;
	const usersPassword = req.body.usersPassword;
	
	/**
	db.query("SELECT * FROM vidextvdb WHERE usersUsername = ? AND usersPassword = ?", [usersUsername, usersPassword], (err, result) => {
		
		if (err) {
		res.send({err: err});
		} 
		
		if (result.length > 0) {
			res.send(result);
		} else {
			res.send({message: "Wrong Username or Password"});
		}
		
	});
	*/
	
	db.query("SELECT * FROM vidextvdb WHERE usersUsername = ?;", usersUsername, (err, result) => {
		
		if (err) {
		res.send({err: err});
		} 
		
		if (result.length > 0) {
			bcrypt.compare(usersPassword, result[0].usersPassword, (error, response) => {
				if (response) {
					req.session.user = result;
					console.log(req.session.user);
					res.send(result);
				} else {
					res.send({message: "Wrong Username or Password"});
				}
			});
		} else {
			res.send({message: "User is not found"});
		}
		
	});
	
});



app.post('/remove', (req, res) => {
	
	const usersEmail = req.body.usersEmail;
	const usersUsername = req.body.usersUsername;
	const usersPassword = req.body.usersPassword;
	
	bcrypt.hash(usersPassword, saltRounds, (err, hash) => {
		
		if(err) {
			console.log(err);
		}
		
		db.query("DELETE FROM vidextvdb WHERE usersUsername = ?;", [usersUsername, usersPassword], (err, result) => {
			console.log(err);
		});
		
	});
	
});


app.post('/update', (req, res) => {
	
	const usersEmail = req.body.usersEmail;
	const usersUsername = req.body.usersUsername;
	const usersPassword = req.body.usersPassword;
	
	bcrypt.hash(usersPassword, saltRounds, (err, hash) => {
		
		if (err) {
			console.log(err);
		}
		
		db.query("UPDATE vidextvdb SET usersEmail = ? WHERE usersUsername = ?;", [usersEmail, usersUsername], (err, result) => {
			console.log(err);
		});
		
	});
	
});

app.post('/updateUsername', (req, res) => {
	
	const usersEmail = req.body.usersEmail;
	const usersUsername = req.body.usersUsername;
	const usersPassword = req.body.usersPassword;
	
	bcrypt.hash(usersPassword, saltRounds, (err, hash) => {
		
		if (err) {
			console.log(err);
		}
		
		db.query("UPDATE vidextvdb SET usersUsername = ? WHERE usersEmail = ?;", [usersEmail, usersUsername], (err, result) => {
			console.log(err);
		});
		
	});
	
});

app.post('/updatePassword', (req, res) => {
	
	const usersEmail = req.body.usersEmail;
	const usersUsername = req.body.usersUsername;
	const usersPassword = req.body.usersPassword;
	
    
	
});

app.listen(3001, () => {
	console.log("VidexTV Server Is Running...");
});

/**
const express = require('express');
const app = express();
const mysql = require('mysql');

const db = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "",
	database: "databasename",
});

app.get("/", (req, res) => {
	
	const sqlInsert = "INSERT INTO dbtablename (id, email, username, password) VALUES ('1', 'test@email.com', 'pwd');"
	//db.query(sqlInsert, (req, res) => )
	db.query(sqlInsert, (err, result) => {
		res.send("hello world");
	});
	
});

app.listen(3001, () => {
	console.log("running on port 3001");
});
*/