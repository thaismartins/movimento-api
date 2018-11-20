module.exports = {
  "port": process.env.PORT || "3000",
  "jwt": {
    "secret": process.env.SECRET || "8f0957de52ab298a415c0de79ffc2034",
    "session": {
      session: false
    }
  },
  "database": process.env.MONGODB || "mongodb://127.0.0.1:27017/mud"
};