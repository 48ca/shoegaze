var marginLeft = 5;
var radius = 2;
var increment = 2;
var resetHeight = -50;
var fill = "#87CEFA";
var svgNS = "http://www.w3.org/2000/svg";
var fps = 50;
var translationScale = 20;

var mixer_rain = 0.7;
var mixer_shoe = 1.0;

var rain;

var height;
var width;

var getInitialVelocity = function() {
    var velBase = Math.sqrt(window.innerWidth)/4.0;
    return 30*(velBase + Math.random() * velBase*2);
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
            drop.setAttribute("cy", cy+vy/fps);
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
        drop.setAttribute('cy', Math.floor(height * Math.random()));
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

var previousMouseEvent;
window.addEventListener('mousemove', function(event) {
    return;
    if(rain != undefined) {
        if(previousMouseEvent == undefined) {
            previousMouseEvent = event;
            return;
        }
        var len = rain.children.length;
        for(var i = 0;i<len;++i) {
            var drop = rain.children[i];
            var cx = parseFloat(drop.getAttribute('cx'));
            var cy = parseFloat(drop.getAttribute('cy'));
            var ncx;
            var dx = cx - event.clientX;
            var dy = cy - event.clientY;
            var dsq = dx * dx + dy * dy;
            if(dsq > 300000) continue;
            if(dsq < 5000) dsq = 5000;
            var prevEventDX = event.clientX - previousMouseEvent.clientX;
            ncx = cx + translationScale / dsq * prevEventDX;
            if(ncx > width) {
                drop.setAttribute("cx", ncx - width);
            } else {
                drop.setAttribute("cx", ncx);
            }
        }
    }
});
