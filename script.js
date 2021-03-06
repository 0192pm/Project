// Global Constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

// Global Variables
//random pattern
var pattern = Array.from(Array(8)).map(x=>Math.floor(1 + Math.random() * 6));
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var guessCounter = 0;
var volume = 0.6;
var mistakeCounter = 0;
var round = 0;
var lives = 3;
var clueHoldTime = 1000; //how long to hold each clue's light/sound


function scoreboard(){
  
}

function startGame(){
  // initialize game variables
  progress = 0;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame(){
  // initialize game variables
  gamePlaying = false;
  
  //swap Stop and Start buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}


function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += cluePauseTime;
    delay += clueHoldTime;
    clueHoldTime = clueHoldTime - 20;
  }
}

function guess(btn){
  console.log("user guessed: " + btn);
  
  if(!gamePlaying){
    return;
  }
  
  if(pattern[guessCounter] == btn){
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        winGame();
      }else{
        progress++;
        playClueSequence();
      }
    }else{
      guessCounter++;
    }
  }else{
    if (pattern[guessCounter] != btn){
      if(mistakeCounter < 2){
        alert("You can only make 3 mistakes. You have made " + (mistakeCounter + 1) + " mistake(s) so far.");
        mistakeCounter++;
        playClueSequence();
      }else{
        loseGame();
      }
    }
  }
}    

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
  window.location.reload();
}

function winGame(){
  const music = new Audio('https://cdn.glitch.global/90f3f33d-7522-4631-9d54-ee67ba9b1c03/Applause Sound Effect.mp3?v=1647655964400');
  music.play();
  stopGame();
  alert("Game Over. You won!");
  alert("Reload page to play again.")
}
// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 239,
  6: 500
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)
