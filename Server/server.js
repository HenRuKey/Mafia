var cors = require('cors');
var express = require("express");
var app = express();
var http = require('http').Server(app);
var mongojs = require('mongojs');
var db = mongojs('mongodb://bryan:mafiadb1@ds029267.mlab.com:29267/game_info', ['rooms']);
var bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//Returns all rooms
app.get("/api", (req, res) => {
    db.rooms.find(function (err, rooms) {
        if (err) {
            console.log(err)
            res.send(err)
        }
        res.json(rooms);
    });
})

//Returns the room matching the code
app.get("/api/:code", (req, res) => {
    var query = { room_id: req.params.code }
    db.rooms.findOne(query, function (err, room) {
        if (err) {
            console.log(err)
            res.send(err)
        }
        res.json(room);
    });
})


//Creates a room with a given code.
app.post("/api/create/:code", (req, res) => {
    var room = req.body;
    var id = room.room_id;
    if (!id) {
        res.status(400);
        res.json("Invalid Data");
    } else {
        db.rooms.save(room, function (err, room) {
            if (err) {
                res.send(err);
            }
            res.json(room);
        })
    }
})

//Updates the room with the matching code. Deletes the room if empty;
app.put("/api/update/:code", (req, res) => {
    var id = req.params.code;
    var newOccupants = req.body.occupants;
    var query = { room_id: id }
    console.log("Runs");
    if (!id) {
        res.status(400);
        res.json("Invalid Data")
    } else {
        db.rooms.update(query, {$inc: {occupants: newOccupants}}, function (err, response) {
            if (err) {
                res.send(err);
                console.log(err)
            }
            console.log("Updates");
            db.rooms.findOne(query, function (err, room) {
                if (err) {
                    console.log(err)
                    res.send(err)
                } if (room["occupants"] == 0) {
                    db.rooms.remove({ room_id: id }, function (err, room) {
                        if (err) {
                            res.send(err);
                        }
                        res.json("Deleted");
                        console.log("Deletes");
                    })
                } else {
                    res.json(room);
                }   
            });
        })
    }
})



// Delete the room with the matching code
app.delete("/api/deleteRoom/:code", (req, res) => {
    var id = req.params.code;
    if (!id) {
        res.status(400);
        res.json("Invalid Data")
    } else {
        db.rooms.remove({ room_id: id }, function (err, room) {
            if (err) {
                res.send(err);
            }
            res.json("Deleted");
        })
    }
})




http.listen(3000, function () {
    console.log('server started on port 3000');
})