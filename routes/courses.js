const express = require('express');
const router = express.Router();
const Joi = require('joi');

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
];

router.get('/', (req, res) => {//Route changed form '/api/courses'
    res.send(courses);
});

router.post('/', (req, res) => {//Route changed form '/api/courses'
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);// 400 'Bad request'

    const newCourse = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(newCourse);
    res.send(newCourse);
});

router.put('/:id', (req, res) => {//Route changed form '/api/courses/:id'
    const course = courses.find(course => course.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course ID you entered was not found.');

    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
});

router.delete('/:id', (req, res) => {//Route changed form '/api/courses/:id'
    const courseId = parseInt(req.params.id);
    const courseIndex = courses.findIndex((course) => course.id === courseId);
    if (courseIndex === -1) {
      return res.status(404).send('The course with the given ID was not found.');
    }
    const deletedCourse = courses.splice(courseIndex, 1)[0];
    res.send(deletedCourse);
  });

  router.get('/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
  
    const course = courses.find((course) => course.id === courseId);
  
    if (!course) {
      return res.status(404).send('The course with the given ID was not found.');
    }
  
    res.send(course);
  });  

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}

module.exports = router;