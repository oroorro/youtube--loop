
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

    manager;

    /** represents the title of iframe, it will be assigned after temporary iframe being played */
    title;

    //
    //@url:Number id of Youtube video
    //@manger:Object a variable that manages all videos 
    //@videoCounter:Number the number of total videos in manager
    constructor(url, manager, videoCounter){
        //init function for event on iframe first, it will be needed when initializing iframe
        this.outerFunctions = {};
        this.innerFunctions = {};

        this.id = videoCounter;
        this.clickedOnPlayAndPause = false;
        this.playPauseButtonFlag = false;
        this.elpaseSliderFlag = false;
        this.title = "";

        this.manager = manager;

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
     
        div.setAttribute("id", `testDIV${videoCounter}`);

        //tempHolder's style is always none 
        const tempHolder = document.getElementById("tempHolder");

        tempHolder.append(div);
       
        console.log("TestVideo id: ", url);

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
        LayerButton1st.appendChild(closeButton);
        closeButton.setAttribute("id", "close-Button");
        let closeI = document.createElement("i");
        closeI.setAttribute("class", "fa-solid fa-xmark");
        closeButton.appendChild(closeI);
        closeButton.addEventListener("click", this.getEventFunctions("close"));
       

        let minButton = document.createElement("button");
        LayerButton1st.appendChild(minButton);
        minButton.setAttribute("id", "min-Button");
        minButton.addEventListener("click", this.getEventFunctions("min"));

        let minI = document.createElement("i");
        minI.setAttribute("class", "fa-solid fa-minus");
        minButton.appendChild(minI);
      
       

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
        replayButton.setAttribute("id", `replay-Button-${this.id}`);
        let replyI = document.createElement("i");
        replyI.setAttribute("class", "fa-solid fa-reply");
        replayButton.appendChild(replyI);
        replayButton.addEventListener("click", this.getEventFunctions("replay"));

        let playButton = document.createElement("button");
        LayerButton3rd.appendChild(playButton);
        playButton.setAttribute("id", `play-Button-${this.id}`);
        let playI = document.createElement("i");
        playI.setAttribute("class", "fa-solid fa-play");
        playButton.appendChild(playI);
        playButton.addEventListener("click", this.getEventFunctions("play"));

        let stopButton = document.createElement("button");
        LayerButton3rd.appendChild(stopButton);
        stopButton.setAttribute("id", `stop-Button-${this.id}`);
        let stopI = document.createElement("i");
        stopI.setAttribute("class", "fa-solid fa-stop");
        stopButton.appendChild(stopI);
        stopButton.addEventListener("click", this.getEventFunctions("stop"));


        //LayerButton3rd.appendChild(playButton, stopButton, replayButton);
        
        LayerButton3rd.classList.add("LayerButton-3rd")
     
        this.initFlag = true;
    }

    
    


    getEventFunctions(buttonName){
        
        switch (buttonName) {
            case "min":
                console.log("min");
                const minEvent = ()=>{
                    const videoContainer = document.getElementById(`videoContainer${this.id}`);

                    //if iframe was visible then make it display, none and change button to square
                    //temporaily remove iframe by accessing videoContainer + id > playerContainer to have display, none
                    if(videoContainer.children[1].children[0].style.display != "none"){
                      
                        videoContainer.children[0].children[1].children[0].setAttribute("class", "fa-regular fa-square");
                        videoContainer.children[1].children[0].style.display = "none";

                        //create text node and insert this video's title 
                        const textNode = document.createElement("text");
                        textNode.textContent = this.title;
                        //display title where iframe was at.
                        videoContainer.children[1].append(textNode);
                        //make videoContainer's height smaller
                        videoContainer.style.height = "120px";
                    }
                    //change button back to min 
                    //make iframe back to visible and make title to disappear
                    else{
                       
                        videoContainer.children[0].children[1].children[0].setAttribute("class", "fa-solid fa-minus");
                        videoContainer.children[1].children[0].style.display = "block";
                        videoContainer.children[1].removeChild(videoContainer.children[1].children[1]);
                        videoContainer.style.height = "480px";
                    }

                    
                }
                return minEvent;
        
            case "close":
                console.log("close");
                //remove all anchored events 
                //and remove all Dom elements then notify manager to delete current TestVideo

                const closeEvent = ()=>{
                    //get this Video's most outer tag; named videoContainer+this.id
                    //do reverse level traversal and delete all of the nodes 
                    const videoContainer = document.getElementById(`videoContainer${this.id}`);
            
                    //make stack and queue for traversal 
                    let stack = [];
                    let queue = [];

                    queue.push(videoContainer);
                    while(queue.length > 0){
                        const node = queue[0];
                        queue.splice(0,1);

                        //if node has children, enqueue them
                        if(node && node.children > 0){
                            Array.from(node).children.array.forEach(element => {
                                queue.push(element);
                            });
                        //if node does not have a children, delete that Dom Element
                        }else{

                            //if it's a button type, delete it's attached event;
                            if(node.nodeName == "BUTTON"){
                                //find button's event name by it's id; buttonName will be string 
                                const buttonName = node.getAttribute(id).slice('-')[0];
                                node.removeEventListener("click", getEventFunctions(buttonName));
                            }
                            //delete Dom element
                            node.remove();
                        }

                        stack.push(node);
                    }
                    //pop stack and delete those Dom Element; 
                    while(stack.length > 0){
                        const node = stack.pop();
                        //if it's a button type, delete it's attached event;
                        if(node.nodeName == "BUTTON"){
                            //find button's event name by it's id; buttonName will be string 
                            const buttonName = node.getAttribute(id).slice('-')[0];
                            node.removeEventListener("click", getEventFunctions(buttonName));
                        }
                        //delete Dom element
                        node.remove();
                    }

                    //let manager to delete this instance 
                    this.manager.deleteVideo(this.id);

                    }
                return closeEvent;

            case "play":
                
                const playEvent = ()=>{
                    const playButtonDomElement = document.getElementById(`play-Button-${this.id}`);

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

    setTitle(title){
       this.title = title;
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
        const playButtonDomElement = document.getElementById(`play-Button-${this.id}`);
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