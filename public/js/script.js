/*
* All time variables stored in sec unless the name ends in UTC
*/

var vis = vis || {}; //single global object
var hardcoded = hardcoded || {}; //single object for hardcoded variables

/*
* SOME HARDCODED VARS
* These would ideally be drawn from the data set programatically,
* but we haven't got ime to generalise this at before the conference
*/

//time between first and last take off
hardcoded.delta = (1299300-518400)*1000; //in ms (~9 days)
// first departure time
hardcoded.minTime = (1379497800+518400)*1000; //in ms
/*
* VIS CONFIG VARS
*/

/*		vis.timeScale		time (s)		time (mins)
*********************************************
* 		0.004					*	 3123s		*  52 mins
* 		0.002					*	 1561s		*  26 mins
* 		0.001					*	 780s			*  13 mins
* 		0.0005				*	 390s		 	*  6.5 mins
* 		0.0001				*	 78s		 	*  1.3 mins
*/

vis.timeScale = 0.1; //all real world times are multiplied by this scaling variable - the bigger this number, the longer the vis duration
vis.duration = hardcoded.delta*vis.timeScale; //in ms - technically not duration of vis but the time it takes for all flights to start
vis.planeSpeedkmph = 805; //around 500mph - used if a proper flight duration cannot be found
vis.allowStart = true; //this is set to false on window resize
vis.reloadCued = false; //set to true when vis is about to reload
vis.outbound = false; //relative to south africa
vis.outboundTimeScale = 10;

/*		vis.outboundTimeScale		time (s)		time (mins)
*********************************************
* 		1												*	 6s
* 		10											*	 60s		*  1 mins
* 		100											*	 600s		*  10 mins
*/

vis.pathColor = "#33ffcc"; //electric blue
vis.pathColor = "#25A8DF"; //OYW blue

vis.margin = {
	top: 90,
	left: 0,
	bottom: 10,
	right: 0
};
vis.width = parseInt(d3.select('#map').style('width'), 10)- vis.margin.left - vis.margin.right;
vis.mapRatio = 0.5;
vis.height = (vis.width * vis.mapRatio) + vis.margin.top + vis.margin.bottom;
vis.flightDataSource = vis.outbound ? "data/outbound.json" : "data/inbound.json";

/*
* UGLY GLOBAL VARS
*/

var projection = d3.geo.mercator()
	.scale(vis.width/6)
    .translate([(vis.width / 2)+ vis.margin.left + vis.margin.right, (vis.height / 2)+ vis.margin.top + vis.margin.bottom ]);

var path = d3.geo.path()
	.projection(projection);

var svg = d3.select('#map').append('svg:svg')
	.attr('class', 'canvas')
    .style('height', vis.height + 'px')
    .style('width', vis.width + 'px');

var world = svg.append('svg:g')
	.attr('class', 'world');

var flights = svg.append('svg:g')
	.attr('class', 'flights');

/*
* FUNCTIONS
*/

var arcFluctuation = function() {
	//returns 0,10,20,30,40,50,60,70,80,90 randomly
	var randomOffset = (Math.random()*10).toFixed(0)*10;
	return randomOffset;
};

// Draw our arc shape based on start/end co-ordinates
var arcGenerator = function(d) {
	var dir = Math.random() > 0.5 ? 1 : 0; //this returns 1 or 0 randomly
	var rad = {
		"x" : (d.dr_px)+arcFluctuation(),
		"y" : (d.dr_px)+arcFluctuation()
	};
	var arc = 'M' + d.x1 + ',' + d.y1 + 'A' + rad.x + ',' + rad.y + ' 0 0, '+ dir +' ' + d.x2 + ',' + d.y2;
	return arc;
};

//three cheers for pythagoras's theorem!
var calculateLength = function(x1,x2,y1,y2) {
	return Math.pow( Math.pow((x1-x2),2) + Math.pow((y1-y2),2),0.5);
};

//weight the strokewidth by how long the flight is
//long flight -> fatter stroke
var strokewidthGenerator = function(d,i) {
	return 1.0;//d.dr_px*0.008;
};

//we have to work backwardss from arrival times
//as there aren't departure times for all
var calculateStartTime = function(props, duration) {
	var trueDepartureTime = props.arrivalTimestampUTC*1000 - duration;
	var departureTime = ( trueDepartureTime - hardcoded.minTime ) * vis.timeScale;
	return vis.outbound ? 0 : departureTime;
};

//flight duration calculated using plane speed and distance
var calculateDuration = function(props, distance) {
	var duration = ( distance / vis.planeSpeedkmph ) * 60 * 60 * 1000 * vis.timeScale;
	return duration;
};

var duration = function(d) {
	console.log("Duration: "+d.duration);
	return vis.outbound ? d.duration*vis.outboundTimeScale : d.duration;
	//return d.duration;
};

//cues the takeoff effect with setTimeout before returning
//startime to the delay() function that called it
var setTakeOffTime = function(d) {
	window.setTimeout(function(){
		takeOffEffect(d);
	}, d.startTime);
	return d.startTime;
};

//Adds bang class to the country that the flight takes off from
var takeOffEffect = function(d) {
	d3.select("path#"+countryCodes[d.departureCountry])
		.attr('class', d3.select("path#"+countryCodes[d.departureCountry]).attr('class')+' bang');
	//remove the class after 2s so it can have effect again later
	setTimeout(function(){
		d3.select("path#"+countryCodes[d.departureCountry])
		.attr('class', 'country');
	}, 2000);
};

