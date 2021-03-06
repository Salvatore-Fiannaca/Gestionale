const mongoose = require("mongoose");
const validator = require("validator");

const connection = require("../config/db")

require("dotenv").config();

/**
 * -------------- SCHEMA ----------------
 */

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
  },
  mail: {
    type: String,
    unique: true,
    trim: true,
  },
  forgot: {
    type: Boolean,
    default: false
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  links: [{
    title: String, 
    link: String
  }],
  hash: String,
});
const User = connection.model("User", UserSchema);

// Creates schema for Client
const clientsSchema = new mongoose.Schema(
  {
    profile: {
      firstName: {
        type: String,
        trim: true,
        required: true,
      },
      lastName: {
        type: String,
        trim: true,
      },
      fiscalCode: {
        type: String,
        unique: true,
        required: true,
        uppercase: true,
        trim: true,
        index: true,
      },
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      zipCode: {
        type: Number,
        trim: true,
      },
    },
    contacts: {
      email: {
        type: String,
        trim: true,
        lowercase: true,
        validate(value) {
          if (!validator.isEmail(value)) {
            throw new Error("Email is invalid");
          }
        },
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    archive: {
      type: Boolean,
      default: false,
    },
    count: Number,
  },
  {
    timestamps: true,
  }
);
const Client = connection.model("Client", clientsSchema);

// Creates schema for Work
const worksSchema = new mongoose.Schema(
  {
    client: {
      type: String,
      required: true,
    },
    work: {
      title: {
        type: String,
        require: true,
        trim: true,
      },
      folder: {
        title: {
          type: String,
          require: true,
        },
        number: {
          type: Number,
          trim: true
        },
      },
      comments: {
        type: String,
        default: "",
      },
      status: {
        type: String,
        default: "",
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Work = connection.model("Work", worksSchema);

const UploadSchema = new mongoose.Schema({
  client: String,
  fieldname: String,
  originalname: String,
  mimetype: String,
  destination: String,
  filename: String,
  path: String,
  size: Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});
const Upload = connection.model("Upload", UploadSchema);

const UploadForWork = new mongoose.Schema({
  client: String,
  fieldname: String,
  originalname: String,
  mimetype: String,
  destination: String,
  filename: String,
  path: String,
  size: Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});
const UploadWork = connection.model("UploadWork", UploadForWork);

const CounterSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  count: {
    type: Number,
    default: 1,
  },
});
const Count = connection.model("Count", CounterSchema);

module.exports = connection;
