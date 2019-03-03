import clock from "clock";
import document from "document";
import * as Utils from '../common/utils';
import * as ConfigFile from '../common/configFile';
import * as messaging from "messaging";
import exercise from "exercise";
import { BatteryIndicator } from "./battery-indicator";

const NUM_OF_DEGREES = 360;
const NUM_OF_HOURS = 12;
const NUM_OF_MINUTES = 60;
const NUM_OF_SECONDS = 60;

const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

const DEFAULT_COLOR = '#FFFFFF';
const CLOCK_COLOR_KEY = 'clockColor';

// Fetch handles to UI elements
const arcSeconds = document.getElementById("arcSeconds");
const arcMinutes = document.getElementById("arcMinutes");
const arcHours = document.getElementById("arcHours");
const dayNumber = document.getElementById("dayNumber");
const dayName = document.getElementById("dayName");

arcHours.style.opacity = 0.8;
arcMinutes.style.opacity = 0.6;
arcSeconds.style.opacity = 0.4;

// clock colors
let root = document.getElementById('root');
let clockColor, clockTime;
let batteryIndicator = new BatteryIndicator(document);
let isClicked = false;

// Initialize
clockTime = null;
clockColor = DEFAULT_COLOR;

// Update the clock every second
clock.granularity = "seconds";

// Update current time every second
clock.ontick = (evt) => {
  clockTime = evt.date;
  render(clockTime, clockColor);
}

// Update color when a settings message is received
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data.key == CLOCK_COLOR_KEY) {
    clockColor = evt.data.value;
    render(clockTime, clockColor);
    ConfigFile.setItem(CLOCK_COLOR_KEY, clockColor)
    ConfigFile.save();
  }
}

root.onclick = function () {
  isClicked = !isClicked;
  const currentState = isClicked ? "disable" : "enable";
  arcHours.animate(currentState);
  arcMinutes.animate(currentState);
  arcSeconds.animate(currentState);
  // if (isClicked) {
  //   exercise.start("Ice Skating", { gps: false });
  // } else {
  //   console.log(exercise.stats.calories || 0);
  //   exercise.stop();
  // }
};


// Render clock face according to color and time
function render(time, color) {
  let hours = time.getHours() % 12;
  let minutes = time.getMinutes();
  let seconds = time.getSeconds();
  
  arcHours.sweepAngle = NUM_OF_DEGREES / NUM_OF_HOURS * (hours + minutes/NUM_OF_MINUTES);
  arcMinutes.sweepAngle = NUM_OF_DEGREES / NUM_OF_MINUTES * (minutes + seconds/NUM_OF_SECONDS);
  arcSeconds.sweepAngle = NUM_OF_DEGREES / NUM_OF_SECONDS * seconds;
  
  arcHours.style.fill = color;
  arcMinutes.style.fill = color;
  arcSeconds.style.fill = color;
  
  dayNumber.text = Utils.zeroPad(time.getDate());
  dayName.text = days[time.getDay()];
  
  batteryIndicator.draw(color);
}

if(ConfigFile.load()) {
  let color = ConfigFile.getItem(CLOCK_COLOR_KEY)
  clockColor  = color ? color : clockColor
}