//jammed up console - now commented out
var consoleLogger = function(c, i) {
	//console.log(c, i);
	return "flight" + i;
};

//this is where the magic happens
var beginVis = function() {

	// document.querySelector('audio').play();

	if(vis.outbound) {
		document.getElementById('timer').style.display = 'none';
	}

	console.log("Vis will take "+vis.duration*0.001+"s to complete");

	d3.json(vis.flightDataSource, function(collection) {

		vis.data = collection.features.map(function(d,i) {

			var props = d.properties;

			pos1 = projection( [d.geometry.coordinates[0][0][0], d.geometry.coordinates[0][0][1]] );
			pos2 = projection( [d.geometry.coordinates[0][1][0], d.geometry.coordinates[0][1][1]] );
			var distance = getDistanceFromLatLonInKm( d.geometry.coordinates[0][0][0],
																								d.geometry.coordinates[0][0][1],
																								d.geometry.coordinates[0][1][0],
																								d.geometry.coordinates[0][1][1]);
			var duration = calculateDuration(props, distance);
			var startTime = calculateStartTime(props, duration);
			return {
				'x1': pos1[0],
				'x2': pos2[0],
				'y1': pos1[1],
				'y2': pos2[1],
				//straight line distance in pixels
				'dr_px' : calculateLength(pos1[0],pos2[0],pos1[1],pos2[1]),
				//straight line distance in pixels
				'dr_km' : distance,
				//for intermediate calculations - shouldn't be needed in production
				'arrivalTimestampUTC' : props.arrivalTimestampUTC,
				//don't be fooled, this is still random
				'startTime' : startTime,
				//
				'duration' : duration,
				//departureCountry converted to uppercase hyphen separated string
				'departureCountry' : props.departureCountry.replace(/\s+/g, '-').toUpperCase()
			};
		});

		var feature = flights.selectAll("path")
			.data( vis.data )
				.enter().append("path")
			.attr("stroke-width", strokewidthGenerator)
				.style('fill', 'none')
				.attr('d', arcGenerator)
				.attr('data-id', consoleLogger);

		timerCountdown({
			startTime: hardcoded.minTime,
			endTime: hardcoded.minTime+hardcoded.delta,
			animationTime: hardcoded.delta*vis.timeScale*0.001,
			frameRate:5,
			target:'timer',
			completeMsg:'One Young World 2013'
		});


		// Animate each flight with a delay determined by their departure time
		for (var i = 0; i < feature[0].length; i++) {

			var thisFlight = d3.select('[data-id=flight' + i + ']');
			var nodeLength = thisFlight.node().getTotalLength();

			/*
				inspired by http://bl.ocks.org/duopixel/4063326
				HOW IT WORKS:
				1.	The line is styled as a dashed line with dash length & gap
						length both set to the length of the flight
				2.	The line is offset by the length of the flight so all
						that's visible is the gap (ie invisible)
				3.	Each flight is delayed by their departure time
				4.	Styles and duration of transition are set
				5.	Finally we declare what we want to transition to (a
						stroke-dashoffset of 0) which has the effect of moving gap
						out of view and bringing the dash (what we percieve as the
						flightpath) into view
			*/
			thisFlight
				.attr("stroke-dasharray", nodeLength + " " + nodeLength)
				.attr("stroke-dashoffset", nodeLength)
				.attr("stroke", vis.pathColor)
				.transition()
					.delay(setTakeOffTime)
						.attr("opacity",0.5)
						.duration(duration)
						.ease("linear")
						.attr("stroke-dashoffset", 0);
		}
	});
};

//draws the d3 map
var drawMap = function() {
	d3.json('data/world-countries.json', function(collection) {
	// create the map with svg and add it to the g element
	world.selectAll('.countries')
		.data( collection.features )
			.enter().append('svg:path')
			.attr('d', path)
			.attr('class', 'country')
			// Store the country name (we need this to animate countries on take-off)
			.attr('id', function(d,i) {
				return d.id;
			})
			.style('fill', 'rgb(12,16,22)');
	});
};

//called once visualisation has finished
var endVis = function() {
	console.log("%cFINISHED!", "background:black;color:white;font-size:200%");
};

/*
* EVENT LISTENERS
*/
d3.select(document).on("DOMContentLoaded", drawMap);
d3.select('#begin').on("click", function() {
	update();
	d3.select('.splash-panel').remove();
	if(vis.allowStart) beginVis();
});
d3.select('#update').on("click", update);
d3.select(window).on('resize', resize);
/*
* TIMEOUTS
*/
setTimeout(endVis, vis.duration+4000);

//
function update() {
	vis.duration = document.getElementById('duration').valueAsNumber*1000;
	vis.timeScale = vis.duration / hardcoded.delta;
}

//called on window resize
function resize() {
	if(!vis.reloadCued) {
		//cue reload
		vis.reloadCued = true;
		//stop the visualisation from being able to start
		vis.allowStart = false;
		//hide stuff
		d3.select('#timer').style('display', 'none');
		d3.select('.splash-panel').style('display', 'none');
		d3.select('#map').style('display', 'none');
		//tell the user what's going on
		d3.select('#resizeWarning').style('display', 'block');
		//keep track of coutndown
		var counter = 3;
		//begin countdown
		var interval = setInterval(function() {
			counter--;
			d3.select('#countdown').html(counter);
			if(!counter) {
				clearInterval(interval);
			}
		}, 1000);
		//reload page after 3 seconds
		setTimeout(function(){
			location.reload();
			return false;
		}, 3000);
	}
}
