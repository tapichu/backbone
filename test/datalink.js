$(document).ready(function() {

    module('Data Linking');

    var cleanMarkup = function() {
      $('#firstName').val('');
      $('#lastName').val('');
      $('#objFirst').text('');
      $('#objLast').text('');
    };

    var Person = Backbone.Model.extend({});
    var personData = {
      firstName: 'John',
      lastName: 'Lennon'
    };

    test('Datalink: no settings, view to model', function() {
      equals($('#firstName').val(), '', "Input firstName should be empty");
      equals($('#lastName').val(), '', "Input lastName should be empty");

      var person = new Person(personData);
      $('#myForm').link(person);
      var counter = {};
      counter.firstName = counter.lastName = 0;
      person.bind('change:firstName', function() { counter.firstName += 1; });
      person.bind('change:lastName', function() { counter.lastName += 1; });

      $('#firstName').val('George').trigger('change');
      equals(person.get('firstName'), 'George', "Object's firstName should match firstName input");
      equals(counter.firstName, 1, "Model should trigger a change:firstName");
      $('#lastName').val('Harrison').trigger('change');
      equals(person.get('lastName'), 'Harrison', "Object's lastName should match lastName input");
      equals(counter.lastName, 1, "Model should trigger a change:lastName");

      $('#myForm').unlink(person);
      cleanMarkup();
    });

    test('Datalink: no settings, model to view', function() {
      equals($('#firstName').val(), '', "Input firstName should be empty");
      equals($('#lastName').val(), '', "Input lastName should be empty");

      var person = new Person(personData);
      $('#myForm').link(person);

      person.set({
        firstName: 'George',
        lastName: 'Harrison'
      });
      equals($('#firstName').val(), 'George', "Input firstName should match object's firstName");
      equals($('#lastName').val(), 'Harrison', "Input lastName should match object's lastName");

      $('#myForm').unlink(person);
      cleanMarkup();
    });

    test('Datalink: multiple bindings, view to model to view', function() {
      equals($('#firstName').val(), '', "Input firstName should be empty");
      equals($('#lastName').val(), '', "Input lastName should be empty");
      equals($('#objFirst').text(), '', "objFirst span should be empty");
      equals($('#objLast').text(), '', "objLast span should be empty");

      var person = new Person(personData);
      $('#myForm').link(person);
      $('#objFirst').link(person, {
        firstName: {
          name: 'objFirst',
          convertBack: function(value, source, target) {
            $(target).text(value);
          }
        }
      });
      $('#objLast').link(person, {
        lastName: {
          name: 'objLast',
          convertBack: function(value, source, target) {
            $(target).text(value);
          }
        }
      });
      var counter = {};
      counter.firstName = counter.lastName = 0;
      person.bind('change:firstName', function() { counter.firstName += 1; });
      person.bind('change:lastName', function() { counter.lastName += 1; });

      $('#firstName').val('George').trigger('change');
      equals(person.get('firstName'), 'George', "Object's firstName should match firstName input");
      equals($('#objFirst').text(), 'George', "objFirst span should match firstName input");
      equals(counter.firstName, 1, "Model should trigger a change:firstName");
      $('#lastName').val('Harrison').trigger('change');
      equals(person.get('lastName'), 'Harrison', "Object's lastName should match lastName input");
      equals($('#objLast').text(), 'Harrison', "objLast span should match lastName input");
      equals(counter.lastName, 1, "Model should trigger a change:lastName");

      $('#myForm').unlink(person);
      $('#objFirst').unlink(person);
      $('#objLast').unlink(person);
      cleanMarkup();
    });

    test('Datalink: multiple bindings, model to multiple views', function() {
      equals($('#firstName').val(), '', "Input firstName should be empty");
      equals($('#lastName').val(), '', "Input lastName should be empty");
      equals($('#objFirst').text(), '', "objFirst span should be empty");
      equals($('#objLast').text(), '', "objLast span should be empty");

      var person = new Person(personData);
      $('#myForm').link(person);
      $('#objFirst').link(person, {
        firstName: {
          name: 'objFirst',
          convertBack: function(value, source, target) {
            $(target).text(value);
          }
        }
      });
      $('#objLast').link(person, {
        lastName: {
          name: 'objLast',
          convertBack: function(value, source, target) {
            $(target).text(value);
          }
        }
      });

      person.set({
        firstName: 'George',
        lastName: 'Harrison'
      });

      equals($('#firstName').val(), 'George', "Input firstName should match object's firstName");
      equals($('#lastName').val(), 'Harrison', "Input lastName should match object's lastName");
      equals($('#objFirst').text(), 'George', "objFirst span should match object's firstName");
      equals($('#objLast').text(), 'Harrison', "objLast span should match object's lastName");

      $('#myForm').unlink(person);
      $('#objFirst').unlink(person);
      $('#objLast').unlink(person);
      cleanMarkup();
    });

    test('Datalink: custom settings, view to model', function() {
      equals($('#firstName').val(), '', "Input firstName should be empty");
      equals($('#lastName').val(), '', "Input lastName should be empty");

      var person = new Person(personData);
      $('#myForm').link(person, {
        lastName: {
          name: 'firstName'
        }
      });
      var counter = {};
      counter.firstName = counter.lastName = 0;
      person.bind('change:firstName', function() { counter.firstName += 1; });
      person.bind('change:lastName', function() { counter.lastName += 1; });

      $('#firstName').val('George').trigger('change');
      equals(person.get('firstName'), 'John', "Object's firstName should not change");
      equals(counter.firstName, 0, "Model won't trigger a change:firstName");
      equals(person.get('lastName'), 'George', "Object's lastName should match firstName input");
      equals(counter.lastName, 1, "Model should trigger a change:lastName");
      $('#lastName').val('Harrison').trigger('change');
      equals(person.get('lastName'), 'George', "Object's lastName should still match firstName input");
      equals(counter.lastName, 1, "Model won't trigger a change:lastName");

      $('#myForm').unlink(person);
      cleanMarkup();
    });

    test('Datalink: custom mapping, view to model', function() {
      equals($('#firstName').val(), '', "Input firstName should be empty");
      equals($('#lastName').val(), '', "Input lastName should be empty");

      var person = new Person(personData);
      $('#myForm').link(person, {
        lastName: 'firstName'
      });
      var counter = {};
      counter.firstName = counter.lastName = 0;
      person.bind('change:firstName', function() { counter.firstName += 1; });
      person.bind('change:lastName', function() { counter.lastName += 1; });

      $('#firstName').val('George').trigger('change');
      equals(person.get('firstName'), 'John', "Object's firstName should not change");
      equals(counter.firstName, 0, "Model won't trigger a change:firstName");
      equals(person.get('lastName'), 'George', "Object's lastName should match firstName input");
      equals(counter.lastName, 1, "Model should trigger a change:lastName");
      $('#lastName').val('Harrison').trigger('change');
      equals(person.get('lastName'), 'George', "Object's lastName should still match firstName input");
      equals(counter.lastName, 1, "Model won't trigger a change:lastName");

      $('#myForm').unlink(person);
      cleanMarkup();
    });

});
