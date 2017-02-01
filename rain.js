var marginLeft = 5;
var radius = 2;
var increment = 5;
var resetHeight = -50;
var fill = "#87CEFA";
var svgNS = "http://www.w3.org/2000/svg";
var fps = 40;

var mixer_rain = 0.7;
var mixer_shoe = 1.0;

var rain;

var height;
var width;

var getInitialVelocity = function() {
    return 10 + Math.random() * 5;
}

var loopRain = function() {
    var len = rain.children.length;
    for(var i = 0;i<len;++i) {
        var drop = rain.children[i];
        var cy = parseFloat(drop.getAttribute('cy'));
        if(cy > height) {
            drop.setAttribute("cy", resetHeight);
            drop.setAttribute("data-vy", getInitialVelocity());
        } else {
            var vy = parseFloat(drop.getAttribute("data-vy"));
            drop.setAttribute("cy", cy+vy*(.4 + .8 *cy/(height-resetHeight)));
        }
    }
}

var rainInterval;

var startRain = function(svg) {
    rain = svg;
    width = window.innerWidth;
    height = window.innerHeight;
    for(var i = marginLeft; i<width; i+=increment) {
        var drop = document.createElementNS(svgNS, "circle");
        drop.setAttribute('r',radius);
        drop.setAttribute('cx',i+radius);
        drop.setAttribute('cy', resetHeight);
        drop.setAttribute('fill', fill);
        drop.setAttribute('data-vy', getInitialVelocity());
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
