/**
	To Do View
	In charge of individual to do items
*/

var application = application || {};

application.ToDoView = Backbone.View.extend({
	tagName: 'li',
	template: _.template($('#itemTemplate').html()),
	/**
		Events hash
	*/
	events: {
		'dblclick label': 'edit',
		'keypress .edit': 'saveOnEnter',
		'blur .edit': 'saveChanges',
		'click .toggle': 'toggleCompleted',
		'click .destroy': 'clear'
	},
	/**
		@function
		Initialises the view 
		We have a one to one relationship with the to do
		view, so we can hook them up directly
	*/
	initialize: function () {
		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this);
		this.model.on('visible', this.toggleVisible, this);
	},
	/**
		@function
		Renders out the to do item
	*/
	render: function () {
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.toggleClass('completed', this.model.get('completed'));
		this.toggleVisible();
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
	},
	/**
		@function
		Toggles visibility of to do item
	*/
	toggleVisible: function () {
		this.$el.toggleClass('hidden', this.isHidden());
	},
	/**
		@function
		Returns all hidden to dos
	*/
	isHidden: function () {
		var isCompleted = this.model.get('completed');

		return (
			(!isCompleted && application.ToDoFilter === 'completed') ||
			(isCompleted && application.ToDoFilter === 'active')
		);
	},
	/**
		@function
		Toggles the completed state of a to do item
	*/
	toggleCompleted: function () {
		this.model.toggle();	
	},
	/**
		@function
		Removes to do item from local storage
	*/
	clear: function () {
		this.model.destroy();
	}
});