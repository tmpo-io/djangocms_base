
App.Views.ExampleView = App.Views.Base.extend({ 

	initialize: function(opts) {
        _.extend(this, opts)       
    	
    	this.render()
    },

    render: function () {
    	console.log("works! i el parametre "+ this.parameter)
    }

});