const env = require("dotenv").config();
module.exports = {
  mongodb: {
    ATLAS_URI: `mongodb+srv://${process.env.MONOG_DB_USER}:${process.env.MONOG_DB_PASSWORD}@cluster0.cod8b.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`
  },
};
