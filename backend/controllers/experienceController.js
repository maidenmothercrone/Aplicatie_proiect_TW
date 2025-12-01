const Candidate = require('../models/Candidate');
const Experience = require('../models/Experience');

//GET - retrieve all experiences for a candidate
exports.getExperiences = async (req, res) => {
    try {
        const {candidateId} = req.params;
        const userId = req.userId; //from auth middleware

        //check if candidate belongs to user
        const candidate = await Candidate.findOne({where: {id: candidateId, userId}});
        if(!candidate){
            return res.status(404).json({message: 'Candidate not found'});
        }

        const experiences = await Experience.findAll({where: {candidateId}});
        res.status(200).json(experiences);
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

//POST - create a new experience for a candidate
exports.createExperience = async (req, res) => {
    try {
        const {candidateId} = req.params;
        const userId = req.userId; //from auth middleware
        const {jobTitle, companyName, startDate, endDate, description} = req.body;

        //check if candidate belongs to user
        const candidate = await Candidate.findOne({where: {id: candidateId, userId}});
        if(!candidate){
            return res.status(404).json({message: 'Candidate not found', error: error.message});
        }

        const experience = await Experience.create({
            candidateId,
            jobTitle,
            companyName,
            startDate,
            endDate,
            description
        });
        res.status(201).json({message: 'Experience created successfully', experience
        })

    } catch (error){
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

//PUT - update an experience

exports.updateExperience = async(req, res) => {
    try{
        const {candidateId, experienceId} = req.params;
        const userId = req.userId; //from auth middleware
        const {jobTitle, companyName, startDate, endDate, description} = req.body;

        //check if candidate belongs to user
        const candidate = await Candidate.findOne({where: {id: candidateId, userId}});
        if(!candidate){
            return res.status(404).json({message: 'Candidate not found', error: error.message});
        }
        const experience = await Experience.findOne({where: {id: experienceId, candidateId}});
        if(!experience){
            return res.status(404).json({message: 'Experience not found'});
        }

        await experience.update({
            jobTitle: jobTitle || experience.jobTitle,
            companyName: companyName || experience.companyName,
            startDate: startDate || experience.startDate,
            endDate: endDate || experience.endDate,
            description: description || experience.description
        });
        res.status(200).json({message: 'Experience updated successfully', experience
        })

    } catch(error){
        return res.status(500).json({message: 'Server error', error: error.message});
    }
};

//DELETE = delete an experience

exports.deleteExperience = async(req, res) => {
    try{
        const {candidateId, experienceId} = req.params;
        const userId = req.userId; //from auth middleware

        //check if candidate belongs to user
        const candidate = await Candidate.findOne({where: {id: candidateId, userId}});
        if(!candidate){
            return res.status(404).json({message: 'Candidate not found', error: error.message});
        }
        const experience = await Experience.findOne({where: {id: experienceId, candidateId}});
        if(!experience){
            return res.status(404).json({message: 'Experience not found'});
        }

        await experience.destroy();
        res.status(200).json({message: 'Experience deleted successfully'});

    } catch(error){
        return res.response(500).json({message: 'Server error', error: error.message});
    }
}