
class TestVideo{

    state;

    elpasedTime;

    startTime;

    endTime;

    count;

    player;

    playerDom;

    outerFunctions;

    innerFunctions;

    id;

    clickedOnPlayAndPause;

    initFlag;

    playPauseButtonFlag;

    // input type range that denotes current elpase time of the Video
    elpasedSlider;

    /**
     * String current player's state either "playing", "paused", "stopped"
     */
    PlayerCurrentState;

    elpaseSliderFlag;


    constructor(url, manager, videoCounter){
        //init function for event on iframe first, it will be needed when initializing iframe
        this.outerFunctions = {};
        this.innerFunctions = {};

        this.id = videoCounter;
        this.clickedOnPlayAndPause = false;
        this.playPauseButtonFlag = false;
        this.elpaseSliderFlag = false;

        //1.init function that will be used by onPlayerReady and onPlayerStateChange
        //play: when it is getting played, it needs to keep updating this.elpasedTime
        this.innerFunctions.playVideo = ()=>{
            this.player.playVideo();
            manager.setCurrentlyPlaying(this);
        }
        //stop 
        this.innerFunctions.stopVideo = ()=>{
            this.player.stopVideo();
            manager.setCurrentlyPlaying(null);
        }
        //pause
        this.innerFunctions.pauseVideo = () =>{
            this.player.pauseVideo();
            //need to print elpased time if it goes back to PLAYiNG state 
        }

        //2,init onPlayerReady and onPlayerStateChange
        this.onPlayerReady = function onPlayerReady(event) {
            event.target.pauseVideo();
        }

        this.onPlayerStateChange = (event) => {
            if(event.data == YT.PlayerState.PLAYING){
                //when the video starts playing, inform manager
                //also, if newly set startTime has exceeded currentTime, use seekTo
                console.log("playing", this.player.getDuration());
                this.endTime = this.player.getDuration();
                this.PlayerCurrentState = "PLAYING";
                if(!this.playPauseButtonFlag){
                    this.changePlayPauseButton(this.clickedOnPlayAndPause);
                }  

                if(this.elpaseSliderFlag){
                    this.player.seekTo((this.elpasedSlider.value * this.endTime) / 100 , true);
                    this.elpaseSliderFlag = false;
                }
                
               
                if(this.startTime > this.player.getCurrentTime()){
                    this.player.seekTo(this.startTime, true);
                }
                //this.player.playVideo();
                this.innerFunctions.playVideo();
            }
            else if(event.data == YT.PlayerState.PAUSED){
                this.PlayerCurrentState = "PAUSED";
                if(!this.playPauseButtonFlag){
                    this.changePlayPauseButton(this.clickedOnPlayAndPause);
                }  
            }
            else if (event.data == YT.PlayerState.ENDED){
                this.PlayerCurrentState = "ENDED";
                this.innerFunctions.playVideo();
            }
            
            this.playPauseButtonFlag = false;
        }

        //wrapper for all layers 
        const videoContainer = document.createElement("div");
        videoContainer.setAttribute("id", `videoContainer${this.id}`);
        document.getElementById("backgroundContainerCol").appendChild(videoContainer);
        videoContainer.style.display = "flex";
        videoContainer.style.flexDirection = "column";
        videoContainer.style.gap = "15px";
        videoContainer.style.justifyContent = "center";
        videoContainer.style.alignContent = "center";
        videoContainer.style.padding = "20px";
        videoContainer.style.backgroundColor= "#d5dfe6";
        videoContainer.style.borderRadius = "20px";
        videoContainer.classList.add("Container");

        const div = document.createElement("div");
        //div.setAttribute("id", `testDIV${videoCounter}`);
        div.setAttribute("id", `testDIV${videoCounter}`);

        //tempHolder's style is always none 
        const tempHolder = document.getElementById("tempHolder");

        tempHolder.append(div);
       

        this.player = new YT.Player(`testDIV${videoCounter}`, {
            height: '300',
            width: '440',
            videoId: url,
            playerVars: {
              'playsinline': 1,
            },
            events: {
                'onReady': this.onPlayerReady,
                'onStateChange': this.onPlayerStateChange
            },
            
        });
        
        
        //set currentTime 

        

        //iframe element tag 
        //const iframe = document.getElementById("testDIV");
        const iframe = document.getElementById( `testDIV${videoCounter}`);

        this.startTime = 0;
        //set end time 
        
        //add events to button after iframe gets settled; moved from temporary div 
        


        //document.getElementById("player-container").appendChild(iframe);
        
        //1st layer has close, minimize buttons 
        const LayerButton1st = document.createElement("div");
        LayerButton1st.setAttribute("id", "LayerButton1st");
        

        let closeButton = document.createElement("button");
        closeButton.setAttribute("id", "closeButton");
        let closeI = document.createElement("i");
        closeI.setAttribute("class", "fa-solid fa-xmark");
        closeButton.appendChild(closeI);
        LayerButton1st.appendChild(closeButton);
       

        let minButton = document.createElement("button");
        minButton.setAttribute("id", "minButton");
        let minI = document.createElement("i");
        minI.setAttribute("class", "fa-solid fa-minus");
        minButton.appendChild(minI);
        LayerButton1st.appendChild(minButton);
       

        LayerButton1st.classList.add("LayerButton-1st");
        
        //appending 1st layer to videoContainer
        videoContainer.appendChild(LayerButton1st);
        

        //<div id="player-container"> that will have playerDom
        const playerContainer = document.createElement("div");
        playerContainer.setAttribute("id", "playerContainer");

        playerContainer.appendChild(iframe);
        
        videoContainer.appendChild(playerContainer);



        const LayerButton5th = document.createElement("div");
        LayerButton5th.setAttribute("id", "LayerButton5th");
        videoContainer.appendChild(LayerButton5th);

        this.elpasedSlider = document.createElement("input")
        LayerButton5th.appendChild(this.elpasedSlider);
        this.elpasedSlider.setAttribute("type", "range");
        this.elpasedSlider.setAttribute("id", `elpasedSlider-${this.id}`);
        this.elpasedSlider.value = 0;
        this.elpasedSlider.style.width = "100%";
        this.elpasedSlider.addEventListener("input", this.getEventFunctions("elpasedSlider"));
        videoContainer.appendChild(LayerButton5th);


        //3rd layer has play,replay,stop button
        const LayerButton3rd = document.createElement("div");
        LayerButton3rd.setAttribute("id", "LayerButton3rd");
        videoContainer.appendChild(LayerButton3rd);

        let replayButton = document.createElement("button");
        LayerButton3rd.appendChild(replayButton);
        replayButton.setAttribute("id", `replayButton-${this.id}`);
        let replyI = document.createElement("i");
        replyI.setAttribute("class", "fa-solid fa-reply");
        replayButton.appendChild(replyI);
        replayButton.addEventListener("click", this.getEventFunctions("replay"));

        let playButton = document.createElement("button");
        LayerButton3rd.appendChild(playButton);
        playButton.setAttribute("id", `playButton-${this.id}`);
        let playI = document.createElement("i");
        playI.setAttribute("class", "fa-solid fa-play");
        playButton.appendChild(playI);
        playButton.addEventListener("click", this.getEventFunctions("play"));

        let stopButton = document.createElement("button");
        LayerButton3rd.appendChild(stopButton);
        stopButton.setAttribute("id", `stopButton-${this.id}`);
        let stopI = document.createElement("i");
        stopI.setAttribute("class", "fa-solid fa-stop");
        stopButton.appendChild(stopI);
        stopButton.addEventListener("click", this.getEventFunctions("stop"));


        //LayerButton3rd.appendChild(playButton, stopButton, replayButton);
        
        LayerButton3rd.classList.add("LayerButton-3rd")

        //add LayerButton3rd to videoContainer
        

        /*
        const LayerButton4th = document.createElement("div");
        LayerButton4th.setAttribute("id", "LayerButton4th");
        
        const startTimeInput = document.createElement("input");
        startTimeInput.setAttribute("id", "startTimeInput");

        let startTimeButton = document.createElement("button");
        startTimeButton.setAttribute("id", "startTimeButton");
        startTimeButton.textContent = "startTime";
        startTimeButton.addEventListener("click",this.getEventFunctions("startTime"));

        const endTimeInput = document.createElement("input");
        endTimeInput.setAttribute("id", "endTimeInput");

        let endTimeButton = document.createElement("button");
        endTimeButton.setAttribute("id", "endTimeButton");
        endTimeButton.textContent = "endTime";
        endTimeButton.addEventListener("click",this.getEventFunctions("endTime"));

        LayerButton4th.appendChild(startTimeInput);
        LayerButton4th.appendChild(startTimeButton);
        LayerButton4th.appendChild(endTimeInput);
        LayerButton4th.appendChild(endTimeButton);
        */

        
        

        this.initFlag = true;
    }

    
    


