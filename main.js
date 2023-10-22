
import noUiSlider from './noUiSlider-15.7.1/dist/nouislider.mjs';
import Video from "./Video.js";
import TestVideo from './TestVideo.js';

/*
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3_DMwmLcGmT3p1L4zGcJ6427lharpx4M",
  authDomain: "timed-loop.firebaseapp.com",
  projectId: "timed-loop",
  storageBucket: "timed-loop.appspot.com",
  messagingSenderId: "540752271920",
  appId: "1:540752271920:web:b69d32d3d602416997abf5",
  measurementId: "G-FLF54VLCL6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
*/


//get input 


let url;
var player;
var player1;
var testplayer;

var fromFlag = false;

document.getElementById("fromSlider").addEventListener("mousedown",(e)=>{
  fromFlag = true;
})

document.addEventListener("mousemove",(e)=>{
  //if range slider was getting dragged get it's position 
 
  
  if(fromFlag){
    document.getElementById("sliderFromBlock").style.width = e.clientX + "px";
  }
  
})


window.addEventListener("mouseup",(e)=>{
  if(fromFlag) fromFlag = false;
});


var manager ={
  //Video that is currently on PLAYING state 
  currentVideo: null,

  setCurrentlyPlaying(Video){
    //first check if the given Video is currentVideo

    //if not then change it 

    //if given Video is null 
    this.currentVideo = Video;

  },

  // holds map of Video
  //          key: value
  // videoCounter: Video instance
  Videos: {},

  //used as id when assigning Video
  videoCounter: 0, 

  deleteVideo(){

  },

  getVideo(id){
    return this.Videos[id];
  },

  display(){
    //get Video's currentTime and check for range
    console.log("display");

    this.currentVideo.checkCurrentTime();
    this.currentVideo.elpasedSlider.value = this.currentVideo.getCurrentTime() * 100 / this.currentVideo.endTime;
    console.log(this.currentVideo.getTitle(), this.currentVideo.getCurrentTime());
    //handle a case where this.currentVideo.getCurrentTime() exceeded it's startTime 
    

    //get Video's start time 

    //get Video's end time 
  },

}



function onYouTubeIframeAPIReady() {
  console.log("YT")
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'QC8iQqtG0hg',
    playerVars: {
      'playsinline': 1,
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    },
    
  });

  player.personalPlayer = {'currentTimeSliding': false,
                                    'errors': []};

}


function getPlayTime(){
  console.log(player1.getDuration(), player1.getCurrentTime());
}

function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
var stateManager;

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 2000);
    done = true;
  }

  if(YT.PlayerState.PLAYING){
    console.log(this);
  }

  //event.target.playVideo();
  /*
  if(player1.getCurrentTime() > 5){
    player1.stopVideo();
    player1.playVideo();
  } 
  */
}
function stopVideo() {
  player.stopVideo();
}


let video2; 
function makeTempVideo(){

  const onlyForNameDiv = document.createElement("div");
  onlyForNameDiv.setAttribute("id", "onlyForNameDiv");

  const tempHolder = document.getElementById("tempHolder");
  tempHolder.append(onlyForNameDiv);

  const onPlayerReady = function(event) {
      event.target.playVideo();
  }

  let tempPlayer = new YT.Player("onlyForNameDiv", {
    height: '300',
    width: '440',
    videoId: url,
    events: {
        'onReady': onPlayerReady,
    }
    });
  iframe = document.getElementById( "onlyForNameDiv");
  tempHolder.append(iframe);

}

let testV
let testFlag = false;
let nameTag;
document.getElementById("addressButton").addEventListener("click",(event)=>{
    url = document.getElementById("fname").value;

    function getId(url) {
        let regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
        return regex.exec(url)[3];
      }

   
    console.log(getId(url));

    //wrapp allthis into create Video

    
    //tempVideoPlayer.playVideo();
    //const name = tempVideoPlayer.getTitle();
    //tempVideoPlayer.stopVideo();
    //testV = new Video(getId(url), nameTag);
    //testV.getPlayerTitle();
    //testFlag = true;

    manager.Videos[manager.videoCounter] = new TestVideo(getId(url), manager, manager.videoCounter);
    manager.videoCounter++;
    

    //video2 = new TestVideo(getId(url), manager);
    //create iframe tag 
    
    //put src 
    //setTimeout(console.log(testV.getPlayerTitle()),5000)
});

/*
if(testFlag){
  setInterval(console.log(testV.getPlayerTitle()),300);
  testFlag = false;
}
*/


let playerCnt = 2;
//testing premaking iframe then passes Dom element of anchored player
//and created player instance into another class
document.getElementById("addressTestButton").addEventListener("click",(event)=>{
  url = document.getElementById("fname").value;

  console.log(getId(url));

  const div = document.createElement("div");
  div.setAttribute("id", `player${playerCnt}`);

  //document.getElementById("player-container").appendChild(div);
  
  function onYouTubeIframeAPIReady() {
    
    testplayer = new YT.Player(div.getAttribute("id"), {
        height: '390',
        width: '480',
        videoId: getId(url),
        playerVars: {
          'playsinline': 1,
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        },
        
      });
    
    }
    onYouTubeIframeAPIReady();

    const iframe = document.getElementById(`player${playerCnt}`);
    playerCnt++
    //then pass it to Video class 
    video2 = new Video(testplayer, iframe);


})

function getId(url) {
  let regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
  return regex.exec(url)[3];
}

/*
document.getElementById("minusButton").addEventListener("click", ()=>{
  function onYouTubeIframeAPIReady() {
    
    player1 = new YT.Player('player1', {
      height: '390',
      width: '480',
      videoId: 'llGkzOG0pvo',
      playerVars: {
        'playsinline': 1,
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      },
      
    });
  
  }
  onYouTubeIframeAPIReady();

})



*/




(function () {

  function youTubePlayerDisplayInfos() {
    //console.log("display")
    //window.removeEventListener('load', init);
    //window.onload = null;

    if(manager.currentVideo){
      manager.display();
    }
  }

  function init() {

    // Set timer to display infos
    setInterval(youTubePlayerDisplayInfos, 500);
  }

  if (window.addEventListener) {
      window.addEventListener('load', init);
  } else if (window.attachEvent) {
      window.attachEvent('onload', init);
  }
}());