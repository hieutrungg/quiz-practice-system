const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');

router.get('/', subjectController.getAllSubjects);
router.post('/', subjectController.createSubject);
router.delete('/:id', subjectController.deleteSubject);
router.put('/:id', subjectController.updateSubject); 

module.exports = router;