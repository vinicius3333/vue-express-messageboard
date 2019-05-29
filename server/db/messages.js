const Joi = require('joi');
const db = require('./connection');

const schema = Joi.object().keys({
    username: Joi.string().alphanum().required(),
    subject: Joi.string().required(),
    message: Joi.string().max(500).required(),
    imgURL: Joi.string().uri({
        scheme: [
            /https?/
        ]
    }),
    password: Joi.string().required()
});

const messages = db.get('messages');

function getAll() {
    return messages.find()
}

function remove(body) {
    return messages.find({_id: body.id})
        .then((response) => {
            response = response[0];
            if(response.password === body.password){
                return messages.remove({ _id: body.id});
            } else{
                return Promise.reject({
                    error: "Password incorrect"
                });
            }
        })
        .catch((error) => {
            console.log(error)
            return Promise.reject(error);
        });
}

function create(message) {
    if (!message.username) message.username = 'Anonymous';

    const result = Joi.validate(message, schema);
    if (result.error == null){
        message.created = new Date();
        return messages.insert(message);
    } else {
        return Promise.reject(result.error);
    }
}

module.exports = {
    getAll,
    create,
    remove
};