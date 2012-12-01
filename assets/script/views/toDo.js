/**
	To Do View
	In charge of individual to do items
*/

application.ToDoVIew = Backbone.View.extend({
	tagName: 'li',
	template: _.template($('#itemTemplate').html()),
	/**
		Events hash
	*/
	events: {
		'dblclick label': 'edit',
		'keypress .edit': 'saveOnEnter',
		'blur .edit': 'saveChanges'
	},
	/**
		@function
		Initialises the view 
		We have a one to one relationship with the to do
		view, so we can hook them up directly
	*/
	init: function () {
		this.model.on('change', this.render, this);
	},
	/**
		@function
		Renders out the to do item
	*/
	render: function () {
		this.$el.html(this.template(this.model.toJSON()));
		this.$input = this.$('.edit');

		return this;
	},
	/**
		@function
		Edit mode of the to do item
	*/
	edit: function () {
		this.$el.addClass('editing');
		this.$input.focus();
	},
	/**
		@function
		Close edit mode and save changes
	*/
	saveChanges: function () {
		var value = this.$input.val().trim();

		if (value) {
			this.model.save({title: value});
		}

		this.$el.removeClass('editing');
	},
	/**
		@function
		@event {Object} the event object from the keyboard
		Hitting the enter key will save the changes 
		and remove edit mode
	*/
	saveOnEnter: function (event) {
		if (event.which === ENTER_KEY) {
			this.saveChanges();
		}
	}
});