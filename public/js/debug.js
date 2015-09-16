/*
* DEBUG FUNCTIONS & VARS
*/

var debug = debug || {}; //single object for debug variables

debug.startTimes = [];

//returns array of numbers pulled from an object array
debug.spewAll = function(objArr, key) {
	var arr = [];
	for (var i = objArr.length - 1; i >= 0; i--) {
		arr.push(objArr[i][key]);
	}
	return arr;
};

//returns max value of an array
debug.max = function( array ){
    return Math.max.apply( Math, array );
};

//returns min value of an array
debug.min = function( array ){
    return Math.min.apply( Math, array );
};