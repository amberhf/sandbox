/* 
   This function displays an animated timer, taking six inputs:
      1. Start time (UTC)
      2. End time (UTC)
      3. Total time of animation (seconds)
      4. Frame rate (number of date/time values displayed per second)
      5. ID of element where the timer should appear (string)
      6. Text to display when finished (string)
*/

function timerCountdown(settings) {

  settings = (typeof settings !== "object") ? {} : settings;
  startTime = settings.startTime || 1371495791945; 
  endTime = settings.endTime || 1379495791945; 
  animationTime = settings.animationTime || 10; 
  frameRate = settings.frameRate || 20; 
  target = settings.target || 'timer';
  completeMsg = settings.completeMsg || 'Animation complete';

  // Calculate length of animation
  var animationDuration = 1000 / frameRate

  // Calculate length of the time series
  var length = endTime - startTime;

  // Number of dates to display (add one so start and end both displayed)
  var totalDatesToDisplay = animationTime * frameRate;
  var totalDatesToDisplay = totalDatesToDisplay + 1;

  // Calculate increment value
  var incrementTime = length / totalDatesToDisplay;
  var incrementTime = Math.round(incrementTime);

  // Create array of dates to display
  var dateArray = new Array();

  for (var i = 0; i < totalDatesToDisplay; i++){
    // Increment each time displayed, format, and store in array
    var displayTime = startTime + i*incrementTime;
    var displayTime = formatDateAndTime(displayTime);
    dateArray[i] = displayTime;
  }

  // Insert correct end date
  dateArray[totalDatesToDisplay] = formatDateAndTime(endTime);

  //console.log(dateArray);


   // Display each date with a time delay
   (function(){
      
      var iterator = 0;

      var looper = function(){

           document.getElementById(target).innerHTML = dateArray[iterator];

           if (iterator < totalDatesToDisplay) {
               iterator++;
           } else {
              if(completeMsg.length) {
                document.getElementById(target).innerHTML = completeMsg;
              }
              return;
           }
           
           setTimeout(looper, animationDuration);
       };
       
      looper();

   })();
}

// This function converts a UNIX timestamp to a nicely formatted date string
function formatDateAndTime(d) {

  // Convert Unix Timestamp to JavaScript date object
  var d = new Date(d);
  // 1. Date 

  // Month names
  var months = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

  // Construct pretty date
  var day = d.getDate();
  var month = d.getMonth();
  var year = d.getFullYear();


  day = makeTwoDigit(day);

  var date = '<span class="timer-day">' + day + '</span> <span class="timer-month">' + months[month] + '</span><span class="timer-year">&nbsp;' + year + '</span>';

  // 2. Time

  var hours = d.getHours();

  if (hours < 12) {
    amOrPm = "AM";
  } else {
    amOrPm = "PM";
  }

  if (hours == 0) {
    hours = 12;
  }

  hours = makeTwoDigit(hours);
/*

  var amOrPm = "";

  if (hours > 12) {
    hours = hours - 12;
  }

*/

  var minutes = d.getMinutes();

  minutes = makeTwoDigit(minutes);

  // Show AM/PM
  // var time = hours + ":" + minutes + " " + amOrPm;

  var time = '<span class="timer-hours">' + hours + ':</span><span class="timer-minutes">' + minutes + '</span>';

  return time + ' ' + date;

}

function makeTwoDigit(num){
  num = num + "";

  if (num.length == 1) {
    num = "0" + num;
  }

  return num;
}