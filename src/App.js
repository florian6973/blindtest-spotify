/*global swal*/

import React from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';
import { useState, useEffect } from 'react';

const apiToken = 'BQBSb8g8R8FdV8eT_5NumMRv1RWwmNIvZIu0GiUZRXonjrlaqAQNRBJ1rJRPC4f019wPD_ycg-XD29YII8YjPX6-O5QU8EZ-ar46OKByu_680tuLzC9zG7FuqF-YlXo6OzE0RlvJ8L__3DS7QopPQVfeJECz221WiyVgYsXatjxE';


function shuffleArray(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = getRandomNumber(counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}



/* Return a random number between 0 included and x excluded */
function getRandomNumber(x) {
  return Math.floor(Math.random() * x);
}

const AlbumCover = (props) =>  {
  return (
      <img src={props.currentTrack.track.album.images[0].url} style={{ width: 400, height: 400 }} />
  );
}

const App = () => {
  
  const [text, setText] = useState('');
  const [tracks, setTracks] = useState([]);
  const [songsLoaded, setSongsLoaded] = useState(false);
  const [currentTrack, setCurrentTrack] = useState();
  const [timeOut, setTO] = useState();
  //const [logo, setLogo] = useState("loading.svg");

  function randomExclude(x, table)
  {
    let val = getRandomNumber(x);
    while (table.includes(tracks[val].track.id))
      val = getRandomNumber(x);
    return val;
  }

  const newPlay = (tracks) =>
  {
        setCurrentTrack(tracks[getRandomNumber(tracks.length)]); 
        clearTimeout(timeOut);
        setTO(setTimeout(() => setCurrentTrack(tracks[getRandomNumber(tracks.length)]), 30000));
  }

  useEffect(() => { 
    fetch('https://api.spotify.com/v1/me/tracks', {
      method: 'GET',
      headers: {
      Authorization: 'Bearer ' + apiToken,
      },
    })
      .then(response => response.json())
      .then((data) => {
        console.log("Réponse reçue ! Voilà ce que j'ai reçu : ", data);
        let tr_bv = data.items.filter(item => item.track.preview_url != null);
        let lg = tr_bv.length;
        setText("Réponse : " + lg  + " morceaux");
        setTracks(tr_bv);
        //setCurrentTrack(data.items[getRandomNumber(lg)]); 
        newPlay(tr_bv);
        setSongsLoaded(true);
        //setLogo("logo.svg");
      })
  }, []);

  if (!songsLoaded){
    return <img src={loading} className="App-loading" alt="loading"/>
  }
  
  
  const track1 = currentTrack.track;
  const track2 = tracks[randomExclude(tracks.length, [track1.id])].track;
  const track3 = tracks[randomExclude(tracks.length, [track1.id, track2.id])].track;
  const selectedTracks=[track1, track2, track3];
  shuffleArray(selectedTracks);

  const checkAnswer = (id) =>
  {
    if (id == currentTrack.track.id)
      swal('Bravo', "You're a warrior!", 'success').then(() => newPlay(tracks));
    else
      swal('Try again', "Don't be so stupid!", 'error');
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <h1 className="App-title">Bienvenue sur le Blindtest</h1>
        <p>{text}</p>
        
      </header>
      <div className="App-images">
        <AlbumCover currentTrack={currentTrack}/>
          <Sound url={currentTrack.track.preview_url} playStatus={Sound.status.PLAYING}/>
      </div>
      <div className="App-buttons">
        {selectedTracks.map(item => (
      <Button onClick={() => checkAnswer(item.id)}>{item.name}</Button>))}
      </div>
      
      <ul>{
              tracks.map(function(track){
                return <li key={track.track.name}>{track.track.name}</li>;
              })
          }</ul>
    </div>
  );
}

export default App;

//<p>{JSON.stringify(currentTrack)}</p>