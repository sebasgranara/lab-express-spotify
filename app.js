require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
    console.log("Success!");
  })
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.get("/", (req, res, next) => {
  res.render("index");
});
app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      console.log(data.body.artists.items);
      res.render("artist-search-results", {
        results: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  let artistId = req.params.artistId;
  console.log(artistId);
  spotifyApi.getArtistAlbums(artistId).then(
    function (data) {
      /*       console.log('Artist albums', data.body.items);
       */ res.render("albums", {
        albums: data.body.items.map((element) => ({
          name: element.name,
          id: element.id,
          image: element.images[0].url,
        })),
      });
    },
    function (err) {
      console.error(err);
    }
  );
});
// Our routes go here:

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
