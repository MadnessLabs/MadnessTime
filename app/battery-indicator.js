import { battery } from "power";

export let BatteryIndicator = function(document) {  
  let self = this;
  
  let batContainerEl = document.getElementById("bat");
  let batEl = document.getElementById("bat-count");
  let batFillEl = document.getElementById("bat-fill");
  let batShellEl = document.getElementById("bat-shell");
  let batBody = document.getElementById("bat-body");
  let batFillWidth = batBody.width - 4;
  
  self.draw = function(color) {
    let level = battery.chargeLevel;
    batEl.text = Math.floor(level) + '%';
    batFillEl.width = batFillWidth - Math.floor((100 - level) / 100 * batFillWidth);
    batFillEl.style.fill = color;
  }
  
  self.setColor = function(color) {
    batFillEl.style.fill = color;
  }
    
}