const express = require('express')
const favicon = require('serve-favicon')
const redirectSSL = require('redirect-ssl')
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.CALLBACK_URL,
})

app.use(
  redirectSSL.create({
    enabled: process.env.NODE_ENV === 'production',
  })
)

app.set('view engine', 'pug')
app.use(express.static('public'))
app.use(favicon(__dirname + '/public/favicon.ico'))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/search', (req, res) => {
  const q = req.query.q

  if (!q) return res.redirect('/')

  spotifyApi
    .clientCredentialsGrant()
    .then(function (data) {
      spotifyApi.setAccessToken(data.body['access_token'])
      return spotifyApi.searchTracks(q)
    })
    .then(function (data) {
      let returnArr = []

      for (track of data.body.tracks.items) {
        if (track.preview_url !== null) {
          artistArr = []

          for (artist of track.artists) {
            artistArr.push(artist.name)
          }

          returnArr.push({
            title: track.name,
            artists: artistArr.length > 1 ? artistArr.join(', ') : artistArr[0],
            album: track.album.name,
            album_art: track.album.images[track.album.images.length - 1].url,
            preview_url: track.preview_url,
          })
        }
      }

      res.render('search', { tracks: returnArr, q: q })
    })
    .catch(function (err) {
      console.log('Something went wrong:', err.message)
    })
})

app.listen(process.env.PORT, () => {
  console.log(`Listening on port: ${process.env.PORT}`)
})
