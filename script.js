const splitsContainer = document.getElementById("splits");
const splits = splitsContainer.children;
const sobDisplay = document.getElementById("sobTotal");
const timeDisplay = document.getElementById("runningTime");
let bestTimes = [];
let pbTimes = [];
for(let i = 0; i < splits.length; i++) {
    bestTimes[i] = -1;
    pbTimes[i] = -1;
}
let currentSegment = 0;

function timeString(ms) {
    if(ms < 0) {
        return "0.00";
    }
    
    let hours = Math.floor(ms / (60 * 60 * 1000));
    let minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    let seconds = Math.floor((ms % (60 * 1000)) / 10000);
    ms = ms % 1000;
    
    minutes = (minutes < 10 && hours > 0) ? "0" + minutes : minutes;
    seconds = (seconds < 10 && minutes > 0) ? "0" + seconds : seconds;
    ms = (ms < 10) ? "0" + ms : ms;
    
    if(hours > 0) {
        return `${hours}:${minutes}:${seconds}.${ms}`;
    }
    else if(minutes > 0) {
        return `${minutes}:${seconds}.${ms}`;
    }
    else if(seconds > 0) {
        return `${seconds}.${ms}`;
    }
    else {
        return `0.${ms}`;
    }
}


function scrollParentToChild(parent, child) {
    var parentRect = parent.getBoundingClientRect();
    var parentViewableArea = {
      height: parent.clientHeight,
      width: parent.clientWidth
    };
  
    var childRect = child.getBoundingClientRect();
    var isViewable = (childRect.top >= parentRect.top) && (childRect.bottom <= parentRect.top + parentViewableArea.height);
  
    if (!isViewable) {
          const scrollTop = childRect.top - parentRect.top;
          const scrollBot = childRect.bottom - parentRect.bottom;
          if (Math.abs(scrollTop) < Math.abs(scrollBot)) {
              parent.scrollTop += scrollTop;
          } 
          else {
              parent.scrollTop += scrollBot;
          }
    }
}
