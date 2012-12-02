/**!
	Uses Element Controller pattern
	To control the to dos there are two views:
		One for a collection of items
		One for each items
*/

/**
	Application View
	Top level UI
*/
var application = application || {};

application.ApplicationView = Backbone.View.extend({
	/**
		View hook
	*/
	el: '#toDoApp',
	/**
		Template for to do list overview
	*/
	overviewTemplate: _.template($('#overviewTemplate').html()),
	/**
		Mapped events
	*/
	events: {
		'keypress #newToDo': 'createOnEnter',
		'click #clearCompleted': 'clearCompleted',
		'click #toggleAll': 'toggleAllComplete'
	},
	/**
		@function
		Initialises the view.
		Retrieves any to dos if they exist in local storage
		Initialise event binding
	*/
	initialize: function () {
		this.$input = this.$('#newToDo');
		this.$allCheckBox = this.$('#toggleAll')[0];
		this.$footer = this.$('#footer');
		this.$main = this.$('#main');

		window.application.ToDos.on('add', this.addOne, this);
		window.application.ToDos.on('reset', this.addAll, this);
		window.application.ToDos.on('change:completed', this.fiterOne, this);
		window.application.ToDos.on('filter', this.filterAll, this);
		window.application.ToDos.on('all', this.render, this);

		application.ToDos.fetch();
	},
	/**
		@function
		Renders out the to dos if they exist and 
		updates the overview in the footer
	*/
	render: function () {
		var completed = application.ToDos.completed().length,
			remaining = application.ToDos.remaining().length;

		if (application.ToDos.length) {
			this.$main.show();
			this.$footer.show();

			this.$footer.html(this.overviewTemplate ({
				completed: completed,
				remaining: remaining
			}));

			this.$('#filters li a')
				.removeClass('selected')
				.filter('[href="#/' + (application.ToDoFilter || '') + '"]')
				.addClass('selected');
		} else {
			this.$main.hide();
			this.$footer.hide();
		}

		this.$allCheckBox.checked = !remaining;
	},
	/**
		@function
		@toDo {Model} - a new to do item
		Creates a new to do view for a new item 
		and appends it to the dom
	*/
	addOne: function (toDo) {
		var view = new application.ToDoView({
			model: toDo
		});

		$('#toDoList').append(view.render().el);
	},
	/**
		@function
		Resets the to do list by clearing what exists
		in the DOM and creating a new list
	*/
	addAll: function () {
		this.$('#toDoList').html('');

		application.ToDos.each(this.addOne, this);
	},
	/**
		@function
		@toDo {Model} a to do item
		Toggles the visibility of the to do item
	*/
	filterOne: function (toDo) {
		toDo.trigger('visible');
	},
	/**
		@function
		Toggles the visibility of all to do items
	*/
	filterAll: function () {
		application.ToDos.each(this.filterOne, this)
	},
	/**
		@function
		Creates attributes for a new to do item
	*/
	createsAttributes: function () {
		return {
			title: this.$input.val().trim(),
			order: application.ToDos.nextOrder(),
			completed: false
		};
	},
	/**
		@function
		@event {Object} event object
		Creates a new to do item if the user 
		hits the enter key on the input and resets the value 
		of the input
	*/
	createOnEnter: function (event) {
		/**
			If the enter key is not pressed or the value of the input 
			is empty then escape out of the function
		*/
		if (event.which !== ENTER_KEY || !this.$input.val().trim()) {
			return;
		}

		application.ToDos.create(this.createsAttributes());
		this.$input.val('');
	},
	/**
		@function
		Destroy all completed to do items 
	*/
	clearCompleted: function () {
		_.each(window.application.ToDos.completed(), function (toDo) {
			toDo.destroy();
		});

		return false;
	},
	/**
		@function
		Sets all the to dos to complete
	*/
	toggleAllComplete: function () {
		var completed = this.$allCheckBox.checked;

		application.ToDos.each(function (toDo) {
			toDo.save({
				'completed': completed
			});
		});
	}
});