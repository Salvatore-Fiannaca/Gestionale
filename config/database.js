const mongoose = require("mongoose");
const validator = require("validator");

require("dotenv").config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 *
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 */

const conn = process.env.DB_STRING;

const connection = mongoose.createConnection(conn, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
  username: String,
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
        trim: true
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
        required: true,
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
        ref: 'User'
    },
    completed: {
      type: Boolean,
      default: false,
    }
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
        required: true
    },
    work: {
      title: {
        type: String,
        require: true,
        trim: true
      },
      folder: {
        title: {
          type: String,
          require: true
        },
        number: {
          type: Number
        }
      },
      comments: {
        type: String,
        default: ''
      },
      status: {
        type: String,
        default: ''
      }
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

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
      ref: 'User'
    }
})
const Upload = connection.model("Upload", UploadSchema);



const UploadForWork = new mongoose.Schema({
    title: String,
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
      ref: 'User'
    }
})
const UploadWork = connection.model("UploadWork", UploadForWork);

// Expose the connection
module.exports = connection;
