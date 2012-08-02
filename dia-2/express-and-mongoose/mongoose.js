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