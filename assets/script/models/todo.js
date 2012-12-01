/**!
	To do model
	@title {string} - title of the model
	@completed {boolean} - indicates whether to do is complete
*/

var application = app || {};

application.ToDo = Backbone.Model.extend({
	/**
		Default attributes
	*/
	defaults: {
		title: '',
		completed: false
	},
	/**
		@function
		Toggle the completed attribute of the to do item
	*/
	toggle: function () {
		this.save({
			completed: !this.get('completed');
		});
	}
});