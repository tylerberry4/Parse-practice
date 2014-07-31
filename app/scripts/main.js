


$(function() {

	//Sets up a query(search) of our Parse database
  Parse.$ = jQuery;

  // Initialize Parse with the generated keys
	Parse.initialize("aKBJPjju513rs9dxsevlKAFi6Ckva8gJN9IAsRmm", "eUIS7bf7VkcxIDiXHEp9dS8TNOwBNWdh2xdZ3HFL");


  // Create Model
  var Todo = Parse.Object.extend("Todo", {});


  // The main view that lets a user sign out
  var ManageTodosView = Parse.View.extend({

    // event to click and logout 
    events: {
			"click .log-out": "logOut",
    },

    el: ".content",

    // Binding events
    initialize: function() {
      var self = this;

      _.bindAll(this, 'render', 'logOut');

      // Main management template
      this.$el.html(_.template($("#manage-todos-template").html()));
    },

    // Logs out the user and shows the login view
    logOut: function(e) {
      Parse.User.logOut();
      new LogInView();
      this.undelegateEvents();
      delete this;
    },
  });

	//Begin Log In View
  var LogInView = Parse.View.extend({
    events: {
      "submit form.login-form": "logIn",
      "submit form.signup-form": "signUp"
    },

    el: ".content",
    
    //binding the functions together
    initialize: function() {
      _.bindAll(this, "logIn", "signUp");
      this.render();
    },

    //saving the values of the login info
    logIn: function(e) {
      var self = this;
      var username = this.$("#login-username").val();
      var password = this.$("#login-password").val();
      
      Parse.User.logIn(username, password, {
        success: function(user) {
          new ManageTodosView();
          self.undelegateEvents();
          delete self;
        },

        //error message to show if login info is incorrect
        error: function(user, error) {
          self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
          self.$(".login-form button").removeAttr("disabled");
        }
      });

      this.$(".login-form button").attr("disabled", "disabled");

      return false;
    },

    //save input value of new user info
    signUp: function(e) {
      var self = this;
      var username = this.$("#signup-username").val();
      var password = this.$("#signup-password").val();

      this.$(".signup-form button").attr("disabled", "disabled");

      return false;
    },

    render: function() {
      this.$el.html(_.template($("#login-template").html()));
      this.delegateEvents();
    }
  });

  // The main view for the app
  var AppView = Parse.View.extend({
    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todoapp"),

    initialize: function() {
      this.render();
    },

    render: function() {
      if (Parse.User.current()) {
        new ManageTodosView();
      } else {
        new LogInView();
      }
    }
  });

  new AppView;
});





