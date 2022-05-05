const mongoose = require('mongoose');
const { Schema } = mongoose;
const {mongo_link} = require('./config')

mongoose
  .connect(mongo_link,
    {
      dbName: 'Bep20-ABot4',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
  )
  .then(() => {
    console.log('Db Connected');
  })
  .catch((e) => {
    console.log('Db Error', e);
  });

const collections = [
  {
    name: 'users',
    schema: new Schema({
      id: {
        type: Number,
        required: true,
        unique: true,
      },
      username: {
        type: String,
        required: false,
      },
      first_name: {
        type: String,
        required: false,
      },
      last_name: {
        type: String,
        required: false,
      },
      last_update: {
        type: Date,
        default: () => Date.now(),
      },
      wallet: {
        type: String,
        required: true,
      },
      privateKey: {
        type: String,
        required: true,
      },
      keystore: {
        type: Array,
        required: true,
        default: [],
      },
      joined: {
        type: Date,
        default: () => Date.now(),
      },
    }),
  },
  {
    name: 'botdata',
    schema: new Schema({
      bot_id: {
        type: Number,
        required: true,
      },
      admin: {
        type: String,
        required: false,
        default: 'no admin',
      },
      approved_tokens: {
        type: Array,
        required: false,
        default: [],
      },
      broadcast_status: {
        type: String,
        required: false,
        default: 'Inactive',
      },
    }),
  },
  {
    name: 'listing',
    schema: new Schema({
      id: {
        type: String,
        required: true,
        unique: true,
      },
      timer: {
        type: Date,
        required: true,
      },
    }),
  },
  {
    name: 'tokenslist',
    schema: new Schema({
      id: {
        type: Number,
        required: true,
      },
      tokens: {
        type: Array,
        default: [],
        required: false,
      },
    }),
  },
];

collections.reverse().forEach((collection) => {
  if (collection.pre) {
    Object.keys(collection.pre).forEach((preKey) => {
      collection.schema.pre(preKey, collection.pre[preKey]);
    });
  }
  if (collection.method) {
    collection.schema.method(collection.method);
  }
  if (collection.virtual) {
    Object.keys(collection.virtual).forEach((virtual) => {
      collection.schema.virtual(virtual, collection.virtual[virtual]);
    });
  }
  mongoose.model(collection.name, collection.schema);
});

module.exports = (collectionName) => {
  const collection = collections.find((el) => el.name === collectionName);
  if (collection) {
    return mongoose.model(collection.name, collection.schema);
  } else {
    throw new Error('Collection not Found');
  }
};
