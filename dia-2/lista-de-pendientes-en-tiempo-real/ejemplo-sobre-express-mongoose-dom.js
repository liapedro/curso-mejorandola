var express  = require('express'),
	cons     = require('consolidate'),
	mongoose = require('mongoose'),
	Schema   = mongoose.Schema, 
	ObjectId = Schema.ObjectId,
	_        = require('underscore');

// Creamos conecion a la base de datos
mongoose.connect('mongodb://localhost/to_dos');

// Creamos Schemas
var ToDo = new Schema({
    id 		  : ObjectId,
    title     : String,
    completed : Boolean,
});

var ToDoList = new Schema({
    id 		  : ObjectId,
    title     : String,
	toDos     : [ToDo]	
});

// Creamos modelos y aplocacion de express
var List = mongoose.model('ToDoList', ToDoList);
List.prototype.toJSON = function() {
	console.log('to json', this);

	var toDoAsJson = {
		title : this.title,
		toDos : _.map(this.toDos, function(toDo){
			return {
				id : toDo._id,
				completed : toDo.completed,
				title : toDo.title
			}
		})
	}

	return toDoAsJson;
};


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
	List.find({title : req.params.name}, function (err, docs){
		if(err){
			console.log('err:', err);
			res.render('Hubo un error');
		}

		if(docs.length){
			var list = docs[0];

			console.log('before render',list.toJSON());
			res.render('index',{ pageName : list.title, toDoList : JSON.stringify( list.toJSON() ) });
		}else{
			// Si la lista no existe, la creamos
			// var list   = new List;
			// list.title = req.params.name;
			res.send('lol');
		}

		

	});
	
});

app.listen(3000);
console.log("Express server running at\n  => http://localhost:3000/\nCTRL + C to shutdown");