var express = require('express');
var cors = require('cors');
var bodyParse = require('body-parser')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var storyPart = [];

var mongoose = require('mongoose');

//Modelo
var Word = require('./Model/word');

//Url para acceder a mongo
const dbMongo = 'mongodb://localhost:27017/dbStory';
const port = 8090;

var currentWord = "";


//Palabras que usa la aplicación
app.use(express.static('public'));
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());
app.use(cors());

mongoose.connect(dbMongo, function (err, res) {
    if (err) {
        console.log(`Error al conectarse a la base de datos: ${err}`);
    } else {
        console.log("conexion establecida");
    }
});


app.post('/api/setWord', function (req, res) {
    let word = new Word();
    word.word = req.param('inputWord');
    word.save(function (err, storeWord) {
        if (err) {
            res.status(500)
            res.send({ message: `Error al guardar palabra ${err}` })
        } else {
            res.status(200)
            res.redirect('/');
            res.end();
        }
    });
});

function randomWord(callback) {
    Word.find({}, function (err, words) {
        if (err) {
            console.log(`Error al buscar palabras ${err}`);
        } else {
            var number = Math.floor(Math.random() * words.length);
            currentWord = words[number].word;
            callback(0,currentWord);
        }
    });
}

io.on('connection',function(socket){
    console.log("Alguien se ha conectado con sockets")
    socket.emit('story',storyPart);
    socket.emit('new-word',currentWord);
    socket.on('sent-story',function(data){
        storyPart.push(data);
        io.sockets.emit('story', storyPart);
        randomWord(function(err,data){
            io.emit('new-word', data);
        });
    })
});


server.listen(port, function () {
    console.log("corriendo por el puerto: " + port)
})



