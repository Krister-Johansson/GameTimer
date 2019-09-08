const User = require('../model/users')

const users = {
    list() {
        return new Promise((resolve, reject) => {
            User.find()
                .then(resolve)
                .catch(reject)
        })
    },
    get(_id) {
        return new Promise((resolve, reject) => {
            User.findById(_id)
                .then(resolve)
                .catch(reject)
        })
    },
    create(name, email, phone, company) {
        return new Promise((resolve, reject) => {
            let user = new User({
                name,
                email,
                phone,
                company,
            })
            user.save()
                .then(resolve)
                .catch(reject)
        })
    },
    update(id, data) {
        return new Promise((resolve, reject) => {
            User.findByIdAndUpdate(id, data, { new: true })
                .then(resolve)
                .catch(reject)
        })
    },
    remove(id) {
        return new Promise((resolve, reject) => {
            User.findByIdAndRemove(id)
                .then(resolve)
                .catch(reject)
        })
    },
    setTime(id, time) {
        return new Promise((resolve, reject) => {
            User.findByIdAndUpdate(id, {time}, { new: true })
                .then(resolve)
                .catch(reject)
        })
    },
    hiscore() {
        return new Promise((resolve, reject) => {
            User.find({ time: { $ne: null } }).sort({time: 'asc'})
                .then(resolve)
                .catch(reject)
        })
    },
    export() {
        return new Promise((resolve, reject) => {
            User.find().sort({time: 'asc'})
                .then(resolve)
                .catch(reject)
        })
    },
    nextPlayer() {
        return new Promise((resolve, reject) => {
            User.findOne({ time: { $eq: null } })
                .then(resolve)
                .catch(reject)
        })
    },
    leader() {
        return new Promise((resolve, reject) => {
            User.findOne({ time: { $ne: null } }).sort({time: 'asc'})
                .then(resolve)
                .catch(reject)
        })
    },
}

module.exports = users
