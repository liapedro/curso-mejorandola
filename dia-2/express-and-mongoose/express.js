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

var mensajes =[];

app.get('/', function(req, res){
  	res.render('index',{ pageName : 'Hello world' });
});

app.get('/to-do/:name',function (req, res){
mensajes.push(req.params.name);
res.render('index',{ pageName : JSON.stringify(mensajes) });
});





app.listen(3000);
console.log("Express server running at\n  => http://localhost:3000/\nCTRL + C to shutdown");








