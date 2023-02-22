const splitsContainer = document.getElementById("splits");
const splits = splitsContainer.children;
const runningSegment = document.getElementById("currentSegment");
const sobDisplay = document.getElementById("sobTotal");
const timeDisplay = document.getElementById("runningTime");
const splitButton = document.getElementById("split");
let bestTimes = new Array(splits.length).fill(-1);
let pbTimes = new Array(splits.length).fill(-1);

let currentTimes = [];
let currentSegment = 0;
let interval;
let startTime, elapsedTime = 0, segmentTime = 0, lastSegmentTime = 0;

function startTimer() {
    splitButton.innerHTML = "Click to <b>SPLIT</b>";
    splitButton.removeEventListener("click",startTimer);
    splitButton.addEventListener("click",splitTimer);
    
    startTime = Date.now();
    currentSegment = 0;
    changeCurrent(splits[currentSegment]);
    interval = window.setInterval(updateTimer,3);
}

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    segmentTime = elapsedTime - lastSegmentTime;
    let time = timeString(elapsedTime);
    splits[currentSegment].querySelector(".splitTime").innerHTML = time;
    runningSegment.querySelector(".splitTime").innerHTML = time;
    timeDisplay.innerHTML = time;
}

function splitTimer() {
    bestTimes[currentSegment] = Math.max(bestTimes[currentSegment],segmentTime);
    lastSegmentTime += segmentTime;
    segmentTime = 0;
    currentSegment++;
    changeCurrent(splits[currentSegment]);
}

function changeCurrent(element) {
    runningSegment.querySelector(".splitIcon").innerHTML = element.querySelector(".splitIcon").innerHTML;
    runningSegment.querySelector(".splitName").innerHTML = element.querySelector(".splitName").innerHTML;
    runningSegment.querySelector(".splitTime").innerHTML = element.querySelector(".splitTime").innerHTML;
}

function timeString(ms) {
    if(ms < 0) {
        return "0.00";
    }
    
    let hours = Math.floor(ms / (60 * 60 * 1000));
    let minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    let seconds = Math.floor((ms % (60 * 1000)) / 1000);
    ms = Math.floor((ms % 1000) / 10);
    
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

splitButton.addEventListener("click", startTimer);