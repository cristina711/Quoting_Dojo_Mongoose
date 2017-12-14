
var express = require("express");
var path = require("path");
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var port = 8000

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "./static")));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/quoting_dojo');


var QuoteSchema = new mongoose.Schema({
    name : {type:String,required:true,minlength:3},

    quote:{type:String,min:3,max:150, required: true},
},{timestamps:true});

mongoose.model('Quote',QuoteSchema);
var Quote = mongoose.model('quotes',QuoteSchema);



app.get('/', function(req, res) {
    res.render('create')
});

app.get('/quotes', function(req, res) {
    Quote.find({},function(err,quotes){
        if (err) {console.log(err);}
       
        res.render("index", {quotes: quotes});
    });

 });



// app.post('/quotes', function(req, res) {
//     Quote.create(req.body, function(err) {
//       if (err) { console.log(err); }
//       res.redirect('/quotes');
//     });
//   });
app.post('/quotes', function(req, res) {
    var quote = new Quote(req.body);
    quote.save(function(err){
        if(err){
            console.log("POST DATA", req.body);
            res.render('create',{errors: quote.errors})
        }
        else{
            res.redirect('/quotes');
            
        }
    })
})

 
// var user = new User({name: req.body.name, age: req.body.age});
// user.save(function(err){
//      if (err){
//          console.log('something went wrong');
//      }else{
//          console.log('successfully added a user!');
//          res.redirect('/');
//      }
 
//  // This is where we would add the user to the database
//  // Then redirect to the root route
// })




// tell the express app to listen on port 8000
app.listen(8000, function() {
 console.log("listening on port 8000");
});
