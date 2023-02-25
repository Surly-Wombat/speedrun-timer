const splitsContainer = document.getElementById("splits");
const splits = splitsContainer.children;
const runningSegment = document.getElementById("currentSegment");
const sobDisplay = document.getElementById("sobTotal");
const pbDisplay = document.getElementById("pbTotal");
const timeDisplay = document.getElementById("runningTime");
const splitButton = document.getElementById("split");
let bestTimes = new Array(splits.length).fill(4000); //temp, make -1
let pbTimes = new Array(splits.length).fill(-1);
/*for(let i = 0; i < pbTimes.length; i++) { //also temp, just remove for loop
    pbTimes[i] = 4000 * (i+1);
}*/

let currentTimes = [];
let currentSegment = 0;
let interval;
let startTime, elapsedTime = 0, segmentTime = 0, lastSegmentTime = 0;

if(typeof window.localStorage.bestTimes !== "undefined") {
    bestTimes = JSON.parse(localStorage.bestTimes);
}
if(typeof window.localStorage.pbTimes !== "undefined") {
    pbTimes = JSON.parse(localStorage.pbTimes);
}

setPB();
updateSOB();
updatePB();

function startTimer() {
    splitButton.innerHTML = "Click to <b>SPLIT</b>";
    splitButton.removeEventListener("click",startTimer);
    splitButton.addEventListener("click",splitTimer);
    
    for(let i = 0; i < splits.length; i++) {
        const compare = splits[i].querySelector(".splitDiff");
        compare.innerHTML = "";
        compare.classList.remove(...compare.classList);
        compare.classList.add("splitDiff");
    }
    
    setPB();
    updateSOB();
    scrollParentToChild(splitsContainer,splits[0]);
    startTime = Date.now();
    currentSegment = 0;
    changeCurrent(splits[currentSegment]);
    interval = window.setInterval(updateTimer,3);
    console.log(pbTimes);
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
    updateSOB();
    segmentTime = 0;
    currentSegment++;
    if(currentSegment >= splits.length) {
        stopTimer();
        return;
    }
    changeCurrent(splits[currentSegment]);
    scrollParentToChild(splitsContainer,splits[currentSegment]);
}

function stopTimer() {
    clearInterval(interval);
    if(elapsedTime < pbTimes[pbTimes.length-1] || pbTimes[0] == -1) {
        pbTimes = currentTimes.slice();
    }
    lastSegmentTime = 0;
    currentSegment = 0;
    startTime = 0;
    elapsedTime = 0;
    currentTimes = [];
    splitButton.innerHTML = "Click to <b>START</b>";
    splitButton.removeEventListener("click",splitTimer);
    splitButton.addEventListener("click",startTimer);
    updatePB();
}

function setPB() {
    for(let i = 0; i < splits.length; i++) {
        splits[i].querySelector(".splitTime").innerHTML = timeString(pbTimes[i]);
    }
}

function updateSOB() {
    let sob = 0;
    for(const num of bestTimes) {
        sob += num;
    }
    sobDisplay.innerHTML = timeString(sob);
}

function updatePB() {
    pbDisplay.innerHTML = timeString(pbTimes[pbTimes.length - 1]);
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
        currentSplit.querySelector(".splitDiff").classList.add("new-best");
    }
    else if(splitDiff > 0) {
        if(elapsedTime > pbTimes[currentSegment]) currentSplit.querySelector(".splitDiff").classList.add("slow-behind");
        else currentSplit.querySelector(".splitDiff").classList.add("slow-ahead");
    }
    else {
        if(elapsedTime > pbTimes[currentSegment]) currentSplit.querySelector(".splitDiff").classList.add("fast-behind");
        else currentSplit.querySelector(".splitDiff").classList.add("fast-ahead");
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

window.addEventListener("unload",function() {
    window.localStorage.bestTimes = JSON.stringify(bestTimes);
    window.localStorage.pbTimes = JSON.stringify(pbTimes);
});
