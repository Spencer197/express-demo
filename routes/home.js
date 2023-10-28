const express = require('express');
const router = express.Router();

// Defines route to homepage.
router.get('/', (req, res) => {
    res.render('index', { title: 'My Express App', message: 'Hello, Spencer!'});
});

module.exports = router;