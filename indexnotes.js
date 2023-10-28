//const startupDebugger = require('debug')('app:startup');//Defines namespace for debuggin messages.
//const dbDebugger = require('debug')('app:db');//Defines a namespace for debugging database related messages.
const debug = require('debug')('app:startup');//Used for app:startup debugging only
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi'); // Require the Joi dependency.
const logger = require('./logger');
const authenticator = require('./authenticator');
const express = require('express');
const app = express();

app.set('view engine', 'pug');//Sets the view/templating engine, which is 'pug'.Autoloaded so, don't 'require it.
app.set('views', './views');//Overwrites the path to the templates.  All templates should be in ./views
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')}`); *demo code* 6. Enviroments

app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));//The Public folder contains static file like CSS & images.
app.use(helmet());

//Configuration
console.log('Application Name: ' + config.get('name'));//Displays app name in default.json
console.log('Mail Server: ' + config.get('mail.host'));//Displays mail host in development.json
console.log('Mail Password: ' + config.get('mail.password'));

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    //startupDebugger('Morgan is enabled....');//If in development env.
    debug('Morgan is enabled....');//replaces line above to start app:startup only.
}

//DB work....
//dbDebugger('Connected to the Database!');//Starts dbDebugger

app.use(logger);//Installs logger.js

app.use(authenticator);//Installs authentictor.js

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
];

// Defines a route
app.get('/', (req, res) => {
    //res.send('Hello, Spencer! Great to see you!'); // 'route handler'
    res.render('index', { title: 'My Express App', message: 'Hello, Spencer!'});//Renders pug html template
});

app.get('/api/courses', (req, res) => {
    res.send(courses); // Returns the courses array.
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);// 400 'Bad request'

    const newCourse = {
        id: courses.length + 1, // Assigns id on the server
        name: req.body.name
    };
    courses.push(newCourse);
    res.send(newCourse); // Sends the course object to the client.
});
  

app.put('/api/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
  
    // Find the index of the course with the specified ID
    const courseIndex = courses.findIndex((course) => course.id === courseId);
  
    // If the course doesn't exist, return a 404 response
    if (courseIndex === -1) {
      return res.status(404).send('The course with the given ID was not found.');
    }
  
    // Validate the course data using a function (validateCourse) - assuming you have such a function
    const { error } = validateCourse(req.body);
    
    // If validation fails, return a 400 response with the validation error message
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
  
    // Update the course with the new data from the request body
    const updatedCourse = {
      id: courseId,
      name: req.body.name, // Assuming your request body contains a "name" field
      // Add other properties as needed
    };
  
    // Replace the course in the array with the updated course
    courses[courseIndex] = updatedCourse;
  
    // Return the updated course as a response
    res.send(updatedCourse);
  });
  
// *Mosh's app.put code*
// app.put('/api/courses/:id', (req, res) => {
//     //Look up the course.  If not found => return 404.
//     const course = courses.find(c => c.id === parseInt(req.params.id)); // Returns a boolean value Y/N. ParseInt() parses the returned string into an integer.
//     if (!course) return res.status(404).send('The course ID you entered was not found.');
    
//     //Reuses validateCourse() below.
//     //'Object Destructuring' uses curly braces, we only need the error property of target object of validateCourse().
//     const { error } = validateCourse(req.body);
//     if (error) return res.status(400).send(error.details[0].message);// 400 'Bad request'    

//     //Update course
//     course.name = req.body.name;
//     //Return the updated course
//     res.send(course);
// });

app.put('/api/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
  
    // Find the index of the course with the specified ID
    const courseIndex = courses.findIndex((course) => course.id === courseId);
  
    // If the course doesn't exist, return a 404 response
    if (courseIndex === -1) {
      return res.status(404).send('The course with the given ID was not found.');
    }
  
    // Validate the course data using a function (validateCourse) - assuming you have such a function
    const { error } = validateCourse(req.body);
    
    // If validation fails, return a 400 response with the validation error message
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
  
    // Update the course with the new data from the request body
    const updatedCourse = {
      id: courseId,
      name: req.body.name, // Assuming your request body contains a "name" field
      // Add other properties as needed
    };
  
    // Replace the course in the array with the updated course
    courses[courseIndex] = updatedCourse;
  
    // Return the updated course as a response
    res.send(updatedCourse);
  });
  
// *Mosh's app.delete code*
// app.delete('/api/courses/:id', (req, res) => {
//     //Look up the course
//     //If not found, return 404
//     const course = courses.find(c => c.id === parseInt(req.params.id));//Returns boolean Y/N. ParseInt() parses returned string to integer.
//     if (!course) return res.status(404).send('The course ID you entered was not found.');
//     //Delete course
//     const index = courses.indexOf(course);//Store courses index in const 'index'.
//     courses.splice(index, 1);//Use splice() to remove course from courses array.
//     //Return Deleted course
//     res.send(course);
// });

//ChatGPT altered app.delete code: works with Postman.
app.delete('/api/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
  
    // Find the index of the course with the specified ID
    const courseIndex = courses.findIndex((course) => course.id === courseId);
  
    // If the course doesn't exist, return a 404 response
    if (courseIndex === -1) {
      return res.status(404).send('The course with the given ID was not found.');
    }
  
    // Remove the course from the array
    const deletedCourse = courses.splice(courseIndex, 1)[0];
  
    // Return the deleted course as a response
    res.send(deletedCourse);
  });

//Validates a course with all logic in one place.
function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);//Validates course, argument passed to validate(), reuturns result to caller.  
}

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id)); // Returns a boolean value Y/N. ParseInt() parses the returned string into an integer.
    if (!course) return res.status(404).send('The course ID you entered was not found.'); // Returns 404 if the course is not found.
    res.send(course);
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
