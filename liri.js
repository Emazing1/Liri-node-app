//APPLICATION COMMANDS
//node liri.js my-tweets
//node liri.js spotify-this-song 'some song'
//node liri.js movie-this 'some movie'
//node liri.js do-what-it-says



var command = process.argv[2];



switch(command){
    case 'my-tweets':
    console.log("Getting tweets, ....");

    if(process.argv[3]){
      var query = process.argv[3];
    } else {
      var query = '@Emazing1';
    }

    getTweets();
    logging();
    break;

  case 'spotify-this-song':
    console.log("Getting spotify info, ....");

    if(process.argv[3]){
      var query = process.argv[3];
    } else if (command =='do-what-it-says'){
      var query = query;
    } else {
      var query = 'whats my age again';
    }

    getSpotifyInfo();
    logging();
    break;

  case 'movie-this':
    console.log("Getting OMDB info, ....");

    if(process.argv[3]){
      var query = process.argv[3];
    } else {
      var query = "Mr. Nobody";
    }

    getMovieInfo();
    logging();
    break;

  case 'do-what-it-says':
    console.log("Reading random.txt, ....");

    getFromRandom();
    logging();
    break;
}



function getTweets(){
  var Twitter = require('twitter');
  var keys = require('./keys.js');
  var client = new Twitter(keys.twitterKeys);

  
  var params = {screen_name: query, count: 20};

  client.get('statuses/user_timeline', params, function(error, tweets, response){
    if (!error) {

      for(i=0; i<tweets.length;i++){
        console.log("Tweet #" + (i+1));
        console.log("Screen Name: @" + tweets[i].user.screen_name + " (" + tweets[i].user.name  + ")");
        console.log("Created: " + tweets[i].created_at);
        console.log("Tweet: " + tweets[i].text);
      }
    }
  })
};

function getSpotifyInfo(){
  var spotify = require('spotify');

  spotify.search({ type: 'track', limit: "1", offset: "1", query: query}, function(err, data) {
      if ( err ) {
          console.log('Error occurred: ' + err);
          return;
      }

      var spotifyData = data.tracks.items[0];

      console.log('');
      console.log('Your Song Query');
      console.log('artist: ' + spotifyData.artists[0].name);
      console.log('song title: ' + spotifyData.name);
      console.log('preview link: ' + spotifyData.external_urls.spotify);
      console.log('album: ' + spotifyData.album.name);
      
    })
};

function getMovieInfo(){

  

  var request = require('request');
  var queryURL = 'https://www.omdbapi.com/?type=movie&plot=short&r=json&t=' + query;

  request.get(queryURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var movieData = JSON.parse(response.body);

   


      for (var key in movieData) {
        if (key ==="Title" || key === "Year" || key === "Rated" || key === "Released" || key === "Director" || key === "Actors" || key === "Plot" || key === "Country" || key === "Language" || key === "imdbRating"){
          if (movieData.hasOwnProperty(key)) {
          
            console.log(key + ": " + movieData[key]);
          }
        }
      }
    }
  })
};

function getFromRandom(){
  var fs = require('fs');
  
  fs.readFile('./random.txt', "utf8", function(err, data){
    data = data.split(',');
    
    var command = data[0];
    var query = data[1];

    console.log('Command: ' + command);
    console.log('Query: ' + query);

    

    if(command =='spotify-this-song'){
      var spotify = require('spotify');

      spotify.search({ type: 'track', limit: "1", offset: "1", query: query}, function(err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }

        var spotifyData = data.tracks.items[0];
        var artists = spotifyData.artists;


        console.log('');
        console.log('Your Song Query *****');
        console.log('artist: ' + spotifyData.artists[0].name);
        console.log('song title: ' + spotifyData.name);
        console.log('preview link: ' + spotifyData.external_urls.spotify);
        console.log('album: ' + spotifyData.album.name);
        // console.log('release date: ' + data.release_date);
      });

    } else if (command == 'my-tweets'){
      var Twitter = require('twitter');
      var keys = require('./keys.js');
      var client = new Twitter(keys.twitterKeys);

      
      var params = {screen_name: query, count: 20};

      client.get('statuses/user_timeline', params, function(error, tweets, response){
        if (!error) {

          for(i=0; i<tweets.length;i++){
            console.log("Tweet #" + (i+1));
            console.log("Screen Name: @" + tweets[i].user.screen_name + " (" + tweets[i].user.name  + ")");
            console.log("Created: " + tweets[i].created_at);
            console.log("Tweet: " + tweets[i].text);
          }
        }
      });

    } else if (command == 'movie-this'){
      var request = require('request');
      var queryURL = 'https://www.omdbapi.com/?type=movie&plot=short&r=json&t=' + query;

      request.get(queryURL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var movieData = JSON.parse(response.body);






          for (var key in movieData) {
            if (key ==="Title" || key === "Year" || key === "Rated" || key === "Released" || key === "Director" || key === "Actors" || key === "Plot" || key === "Country" || key === "Language" || key === "imdbRating"
    ){
              if (movieData.hasOwnProperty(key)) {
               
                console.log(key + ": " + movieData[key]);
              }
            }
          }
        }
      })
    }
  })
};

function logging(){
  
  var fs = require('fs');

  var logTime = new Date();
  if(process.argv[3]){
    var logQuery = process.argv[3];
  } else if (!process.argv && command =='my-tweets') {
    var logQuery = '(@Emazing1)';
  } else if (command == 'do-what-it-says'){
    var logQuery = '(set in random.txt)';
  }

  fs.appendFile('liriLog.txt', logTime + ': ' + command + ' -- ' + logQuery + '\n');
}