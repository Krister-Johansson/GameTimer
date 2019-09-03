const db = require('../util/db')
const uuid = require('uuid')

// Set some defaults (required if your JSON file is empty)

// var top10 = data.sort(function(a, b) { return a.Variable1 < b.Variable1 ? 1 : -1; })
//             .slice(0, 10);



const users = {
    list() {
        return new Promise((resolve, reject) => {
            db('user').then(resolve).catch(reject)
        })
    },
    get(id) {
        return new Promise((resolve, reject) => {
            db.get('posts')
                .find({ id })
                .then(resolve)
                .catch(reject)
        })
    },
    create(name, email, phone, company) {
        return new Promise((resolve, reject) => {
            db.put({
                id: uuid.v4(),
                avatar: null,
                name,
                time: null,
                email,
                phone,
                company,
            })
                .then(resolve)
                .catch(reject)
        })
    },
}

module.exports = users
