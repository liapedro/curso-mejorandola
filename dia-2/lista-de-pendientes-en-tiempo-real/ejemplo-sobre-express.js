var express  = require('express'),
	cons     = require('consolidate'),
	mongoose = require('mongoose'),
	Schema   = mongoose.Schema, 
	ObjectId = Schema.ObjectId,
	faye     = require('faye'),
	_        = require('underscore');

// Mongoose parts
mongoose.connect('mongodb://localhost/to_dos');

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

var List = mongoose.model('ToDoList', ToDoList);
List.prototype.toJson = function() {
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
// Express app
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
		//console.log(err, docs);

		if(docs.length){
			var list = docs[0];
			res.render('index',{ 
				list     : JSON.stringify( list.toJson() )
			});
		}else{
			// Si la lista no existe, la creamos
			var list   = new List;
			list.title = req.params.name;
			list.save(function(err){
				if(err){
					console.log('Err', err);
					res.send('Something went wrong!!!')
				}else{
					res.render('index',{ 
						list     : JSON.stringify( list.toJson() )
					});		
				}

			})
		}
	});
});

app.listen(3000);
console.log("Express server running at\n  => http://localhost:3000/\nCTRL + C to shutdown");














