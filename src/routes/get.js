// Load dependencies
var express = require('express')
var router = express.Router()

// Load project scripts
var db = require('../models/database.js')
var settings = require('../settings/settings')

// Start routing
router.get('/', function (req, res) {
  res.redirect(301, settings.rootredirect)
});

router.get('/unknown/:short', function (req, res) {
  message = "Error: Unknown short code '" + req.params.short + "'"
  res.status(404)
  res.render('pages/404', {"message": message})
  console.log(message)
});

router.get('/:short', function (req, res) {
  db.get(req.params.short, function (url) {
    if (url) {
      console.log('lol ' + url)
      return res.render('pages/redirect', {
        url: url.url,
        gtagConfig: {
          campaign: url.campaign
        },
        propertyId: settings.gaPropertyId,
      })
    } else {
      return res.redirect(301, "/unknown/" + req.params.short)
    }
  })
});

// Export router object for use in express
module.exports = router
