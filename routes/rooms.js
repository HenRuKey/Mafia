var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://bryan:mafiadb1@ds029267.mlab.com:29267/game_info',['rooms']);

router.get('/rooms/:code', function(req, res, next){
    var query = {room_id: req.params.code}
    db.rooms.findOne(query, function(err, room){
        if(err){
            console.log("Thrown Here")
            res.send(err)   
        }
        res.json(room);
    });

});

router.get('/', function(req, res, next){
    db.rooms.find(function(err, room){
        if(err){
            console.log("Thrown Here")
            res.send(err)
        }
        res.json(room);
    });
});

router.post('/rooms/create', function(req, res, next){
    var room = req.body;
    if(!room.room_id){
        res.status(400);
        res.json({
            'Error': "Invalid Room Code"
        });
    } else {
        db.rooms.save(room, function(err, task){
            if(err){
                res.send(err);
            }
            res.json(room);
        })
    }
});

router.put('/room/', function(req, res, next){
    var room = req.body;
    var updRoom = {
        room_id: ""
    };


    if(room.room_id){
        updRoom.room_id = room.room_id;
    }
    db.rooms.findOne({_id: mongojs.ObjectId(req.params._id)}, function(err, room){
        if(err){
            console.log("Thrown Here")
            res.send(err)
        }
        res.json(room);
    });

});


router.delete('/room/:code', function(req, res, next){
    db.rooms.remove({room_id: req.params.code}, function(err, room){
        if(err){
            res.send(err)
        }
        res.json(room);
    });
});


module.exports = router;