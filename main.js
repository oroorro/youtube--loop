
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

  deleteVideo(id){
    this.Videos[id] = null;
  },

  getVideo(id){
    return this.Videos[id];
  },

  display(){
    //get Video's currentTime and check for range
    console.log("display");

    this.currentVideo.checkCurrentTime();
    this.currentVideo.elpasedSlider.value = this.currentVideo.getCurrentTime() * 100 / this.currentVideo.endTime;
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
  testplayer.stopVideo();
}







//when user click on loop me button, add a TestVideo instance to manger:Object variable 
document.getElementById("addressButton").addEventListener("click",(event)=>{
   
    //get url from input bar 
    url = document.getElementById("fname").value;
    
    const id = getId(url)

    //make a new TestVideo with retrived Youtube video Id from url 
    manager.Videos[manager.videoCounter] = new TestVideo(id, manager, manager.videoCounter);
    
    //make temporary iframe to get title of TestVideo
    getTitle(manager.videoCounter)
    //increase current number of TestVideos that manager holds 
    manager.videoCounter++;
    //make  input bar to be empty 
    document.getElementById("fname").value = "";
   
});


//temporary id 
let playerCnt = 2;

//making temporary ifram to get it's title 
//iframe's title attribute only gets displayed when it starts playing 
function getTitle(videoCounter){
  url = document.getElementById("fname").value;

  const div = document.createElement("div");
  div.setAttribute("id", `player${playerCnt}`);

  document.getElementById("tempHolder").appendChild(div);

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

    const observer = new MutationObserver(() => {
      //console.log('title has changed', iframe.getAttribute("title"));
      if(iframe.getAttribute("title") != "YouTube video player"){
        manager.getVideo(videoCounter).setTitle(iframe.getAttribute("title"));
      }
     
      //console.log(manager);
      //testplayer does not need to be played 
      testplayer.stopVideo();
      //delete testplayer's iframe 
      document.getElementById("tempHolder").removeChild(iframe);
    });
    
    //get changed title from testplayer when it's title change 
    observer.observe(iframe, {
      attributes: true,
      attributeFilter: ['title'],
      subtree: true
    });
    
    playerCnt++

}






//getting Id for given url link
//@url:String the url link
function getId(url) {
  let regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
  return regex.exec(url)[3];
}




(function () {

  function youTubePlayerDisplayInfos() {
    if(manager.currentVideo){
      manager.display();
    }
  }
  function init() {
    // Set timer to display infos
    setInterval(youTubePlayerDisplayInfos, 100);
  }

  if (window.addEventListener) {
      window.addEventListener('load', init);
  } else if (window.attachEvent) {
      window.attachEvent('onload', init);
  }
}());