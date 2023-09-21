const mongoose = require('mongoose')

const makeMongoURI = (host, dbName, username, password) =>
  `mongodb://${username}:${password}@${host}:27017/${dbName}?authMechanism=DEFAULT`

let mongoServer;

const getMongoUri = async () => {
  if (process.env.NODE_ENV === 'test') {
    if (!mongoServer) {
      mongoServer = await MongoMemoryServer.create()
    }
    return mongoServer.getUri()
  }

  let mongoURI = process.env.MONGO_URI
  if (!mongoURI) {
    const {
      MONGODB_HOST,
      MONGODB_DATABASE,
      MONGODB_USERNAME,
      MONGODB_PASSWORD,
    } = process.env
    mongoURI = makeMongoURI(
      MONGODB_HOST,
      MONGODB_DATABASE,
      MONGODB_USERNAME,
      MONGODB_PASSWORD,
    )
  }
  return mongoURI
}

const connectDB = async (url) => {
  mongoose.connection.once('open', () => {
    console.log(`MongoDB successfully connected to ${url}`)
  })
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
}

const closeDB = async () => {
  await mongoose.disconnect()

  if (mongoServer) {
    await mongoServer.stop()
  }
}

module.exports = {
  connectDB,
  getMongoUri,
  closeDB
}
