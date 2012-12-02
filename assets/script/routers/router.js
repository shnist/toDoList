/**
	To do router
*/

var Router = Backbone.Router.extend({
	routes: {
		'*filter': 'setFilter'
	},
	/**
		@function
		@parameter {String}
		Sets the current filter to be used and 
		then trigger a filter event on the collection
		which will hide / unhide to do items as specified
	*/
	setFilter: function (parameter) {
		window.application.ToDoFilter = parameter.trim () || '';
		window.application.ToDos.trigger('filter');
	}
});

application.ToDoRouter = new Router();
// routes the initial url during page load
Backbone.history.start();