    getEventFunctions(buttonName){
        
        switch (buttonName) {
            case "min":
                console.log("min");
                //get title 

                break;
        
            case "close":
                console.log("close");
                //remove all anchored events 
                //and remove all Dom elements then notify manager to delete current TestVideo
                break;

            case "play":
                
                const playEvent = ()=>{
                    const playButtonDomElement = document.getElementById(`playButton-${this.id}`);

                    //pause button has been clicked, change into play button 
                    if(!this.clickedOnPlayAndPause && this.initFlag == true){
                        console.log("play");
                        playButtonDomElement.children[0].setAttribute("class", "fa-solid fa-pause")
                        //make player to pause
                        this.player.playVideo();
                        //set clickedOnPlayAndPause to true
                        this.clickedOnPlayAndPause = true;
                    }
                    //play button has been clicked, change into pause button 
                    else if(this.clickedOnPlayAndPause && this.initFlag == true){
                        console.log("pause");
                        //change logo on button to pause; <i> tag under playbutton <button>
                        playButtonDomElement.children[0].setAttribute("class", "fa-solid fa-play")
                        //make player to pause
                        this.player.pauseVideo();
                        //set clickedOnPlayAndPause to true
                        this.clickedOnPlayAndPause = false;
                    }

                    this.playPauseButtonFlag = true;
                }
                return playEvent;
          
            case "stop":
                console.log("stop");
                const stopEvent = ()=>{
                    this.player.stopVideo();
                }
                return stopEvent;

            case "replay":
                console.log("replay");
                const replayEvent = ()=>{
                    this.player.stopVideo();
                    this.player.playVideo();
                }
                return replayEvent;

            case "startTime":
                console.log("startTime");
                const startTime = ()=>{
                    //get input from input tag under this.id 
                    //input's parent tag 
                    const LayerButton4th = document.getElementById(`testDIV${this.id}`).parentNode.parentNode.children[3];
                    //input tag 
                    this.startTime = LayerButton4th.children[0].value;
                }
                return startTime;
            case "endTime":
                console.log("endTime");
                const endTime = ()=>{
                    //get input from input tag under this.id 
                    //input's parent tag 
                    const LayerButton4th = document.getElementById(`testDIV${this.id}`).parentNode.parentNode.children[3];
                    //input tag 
                    this.endTime =  LayerButton4th.children[2].value;
                }
                return endTime;

            case "elpasedSlider": 
                const elpasedSlider = ()=>{
                    console.log("elpasedSlider");
                    //if player was not playing, play it first 
                    if(this.PlayerCurrentState != "PLAYING") this.player.playVideo();
                    //then set elpased slider 
                    
                    //case where player's state will be set as "PLAYING", function won't return to next line  
                    //until it finishes it's "PLAYING" state 
                    this.elpaseSliderFlag = true;

                  
                    this.player.seekTo((this.elpasedSlider.value * this.endTime) / 100 , true);
                    
                }
            return elpasedSlider;

            default:
                break;
        }


    }

