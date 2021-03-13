var accessToken;
var trackName;

function spotifyToken() {
    $.ajax({
        type: "POST",
        url: "https://accounts.spotify.com/api/token",
        headers: {
            'Authorization': 'Basic NDk2Zjc0MzlhMDQ0NDk1Yjg0NjkzMGJiYWY3NmVlNjc6ZjM3NTljN2U3ZGRiNDcxYTlmYWNiNDIyODA4YzQ4M2M='
        },
        contentType: 'application/x-www-form-urlencoded',
        data: {
            'grant_type': 'refresh_token',
            'refresh_token': 'AQBQ0N5REBetfckj4Z_Or0yAqGQmKxmaMU3mlvwmFjmcntYU09aYG4uHqKmJMj8AYa8DHELwxs78nUjfWZ5l9HwRK6Ke4sO5C3piWVVnaqFFgBm1Noi4qebxnDZ3UH1l-8A'
        },
        success: function (data) {
            accessToken = data.access_token;
            console.log('Token successfuly refreshed');
        }
    });
};

function getSpotify() {
    $.ajax({
        type: "GET",
        url: "https://api.spotify.com/v1/me/player/currently-playing?market=CZ",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (data) {
            if (data.is_playing == true) {
                if (data.item.album.images.length != 0) {
                    var artwork = data.item.album.images[0].url;
                } else {
                    var artwork = 'img/vinyl.png';
                }
                trackName = data.item.name;
                var artistName = data.item.artists[0].name;
                var songLink = data.item.external_urls.spotify;
                var artworkID = document.getElementById('trackArtwork');
                var track = document.getElementById('trackName');
                var artist = document.getElementById('artist');
                var songLinkID = document.getElementById('spotifylink')
                artworkID.innerHTML = '<img src=' + artwork + '>';
                if (data.item.external_urls.spotify == undefined) {
                    songLinkID.innerHTML = ''
                } else {
                    songLinkID.innerHTML = '<a href="' + songLink + '"><img src="img/listen-on-spotify.png" alt="Listen on Spotify"  style="position: relative; max-width: 100%; margin-top: 5%"></a>'
                }
                track.textContent = trackName;
                artist.textContent = 'By ' + artistName;

                animate();
            } else {
                var artworkID = document.getElementById('trackArtwork');
                var track = document.getElementById('trackName');
                var artist = document.getElementById('artist');
                var songLinkID = document.getElementById('spotifylink')
                songLinkID.innerHTML = '';
                artworkID.innerHTML = '<img src=' + 'img/vinyl.png' + '>';
                track.textContent = '';
                artist.textContent = 'Nothing';
                animate();
            }

        },
        dataType: "json"
    });

};

function spotifyRefresh() {
    $.ajax({
        type: "GET",
        url: "https://api.spotify.com/v1/me/player/currently-playing?market=CZ",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (data) {
            var NewSongName = data.item.name;
            if (NewSongName !== trackName) {
                console.log("Track changed");
                getSpotify();
            }
        }
    });
}

function animate() {
    $('span#trackName').glitch({
        charTime: 20
    });
    $('span#artist').glitch({
        charTime: 20
    });
};

spotifyToken();
getSpotify();

setInterval(spotifyRefresh, 5000);
setInterval(spotifyToken, 1800000);
