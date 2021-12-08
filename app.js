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
  spotifyApi.getArtistAlbums(artistId,{ limit: 10 }).then(
    function (data) {
      //const cosa=JSON.parse(JSON.stringify(data.body.items));
     /*  console.log("Artist albums", data.body.items); */
      return data.body.items;
     //res.render("albums",{albums:cosa})
      //console.log(JSON.parse(JSON.stringify(data.body.items)))
      //let name=data.body.items[0].name;
     /*  res.render("albums", {
        albums: [{name}]
      }); */
    },
    function (err) {
    }
  ).then(
    (albums)=>{
      res.render("albums",{albums})
    }
  );
});

app.get("/preview_tracks/:id",(req,res,next)=>{
  let albumId=req.params.id;
  spotifyApi.getAlbumTracks(albumId,{}).then(
    (response)=>{
      return response.body.items
    },
    (err)=>{
      console.log(err);
    }
  ).then(
    (tracks)=>{
      res.render("tracks",{tracks})
    }
  )
})

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
