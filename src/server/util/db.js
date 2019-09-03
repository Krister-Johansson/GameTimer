const fs = require('fs')
const path = '../data/db.json'
const init = database => {
    return new Promise((resolve, reject) => {
        fs.open(path, 'wx', (err, fd) => {
            if (err) {
                reject(err)
            } else {
                fs.close(fd, err => {
                    err ? reject(err) : resolve(fd)
                })
            }
        })
    })
}

module.exports = init
