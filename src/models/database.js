// Load dependencies
var mongoose = require('mongoose');
var randomstring = require("randomstring")

// Load project scripts
var settings = require('../settings/settings')

// Create schemas and models for mongo
var urlSchema = mongoose.Schema({
  url: String,
  short: String,
  campaign: {
    medium: String,
    source: String,
    name: String,
    content: String
  }
});

var urlModel = mongoose.model('url', urlSchema)

// Export db object to abstract CRUD operations
module.exports = {
  db: null,

  connect: function () {
    mongoose.connect('mongodb://' + settings.dbhost + ":" + settings.dbport + '/' + settings.dbname)
    this.db = mongoose.connection
    this.db.on('error', console.error.bind(console, 'connection error:'))
    this.db.once('open', function (callback) {
      console.log("Connected to database")
    });
  },

  get: function (short, callback) {
    console.log("Finding " + short)
    urlModel.findOne({short}, {}, {sort: {"created_at": -1}}, function (err, url) {
      console.log(url)
      callback(url)
    })

  },

  check_short: function (short, callback) {
    urlModel.findOne({short}, function (err, url) {
      callback(null, url)
    })
  },

  check_url: function (url, callback) {
    urlModel.findOne({url}, function (err, url) {
      callback(err, url)
    })
  },

  generate_short: function () {
    return randomstring.generate(settings.shortlength)
  },

  create: function (url, callback) {
    var db = this

    if (!url.short) {
      url.short = db.generate_short()
      userdefshort = false
    } else {
      userdefshort = true
    }

    db.check_short(url.short, function (err, result) {
      if (result) {
        console.log("Short code already exists")
        callback("Short code already exists", null)
      } else {
        db.check_url(url, function (err, result) {
          if (result && !userdefshort) {
            callback(null, result)
          } else {
            var newUrl = new urlModel(url)
            newUrl.save(function (error) {
              if (error) {
                console.log("Write to mongo failed")
                console.log(error)
                callback("Write to mongo failed", null)
              }
              console.log(newUrl)
              callback(null, newUrl)
            })
          }

        })
      }
    })
  }
}
