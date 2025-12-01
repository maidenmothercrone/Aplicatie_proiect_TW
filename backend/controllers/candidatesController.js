const Candidate = require('../models/Candidate');
const Experience = require('../models/Experience');

//GET - retrieve all candidates for the current user
exports.getCandidates = async (req, res) => {
    try {
        const userId = req.userId; //from auth middleware
        const candidates = await Candidate.findAll({where: {userId}, include: [Experience]});
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

//POST - create a new candidate
exports.createCandidate = async (req, res) => {
    try {
        const userId = req.userId; //from auth middleware
        const {firstName, lastName, email, phoneNumber, summary, status} = req.body;

        const candidate = await Candidate.create({
            userId,
            firstName,
            lastName,
            email,
            phoneNumber,
            summary,
            status: status || 'active'
        });
        res.status(201).json({message: 'Candidate created successfully', candidate});
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

//GET - retrieve 1 candidate with their experiences
exports.getCandidate = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.userId; //from auth middleware

        const candidate = await Candidate.findOne({
            where: {id, userId},
            include: [Experience]
        });
        if(!candidate){
            return res.status(404).json({message: 'Candidate not found'});
        }
        res.status(200).json(candidate);
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
    };

//PUT - update candidate

exports.updateCandidate = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.userId; //from auth middleware
        const {firstName, lastName, email, phoneNumber, summary, status} = req.body;

        const candidate = await Candidate.findOne({where: {id, userId}});
        if(!candidate){
            return res.status(404).json({message: 'Candidate not found'});
        }

        await candidate.update({
            firstName: firstName || candidate.firstName,
            lastName: lastName || candidate.lastName,
            email: email || candidate.email,
            phoneNumber: phoneNumber || candidate.phoneNumber,
            summary: summary || candidate.summary,
            status: status || candidate.status
        });
        res.status(200).json({message: 'Candidate updated successfully', candidate});
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

//DELETE - delete candidate
exports.deleteCandidate = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.userId; //from auth middleware
        const candidate = await Candidate.findOne({where: {id, userId}});
        if(!candidate){
            return res.status(404).json({message: 'Candidate not found'});
        }
        await candidate.destroy();
        res.status(200).json({message: 'Candidate deleted successfully'});
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
}