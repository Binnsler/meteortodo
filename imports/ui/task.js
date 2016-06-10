import{Meteor} from 'meteor/meteor';
import{Template} from 'meteor/templating';

import{Tasks} from '../api/tasks.js';

import './task.html';

Template.task.helpers({
  isOwner(){
    return this.owner === Meteor.userId();
  },
});

Template.task.events({
  'click .toggle-checked'(){
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this._id, !this.checked);
  },

  'click .delete'(){
    Meteor.call('tasks.setPrivate', this._id, !this.private);
  },

  'click .toggle-private'(){
    Meteor.call('tasks.setPrivate', this._id, !this.private);
  },
});


// Optimistic UI

// So why do we want to define our methods on the client and on the server? We do this to enable a feature we call optimistic UI.

// When you call a method on the client using Meteor.call, two things happen in parallel:

// 1. The client sends a request to the server to run the method in a secure environment, just like an AJAX request would work

// 2. A simulation of the method runs directly on the client to attempt to predict the outcome of the server call using the available information

// What this means is that a newly created tasks actually appears on the screen before the result comes back from the server. If the result from the server comes back and is consistent with the simulation on the client, everything remains as is. If the result on the server is different from the result of the simulation on the client, the UI is patched to reflect the actual state of the server.
