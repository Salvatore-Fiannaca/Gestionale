const mongoose = require('mongoose')
const validator = require('validator')
const { type } = require('jquery')

const clientsSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true 
    },
    lastName: {
        type: String,
        trim: true
    },
    fiscalCode: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    zipCode: {
        type: Number,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    phone: {
        type: Number,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    attachments: {
        avatar: {
            type: Buffer
        }
    }
},{
    timestamps: true
})

const Clients = mongoose.model('clients', clientsSchema) 

module.exports = Clients