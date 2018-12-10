var cors = require('cors');
var express = require("express");
var app = express();
var http = require('http').Server(app);
var mongojs = require('mongojs');
var db = mongojs('mongodb://bryan:mafiadb1@ds029267.mlab.com:29267/game_info', ['rooms', 'players', 'messages', 'votes'], { autoReconnect: true });
var bodyParser = require('body-parser');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//Returns all rooms
app.get("/api", (req, res) => {
    db.rooms.find(function (err, rooms) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        res.json(rooms);
    });
});

//Returns the room matching the code
app.get("/api/room/:code", (req, res) => {
    var query = { roomCode: req.params.code };
    db.rooms.findOne(query, function (err, room) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        if (room != null) {
            
            var oldDate = parseInt(room.created);
            var newDate = Date.now();
            if (newDate - oldDate >= exprationLimit) {
                db.rooms.remove(room);
                db.messages.remove(query);
                db.players.remove(query);
                room = null;
            }
        }
        res.json(room);
    });
});


//Creates a room with a given code.
app.post("/api/create/:code", (req, res) => {
    var room = {
        roomCode: req.params.code,
        created: Date.now()
    };
    var id = room.roomCode;
    if (!id) {
        res.status(400);
        res.json("Invalid Data");
    } else {
        db.rooms.save(room, function (err, room) {
            if (err) {
                res.send(err);
            }
            res.json(room);
        });
    }

});


// Delete the room with the matching code
app.delete("/api/deleteRoom/:code", (req, res) => {
    var query = {roomCode: req.params.code}
    db.rooms.findOne(query, function (err, room) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        if (room != null) {
                db.rooms.remove(room);
                room = null;
            }
            db.messages.remove(query);
            db.players.remove(query);
        res.json("Deleted");
    });
});


//updates a room
app.put('/api/updateRoom/:roomCode', (req, res) => {
    var query = {roomCode: req.params.roomCode};
    var room = req.body;
    db.rooms.update(query, room,  function(err, room){
        if (err) {
            res.status(400);
            res.send(err);
        }
        res.json(room);
    })
})


// Add Player
app.post("/api/addPlayer", (req, res) => {
    var player = req.body;
    player.lastActive = Date.now()
    if (!player) {
        res.status(400);
        res.json("Invalid Data");
    } else {
        db.players.save(player, function (err, player) {
            if (err) {
                res.send(err);
            }
            res.json(player);
        });
    }
});

// Get Player from room
app.get("/api/player", (req, res) => {
    var query = { roomCode: req.query.code, name: req.query.name };
    db.players.findOne(query, function (err, player) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        res.json(player);
    });
});


// Get All Players in Room by code
app.get("/api/allPlayers/:code", (req, res) => {
    var query = { roomCode: req.params.code };
    db.players.find(query, function (err, players) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        res.json(players);
    });

});

//Updates a player
app.put("/api/updatePlayer", (req, res) => {
    var query = { _id: mongojs.ObjectId(player.id) };
    db.players.update(query, {
        name: player.name,
        roomCode: player.roomCode,
        role: player.role,
        isAlive: player.isAlive,
        lastActive: Date.now()
    }, function(err, player){
        if(err){
            res.status(400);
            res.json(err);
        } else {
            res.json(player)
        }
    })
})


//Get player by role
app.get("/api/role/", (req, res) => {
    var query = {roomCode: req.query.code, role: req.query.role};
    db.players.find(query, function (err, players) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        res.json(players);
    });
})

// Add Message
app.post("/api/addMessage", (req, res) => {
    var message = req.body;
    if (!message) {
        res.status(400);
        res.json("Invalid Data");
    } else {
        db.messages.save(message, function (err, message) {
            if (err) {
                res.send(err);
            }
            res.json(message);
        });
    }
});


// Get All Messages by Code
app.get("/api/allMessages/:code", (req, res) => {
    var query = { roomCode: req.params.code };
    db.messages.find(query, function (err, players) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        res.json(players);
    });

});

//add vote
app.post('/api/addVote', (req, res) => {
    var vote = req.body;
    if (!vote) {
        res.status(400);
        res.json("Invalid Data");
    } else {
        db.votes.save(vote, function (err, vote) {
            if (err) {
                res.status(400);
                res.send(err);
            }
            res.json(vote);
        });
    }
})

// get all votes by electionId
app.get("/api/getVotes/:electionId", (req, res) => {
    var query = { electionId: req.params.electionId};
    db.votes.find(query, function(err, votes){
        if (err) {
            res.status(400);
            res.send(err);
        }
        res.json(votes);
    })
})



app.put("/api/updateActiveTime", (req, res) => {
    var query = { _id: mongojs.ObjectId(req.body) };
    db.players.update(query, { $set: { lastActive : Date.now()  } },
     function(err, player){
        if (err) {
            res.status(400);
            res.send(err);
        }
        res.json(player);

    })
})



http.listen(3000, function () {
    console.log('server started on port 3000');
});