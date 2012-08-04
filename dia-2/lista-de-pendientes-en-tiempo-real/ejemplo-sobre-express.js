var express  = require('express'),
	cons     = require('consolidate'),
	mongoose = require('mongoose'),
	Schema   = mongoose.Schema, 
	ObjectId = Schema.ObjectId,
	faye     = require('faye'),
	_        = require('underscore');

//Faye server
var fayeServer = new faye.NodeAdapter({mount: '/faye'});
//log messages
var logger = {
	incoming: function(message, callback) {
		if( message.channel.search('/to-do/') === 0){
			//console.log('got message', message);

			List.find({title : message.data.listTitle}, function (err, docs){
				if(err){
					callback({error : "invalid list"});					
				}

				var list = docs[0];

				if(message.data.action === "update"){
					list.toDos.forEach(function(toDo){
						if(toDo._id+'' === message.data.toDo.id){
							toDo.title = message.data.toDo.title;
							toDo.completed = message.data.toDo.completed;
						}
					});					
				}

				console.log('list to be saved', list)
				list.save();
			})
		}

		callback(message);
	}
};
fayeServer.addExtension(logger);

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
				listTitle : list.title,
				list      : JSON.stringify( list.toJson() ),
				toDoTemplate : '<li id="to-do-${id}" to-do-id="${id}" {{if completed}}class="completed"{{/if}}><div class="view"><input class="toggle" type="checkbox" {{if completed}}checked="true"{{/if}}><label>${title}</label><button class="destroy"></button></div><input class="edit" value=""></li>'
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
						listTitle : list.title,
						list      : JSON.stringify( list.toJson() ),
						toDoTemplate : '<li id="to-do-${id}" to-do-id="${id}" {{if completed}}class="completed"{{/if}}><div class="view"><input class="toggle" type="checkbox" {{if completed}}checked="true"{{/if}}><label>${title}</label><button class="destroy"></button></div><input class="edit" value=""></li>'
					});		
				}

			})
		}
	});
});

fayeServer.listen(3001);
app.listen(3000);
console.log("Express server running at\n  => http://localhost:3000/\nCTRL + C to shutdown");
console.log("Faye    server running at\n  => http://localhost:3001/\nCTRL + C to shutdown");














