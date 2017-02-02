var marginLeft = 20;
var marginTop = 20;
var radius = 2;
var increment = 4;
var resetHeight = -50;
var resetWidth = -50;
var fill = "#87CEFA";
var svgNS = "http://www.w3.org/2000/svg";
var fps = 40;

var mixer_rain = 0.7;
var mixer_shoe = 1.0;

var rain;

var height;
var width;

var sizeInc = 0.01;
var velocity_contribution = 0.2;

var getInitialVelocityY = function(ecks, why) {
    var posX = ecks - (width)/2;
    var posY = why - (height)/2;
    return Math.sin(Math.atan(posY/posX)) * (Math.sqrt(posX*posX+posY*posY) * 0.05);
}

var getInitialVelocityX = function(ecks, why) {
    var posX = ecks - (width)/2;
    var posY = why - (height)/2;
    return Math.cos(Math.atan(posY/posX)) * (Math.sqrt(posX*posX+posY*posY) * 0.05);
}

var loopRain = function() {
    var len = rain.children.length;
    for(var i = 0;i<len;++i) {
        var drop = rain.children[i];
        var cy = parseFloat(drop.getAttribute('cy'));
	var cx = parseFloat(drop.getAttribute('cx'));
        var rad = parseFloat(drop.getAttribute('r'));
        if(cy > height || cy < 0 || cx > width || cx < 0 || rad > 3.2) {
	    var x = Math.random() * width;
	    var y = Math.random() * height;
            drop.setAttribute("cy", y);
	    drop.setAttribute("cx", x);
            drop.setAttribute("data-vy", getInitialVelocityY(x, y));
	    drop.setAttribute("data-vx", getInitialVelocityX(x, y));
	    drop.setAttribute("r", radius);
        } else {
            //var vy = parseFloat(drop.getAttribute("data-vy"));
	    //var vx = parseFloat(drop.getAttribute("data-vx"));
	    var vy = getInitialVelocityY(cx, cy);
	    var vx = getInitialVelocityX(cx, cy);
	    if(cx < width/2) {
		drop.setAttribute("cy", cy-vy*(velocity_contribution + velocity_contribution * Math.abs(cy-height/2)/(height/2))-vx*(velocity_contribution + velocity_contribution * Math.abs(cx-width/2)/(width/2)));
	    	drop.setAttribute("cx", cx-vx*(velocity_contribution + velocity_contribution * Math.abs(cx-width/2)/(width/2))+vy*(velocity_contribution + velocity_contribution * Math.abs(cy-height/2)/(height/2)));
	    } else {
            	drop.setAttribute("cy", cy+vy*(velocity_contribution + velocity_contribution * Math.abs(cy-height/2)/(height/2))+vx*(velocity_contribution + velocity_contribution * Math.abs(cx-width/2)/(width/2)));
	    	drop.setAttribute("cx", cx+vx*(velocity_contribution + velocity_contribution * Math.abs(cx-width/2)/(width/2))-vy*(velocity_contribution + velocity_contribution * Math.abs(cy-height/2)/(height/2)));
	    }
	    drop.setAttribute("r",rad + sizeInc);
        }
    }
}

var rainInterval;

var startRain = function(svg) {
    rain = svg;
    width = window.innerWidth;
    height = window.innerHeight;
    for(var w = marginLeft; w<width; w+=increment) {
        var drop = document.createElementNS(svgNS, "circle");
	var x = Math.random() * width;
	var y = Math.random() * height;
       	drop.setAttribute('r',radius);
       	drop.setAttribute('cx',x);
       	drop.setAttribute('cy', y);
       	drop.setAttribute('fill', fill);
       	drop.setAttribute('data-vy', getInitialVelocityY(x, y));
	drop.setAttribute('data-vx', getInitialVelocityX(x, y));
        rain.appendChild(drop);
    }
    rainInterval = setInterval(loopRain, 1000/fps);
}

function resetRain() {
    if(rainInterval != undefined)
        clearInterval(rainInterval);
    if(rain != undefined)
        rain.innerHTML = "";
}

window.onload = function() {
    startRain(document.querySelector("#rain"));
    document.querySelector("#shoegaze").volume = mixer_shoe;
    document.querySelector("#rainsong").volume = mixer_rain;
}

window.onresize = function() {
    resetRain();
    startRain(document.querySelector("#rain"));
}