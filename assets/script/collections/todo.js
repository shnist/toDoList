/**!
	To do collection

	The collection of to dos is persisted through html5 
	local storage
*/

var ToDoList = Backbone.Collection.extend({
	/**
		Model reference
	*/
	model: application.ToDo,
	localStorage: new Store('toDosBackbone'),
	/**
		@function
		Filter completed items
	*/
	completed: function () {
		return this.filter(function (toDo) {
			return toDo.get('completed');
		});
	},
	/**
		@function
		Filter uncompleted items
	*/
	remaining: function () {
		return this.without.apply(this, this.completed());
	},
	/**
		@function
		Generates an order number for the to 
		do items. Allows us to keep order despite being
		saved in local storage unordered
	*/
	nextOrder: function () {
		if (!this.length) {
			return 1;
		} else {
			return this.last().get('order') + 1;
		}
	},
	/**
		@function
		@toDo {Model} a to do item
		Returns the order number of the to do item
		to allow sorting 
	*/
	comparator: function (toDo) {
		return toDo.get('order');
	} 
});

application.ToDos = new ToDoList();