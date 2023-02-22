const splitsContainer = document.getElementById("splits");
const splits = splitsContainer.children;
const runningSegment = document.getElementById("currentSegment");
const sobDisplay = document.getElementById("sobTotal");
const timeDisplay = document.getElementById("runningTime");
const splitButton = document.getElementById("split");
let bestTimes = new Array(splits.length).fill(-1);
let pbTimes = new Array(splits.length).fill(-1);
for(let i = 0; i < pbTimes.length; i++) {
    pbTimes[i] = 4000 * (i+1);
}

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
    currentTimes[currentSegment] = elapsedTime;
    lastSegmentTime += segmentTime;
    splitCompare();
    bestTimes[currentSegment] = Math.min(bestTimes[currentSegment],segmentTime);
    segmentTime = 0;
    currentSegment++;
    changeCurrent(splits[currentSegment]);
    scrollParentToChild(splits,splits[currentSegment]);
}

function changeCurrent(element) {
    runningSegment.querySelector(".splitIcon").innerHTML = element.querySelector(".splitIcon").innerHTML;
    runningSegment.querySelector(".splitName").innerHTML = element.querySelector(".splitName").innerHTML;
    runningSegment.querySelector(".splitTime").innerHTML = element.querySelector(".splitTime").innerHTML;
}

function splitCompare() {
    const currentSplit = splits[currentSegment];
    const splitDiffDisplay = currentSplit.querySelector(".splitDiff");
    if(pbTimes[currentSegment] == -1) return;
    let totalDiff = elapsedTime - pbTimes[currentSegment];
    let splitDiff;
    if(currentSegment == 0) {
        splitDiff = totalDiff;
        splitDiffDisplay.innerHTML = timeDiff(totalDiff);
    }
    else {
        let pbSplit = pbTimes[currentSegment] - pbTimes[currentSegment-1];
        splitDiff = segmentTime - pbSplit;
        splitDiffDisplay.innerHTML = timeDiff(totalDiff);
    }
    if(segmentTime < bestTimes[currentSegment]) {
        currentSplit.classList.add("new-best");
    }
    else if(splitDiff > 0) {
        if(elapsedTime > pbTimes[currentSegment]) currentSplit.classList.add("slow-behind");
        else currentSplit.classList.add("slow-ahead");
    }
    else {
        if(elapsedTime > pbTimes[currentSegment]) currentSplit.classList.add("fast-behind");
        else currentSplit.classList.add("fast-ahead");
    }
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

function timeDiff(time) {
    let absTime = Math.abs(time);
    if(time > 0) {
        return `+${timeString(absTime)}`;
    }
    else {
        return `-${timeString(absTime)}`;
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

window.onload = function() {
    if(typeof(localStorage.bestTimes) !== "undefined") {
        bestTimes = localStorage.bestTimes;
    }
    if(typeof(localStorage.pbTimes) !== "undefined") {
        pbTimes = localStorage.pbTimes;
    }
}

window.onbeforeunload = function() {
    localStorage.bestTimes = bestTimes;
    localStorage.pbTimes = pbTimes;
}
