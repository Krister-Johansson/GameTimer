module.exports = (sequelize, DataTypes) => {
    const Player = sequelize.define(
        'player',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.TEXT,
            },company: {
                type: DataTypes.TEXT,
            },email: {
                type: DataTypes.TEXT,
            },phone: {
                type: DataTypes.TEXT,
            },
            time: {
                type: DataTypes.INTEGER,
            },
        },
        {
            freezeTableName: true,
        }
    )

    return Player
}
