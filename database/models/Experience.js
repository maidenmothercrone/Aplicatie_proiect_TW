const {DataTypes} = require('sequelize');
const {sequelize} = require('../server');
const Candidate = require('./Candidate');

//Experience model definition - working experiences associated with Candidates

const Experience = sequelize.define('Experience',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    candidateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Candidate,
            key: 'id'
        }
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true // null if the candidate is currently employed
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true //optional description of the job role
    }
}, {
    tableName: 'experiences',
    timestamps: true
})

//Relationship definition: 1 Candidate -> many Experiences

Candidate.hasMany(Experience, {foreignKey: 'candidateId', onDelete: 'CASCADE'});
Experience.belongsTo(Candidate, {foreignKey: 'candidateId'});

module.exports = Experience;