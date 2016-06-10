import{Meteor} from 'meteor/meteor';
import{Template} from 'meteor/templating';
import{ReactiveDict} from 'meteor/reactive-dict';

import{Tasks} from '../api/tasks.js';

import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated(){
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
})

Template.body.helpers({
  // Show newest tasks at the top
  tasks(){
    const instance = Template.instance();
    // If hideCompleted is checked, filter tasks
    if(instance.state.get('hideCompleted')){
      return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
    }
    // Otherwise, return all of the tasks
    return Tasks.find({}, {sort: {createdAt: -1}});
  },

  incompleteCounter(){
    return Tasks.find({checked: {$ne: true}}).count();
  },
});

Template.body.events({
  'submit .new-task'(event){
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the Collection
    Meteor.call('tasks.insert', text);

    // Clear form
    target.text.value = '';
  },

  'change .hide-completed input'(event, instance){
    instance.state.set('hideCompleted', event.target.checked);
  },
});

// ReactiveDicts are reactive data stores for the client

// Until now, we have stored all of our state in collections, and the view updated automatically when we modified the data inside these collections. This is because Mongo.Colleciton is recognized by Meteor as a reactive data source, meaning Meteor knows when the data inside has changed. ReactiveDict is the same way, but not synced with the server like collections are. This makes a ReactiveDict a convenient place to store temporary UI state like the 'checkbox' above. Just like with collections, we don't have to write any extra code for the template to update when the ReactiveDict variable changes - just calling instance.state.get(...) inside the help is enough.

// Automatic accounts UI

// If our ass has the account-ui package, all we have to do to add a login dropdown is include the loginButtons template with {{> loginButtons}}. This dropdown detects which login methods have been added to the app and displays the appropriate controls. In our case, the only enabled login method is accounts-password, so the dropdown displays a password field. If you are adventurous, you can add the accounts-facebook package to enable Facebook login in your app - the Facebook button will automatically appear in the dropdown.

// Getting information about the logged-in user

// In your HTML, you can use the built-in {{currentUser}} helper to check if a user is logged in and get information about them. For example, {{currentUser.username}} will display the logged in user's username. In your JavaScript code, you can use Meteor.userId() to get the current users' _id, or Meteor.user() to get the whole user document.
