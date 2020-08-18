const mongoose = require("mongoose");
const validator = require("validator");
const { isNumeric } = require("jquery");

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
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
  },
  {
    documents: {
      title: {
        type: String,
      },
      file: {
        type: Buffer,
      },
    },
    avatar: {
      type: Buffer,
    },
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
      file: {
        title: {
          type: String,
          trim: true
        },
        link: {
          type: Buffer,
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
    }
  },
  {
    timestamps: true
  }
)

const Work = connection.model("Work", worksSchema);


// TEST UPLOAD
const UploadSchema = new mongoose.Schema({
  file: Buffer
});
const Upload = connection.model("Upload", UploadSchema);

// Expose the connection
module.exports = connection;
