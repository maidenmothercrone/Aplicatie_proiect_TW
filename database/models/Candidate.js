const {DataTypes} = require('sequelize');
const {sequelize} = require('../server');
const { table } = require('console');
const User = sequelize.define('User');

//Candidate model definition - User -> Candidate relationship

const Candidate = sequelize.define('Candidate',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { 
            model: User,
            key: 'id'
    }},
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    summary: {
        type: DataTypes.STRING,
        defaultValue: 'active', //active, inactive, hired, rejected
    }
}, {
    tableName: 'candidates',
    timestamps: true
})

//Relationship definition: 1 User -> many Candidates

User.hasMany(Candidate, {foreignKey: 'userId', onDelete: 'CASCADE'});
Candidate.belongsTo(User, {foreignKey: 'userId'});

module.exports = Candidate;