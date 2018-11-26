var cors = require('cors');
var express = require("express");
var app = express();
var http = require('http').Server(app);
var mongojs = require('mongojs');
var db = mongojs('mongodb://bryan:mafiadb1@ds029267.mlab.com:29267/game_info', ['rooms']);

app.use(cors());

app.get("/api", (req, res) =>{
    db.rooms.find(function(err, rooms){
        if(err){
            console.log("Thrown Here")
            res.send(err)
        }
        res.json(rooms);
    });
})

app.get("/api/:code", (req, res) =>{
    var query = {room_id: req.params.code}
    db.rooms.findOne(query, function(err, room){
        if(err){
            console.log("Thrown Here")
            res.send(err)   
        }
        res.json(room);
    });
})




http.listen(3000, function () {
    console.log('server started on port 3000');
})