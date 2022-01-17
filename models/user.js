module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        secretkey: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    })
    return user
}