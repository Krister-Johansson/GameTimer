'use strict'
module.exports = (sequelize, DataTypes) => {
    const Player = sequelize.define(
        'Player',
        {
            name: {
                type: DataTypes.TEXT,
            },
            company: {
                type: DataTypes.TEXT,
            },
            email: {
                type: DataTypes.TEXT,
            },
            phone: {
                type: DataTypes.TEXT,
            },
            time: {
                type: DataTypes.INTEGER,
            },
        },
        {}
    )
    Player.associate = function(models) {
        // associations can be defined here
    }
    return Player
}
