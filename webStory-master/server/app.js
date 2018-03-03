var express=require('express');
var cors=require('cors');
var bodyParse=require('body-parse')
var app=express();
var server=require('http').Server(app);
var io=require('socket.io').listen(server);

var storyPart = [];

var mongoose=require('mongoose');

//Modelo
var Word=require('./Model/word');

//Url para acceder a mongo
const dbMongo='mongodb://localhost:27017/dbStory';
const port=8085;

var currentWord="";


//Palabras que usa la aplicación
app.use(express.static('Public'));
app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());
app.use(cors());







