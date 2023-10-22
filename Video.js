class Video{

    state;

    elpasedTime;

    startTime;

    endTime;

    count;

    player;

    playerDom;

    nameTag;

    // gets shortened url 
    //   <videoContainer>
    //      <playerContainer>
    //          <playerDom>
    //      <LayerButton3rd>
    //
    //
    //
    //      <LayerButton4th>
    //
    constructor(url, nameTag){
    //constructor(url){
       
        this.nameTag = nameTag;
        const onlyForNameDiv = document.createElement("div");
        onlyForNameDiv.setAttribute("id", "onlyForNameDiv");

        const tempHolder = document.getElementById("tempHolder");
        tempHolder.append(onlyForNameDiv);

        const onPlayerReady = function(event) {
            event.target.playVideo();
        }

        this.player = new YT.Player("onlyForNameDiv", {
        height: '300',
        width: '440',
        videoId: url,
        events: {
            'onReady': onPlayerReady,
        }
        });
        this.playerDom = document.getElementById( "onlyForNameDiv");
        tempHolder.append(iframe);
        
    }

    getPlayerTitle(){
        this.player.playVideo();
        return this.playerDom.getAttribute("title");
    }

}


export default Video;