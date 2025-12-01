const express = require('express');
const experienceController = require('../controllers/experienceController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

//apply auth middleware to all experience routes
router.use(authMiddleware);

//GET all experiences for a candidate
router.get('/candidate/:candidateId', experienceController.getExperiences); 
//POST create a new experience for a candidate
router.post('/candidate/:candidateId', experienceController.createExperience);
//PUT update an experience
router.put('/candidate/:candidateId/experience/:experienceId', experienceController.updateExperience);
//DELETE an experience
router.delete('/candidate/:candidateId/experience/:experienceId', experienceController.deleteExperience);

module.exports = router;