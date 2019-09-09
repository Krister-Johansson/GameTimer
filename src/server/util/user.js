// const User = require('../model/users')
const Player = require('../model').Player
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const users = {
    list() {
        return new Promise((resolve, reject) => {
            Player.findAll()
                .then(resolve)
                .catch(reject)
        })
    },
    get(id) {
        return new Promise((resolve, reject) => {
            Player.findByPk(id)
                .then(resolve)
                .catch(reject)
        })
    },
    create(name, email, phone, company) {
        return new Promise((resolve, reject) => {
            Player.create({
                name,
                email,
                phone,
                company,
            })
                .then(resolve)
                .catch(reject)
        })
    },
    update(id, data) {
        console.log(id, data)
        return new Promise((resolve, reject) => {
            Player.update(data, {
                where: {
                    id: id,
                },
            })
                .then(resolve)
                .catch(reject)
        })
    },
    remove(id) {
        return new Promise((resolve, reject) => {
            Player.destroy({
                where: {
                    id: id,
                },
            })
                .then(resolve)
                .catch(reject)
        })
    },
    setTime(id, time) {
        return new Promise((resolve, reject) => {
            Player.update({time}, {
                where: {
                    id: id,
                },
            })
                .then(resolve)
                .catch(reject)
        })
    },
    hiscore() {
        return new Promise((resolve, reject) => {
            Player.findAll({
                where: {
                    time: {
                        [Op.ne]: null,
                    },
                },
                order:[
                    ['time', 'ASC'],
                ]
            })
                .then(resolve)
                .catch(reject)
        })
    },
    export() {
        return new Promise((resolve, reject) => {
            Player.findAll({
                order:[
                    ['time', 'ASC'],
                ]
            })
                .then(resolve)
                .catch(reject)
        })
    },
    nextPlayer() {
        return new Promise((resolve, reject) => {
            Player.findOne({
                where: {
                    time: {
                        [Op.eq]: null,
                    },
                }
            })
                .then(resolve)
                .catch(reject)
        })
    },
    leader() {
        return new Promise((resolve, reject) => {
            Player.findOne({
                where: {
                    time: {
                        [Op.ne]: null,
                    },
                },
                order:[
                    ['time', 'ASC'],
                ]
            })
                .then(resolve)
                .catch(reject)
        })
    },
}

module.exports = users
