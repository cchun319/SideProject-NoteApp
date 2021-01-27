const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


mongoose.connect("mongodb://localhost/noteappdb",{useNewUrlParser:true, useUnifiedTopology:true});

const N_SCHEMA = new mongoose.Schema({
    Title:String,
    Description:String,
    Pre:[],
    Next:[] // connection to other knowledge points
});

const NOTES = mongoose.model("NOTES", N_SCHEMA); 
const app = express();
const port = 3000;
const ROOT = __dirname;

app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());
app.engine('pug', require('pug').__express)

app.set("views", path.join(ROOT, "views"));
app.set("view engine", "pug");

const db = mongoose.connection;

db.on("error", console.error.bind(console, 'connect error'));
db.once('open',()=>{
    console.log("we are in ");
});


app.get('/', function(req, res)
{
    // res.sendFile(path.join(ROOT, "/views/index.html"));
    NOTES.find({}, (err, data)=>{
        var notes = data;
        // console.log(data);
        res.render("index", {Notes : notes});
    });
});

app.get('/NoteAdd', function(req, res)
{
    res.sendFile(path.join(ROOT, "/views/NoteAdd.html"));
});

app.get('/NoteUpdate/:id', function(req, res)
{
    console.log(req.params.id);
    // var note = NOTES.findOneAndUpdate({_id: req.params.id}, {useFindAndModify:false},{Title: req.body.title, Description: req.body.description}, (err)=>
    NOTES.findOne({_id: req.params.id}, (err, note)=>
    {
        if(err)
        {
            console.log("Update err: " + err);
        }
        res.render("NoteUpdate", {NOTE : note});

    });
    // res.status(200);
});

app.post('/NoteUpdate/:id', function(req, res)
{
    console.log(req.params.id);
    // var note = NOTES.findOneAndUpdate({_id: req.params.id}, {useFindAndModify:false},{Title: req.body.title, Description: req.body.description}, (err)=>
    NOTES.findOneAndUpdate({_id: req.params.id}, {Title:req.body.title, Description:req.body.description}, {returnOriginal:false},(err)=>
    {
        if(err)
        {
            console.log("Update err: " + err);
        }
        // res.render("NoteUpdate", {NOTE : note});

    });
    res.redirect('/');

    // res.status(200);
});

app.post('/Delete/:id', function(req, res)
{
    console.log(req.params.id);
    NOTES.findOneAndRemove({_id: req.params.id}, {useFindAndModify:false},(err)=>
    {
        console.log("delection err: " + err)
    });
    res.status(200);
    res.redirect('/');

});

app.post('/NoteAdd', function(req, res)
{
    // console.log(req.body);
    var newnote = new NOTES();
    newnote.Title = req.body.title;
    newnote.Description = req.body.description;
    newnote.save();
    res.status(200);
    res.redirect('/');
    // res.sendFile(path.join(ROOT, "/views/index.html")); 
});

app.listen(3000, ()=>{
    console.log(`listening on ${port}`);
});