    getCurrentTime(){
        return this.player.getCurrentTime();
    }

    getTitle(){
        const iframe = document.getElementById( `testDIV${this.id}`);
        return iframe.getAttribute("title");
    }

    checkCurrentTime(){
        if(this.player.getCurrentTime() < this.startTime ){
            this.player.seekTo(this.startTime, true);
        }
        //if current time on player surpassed endTime, replay 
        else if(this.player.getCurrentTime() > this.endTime){
            this.player.stopVideo();
            this.player.playVideo();
        }
    }

    /**
     * changes button's logo to pause and set clickedOnPlayAndPause false  if given clickedOnPlayAndPause is true
     * changes button's logo to play and set clickedOnPlayAndPause true  if given clickedOnPlayAndPause is false
     * @param {*bool} clickedOnPlayAndPause flag 
     */
    changePlayPauseButton(clickedOnPlayAndPause){
        const playButtonDomElement = document.getElementById(`playButton-${this.id}`);
        if(clickedOnPlayAndPause){
            playButtonDomElement.children[0].setAttribute("class", "fa-solid fa-play")
            //set clickedOnPlayAndPause to true
            this.clickedOnPlayAndPause = false;
        }else{
            playButtonDomElement.children[0].setAttribute("class", "fa-solid fa-pause")
            //set clickedOnPlayAndPause to true
            this.clickedOnPlayAndPause = true;
        }

    }

}


export default TestVideo;