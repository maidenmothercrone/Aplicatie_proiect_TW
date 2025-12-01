const express = require('express');
const candidatesController = require('../controllers/candidatesController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

//apply auth middleware to all candidate routes
router.use(authMiddleware);

//GET all candidates
router.get('/', candidatesController.getCandidates);
//POST create a new candidate
router.post('/', candidatesController.createCandidate);
//GET a single candidate by id
router.get('/:id', candidatesController.getCandidate); 
//PUT update a candidate by id
router.put('/:id', candidatesController.updateCandidate);   
//DELETE a candidate by id
router.delete('/:id', candidatesController.deleteCandidate);

module.exports = router;