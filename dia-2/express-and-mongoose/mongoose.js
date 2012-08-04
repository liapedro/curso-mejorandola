// node mongoose.js "lista de super" create tocino
// node mongoose.js "lista de super" create sandias
// node mongoose.js "lista de super" display
// node mongoose.js "lista de super" remove sandias
// node mongoose.js "lista de super" display

// node mongoose.js	"lista de super" empty
// node mongoose.js	"lista de super" update tocino tocinos

var mongoose = require('mongoose'),
	Schema = mongoose.Schema, 
	ObjectId = Schema.ObjectId;

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

List.prototype.getToDosTitles = function() {
	return this.toDos.map(function(toDo){
		return toDo.title;
	});
};

// Tomos los parametros de ejecucion;
var toDoListTitle = process.argv[2],
	action        = process.argv[3],
	toDoName      = process.argv[4],
	newtoDoName   = process.argv[5];

// Encontramos la lista correta
List.find({title : toDoListTitle}, function (err, docs){
	//console.log(err, docs);

	if(docs.length){
		var list = docs[0];
	}else{
		// Si la lista no existe, la creamos
		var list   = new List;
		list.title = toDoListTitle;
	}

	if(action === "create"){
		list.toDos.push({ title: toDoName, completed : false });		

		console.log(toDoName + ' a sido agregada a la lista de tareas '+ toDoListTitle);
	}else if(action === "display"){
		console.log('Las tareas en '+ toDoListTitle +' son:', list
		 );
	}else if(action === "remove"){
		list.toDos = list.toDos.filter(function(toDo){
			return toDoName !== toDo.title
		});

		console.log(toDoName + ' a sido removida a la lista de tareas '+ toDoListTitle);
	}else if(action === "empty"){
		console.log('vaciando la lista '+ toDoListTitle + ' pero la lista todavia existe');

		list.toDos = [];
	}else if (action === "update"){
		list.toDos.forEach(function(toDo){
			if(toDo.title === toDoName){
				toDo.title = newtoDoName;
			}
		});
	}








	list.save(function(err){
		if(err){
			console.log('Err', err);
		}else{
			console.log('Yei!!! accion completada')
		}

		delete mongoose
	});
});


/*
List.prototype.getToDosTitles = function() {
	return this.toDos.map(function(toDo){
		return toDo.title;
	});
};

var list = new List;

list.title = "Lista del super";
list.toDos.push({ title: 'Sandia'    , completed : false });
list.toDos.push({ title: 'Camarones' , completed : false });
list.toDos.push({ title: 'Tide'      , completed : false });

console.log( list.getToDosTitles() );

list.save(function(err){
	console.log('error:', err);
});

//Remove all documents of list
/*
List.find({}, function (err, docs){
	console.log(err, docs);

	docs.forEach(function(doc){
		doc.remove();
	});
})
*/