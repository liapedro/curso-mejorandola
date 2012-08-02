var express = require('express'),
	cons    = require('consolidate');

var app = express();

//Static files
app.use(express.static('./public'));

//View Engine
app.engine('html', cons.jqtpl);
// set .html as the default extension 
app.set('view engine', 'html');
app.set('views', './views');


app.get('/', function(req, res){
  	res.render('index',{ pageName : 'Home' });
});

app.get('/to-do/:name',function (req, res){
	res.render('index',{ pageName : req.params.name})
});

app.listen(3000);
console.log("Express server running at\n  => http://localhost:3000/\nCTRL + C to shutdown");