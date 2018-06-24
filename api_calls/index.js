const YELP_API_KEY = require('../environ').YELP_API_KEY;
const yelp = require('yelp-fusion');
const client = yelp.client(YELP_API_KEY);

function api_calls(app) {
  app.get('/api/search', searchBusinesses);
  app.get('/api/business/:id/photos', searchPhotosForBusiness);
  app.get('/api/business/:id', searchBusinessById)
}

function searchBusinessById(req, res) {
  let id = req.params['id'];

  client.business(id)
    .then(response => {
      res.json(response.jsonBody);
    })
    .catch(e => res.send(e));
}

function searchBusinesses(req, res) {
  let searchRequest = {
    term: req.query['term'],
    location: req.query['location'],
    categories: "restaurants"
  };

  client.search(searchRequest)
    .then(response => {
      res.json(response.jsonBody.businesses);
    })
    .catch(e => {
      console.log("searchYelp");
      res.send(e);
    });
}

function searchPhotosForBusiness(req, res) {
  let id = req.params['id'];

  client.business(id)
    .then(response => {
      let photos = response.jsonBody.photos.map(photo => {
        return {src: photo, businessId: id};
      });
      res.json(photos);
    })
    .catch(e => {
      console.log("searchYelp");
      res.send(e);
    });
}

module.exports = api_calls;