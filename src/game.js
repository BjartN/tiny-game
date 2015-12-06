//statics
var keyOffset = {
  "37": [-1, 0], //left
  "38": [0, -1], //up
  "39": [1, 0], //right
  "40": [0, 1] //down
};
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvasSize = 500;
var worldSize = 50;
var pixelSize = canvasSize / worldSize;
var bg = 'cornflowerblue'
var animationId;
var iterationId =0;

//state
var lastKey = undefined;

//player position
var p = {
  x: 35,
  y: 20
};

//monsters
var monsters = [{
  x: 1,
  y: 1
},{
  x: 1,
  y: 10
},{
  x: 1,
  y: 20
},{
  x: 1,
  y: 30
}, {
  x: 40,
  y: 41
}, {
  x: 40,
  y: 1
}, {
  x: 40,
  y: 41
}, {
  x: 20,
  y: 20
},{
  x: 35,
  y: 35
}];

//run single frame of game
function game(w) {

  if(any(monsters, function(m){return p.x === m.x && p.y === m.y;})){
     kill();
  }

  var offsetX, offsetY;
  var offset = [-1, 0, 1]

  //reset colors
  px(p.x, p.y, bg);
  forEach(monsters, function (m) {
    px(m.x, m.y, bg)
  });

  if (keyOffset[lastKey]) {
    offsetX = keyOffset[lastKey][0];
    offsetY = keyOffset[lastKey][1];
    p = tryGetNewPosition(w, p, offsetX, offsetY);
  }


  for(var i=0; i<monsters.length; i++){
  	var m = monsters[i];
		var newOffset = (iterationId%10==0);
    
    offsetX =newOffset ? offset[getVal(3)] : m.offsetX;
  	offsetY =newOffset ? offset[getVal(3)] : m.offsetY;

    monsters[i] =tryGetNewPosition(w, m, offsetX, offsetY);
  }

  forEach(monsters, function (m) {
    px(m.x, m.y, 'white')
  })
  
  px(p.x, p.y, getRandomColor())

  iterationId++;
}

function kill() {
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, canvasSize, canvasSize);
  clearInterval(animationId)
}

function tryGetNewPosition(w, p, offsetX, offsetY) {
  var x, y;

  x = p.x + offsetX;
  y = p.y + offsetY;

  x = x % worldSize
  y = y % worldSize

  if (x < 0)
    x = worldSize - 1;
  if (y < 0)
    y = worldSize - 1;

  //can move?
  var wall = w[y] && w[y][x] === 1;

  if (wall)
    return {
      x: p.x,
      y: p.y,
      offsetX: p.offsetX,
      offsetY: p.offsetY
    };

  return {
    x: x,
    y: y,
    offsetX: offsetX,
    offsetY: offsetY
  };
}

function drawWorld(w) {
  for (var y = 0; y < w.length; y++) {
    var row = w[y];
    for (var x = 0; x < row.length; x++) {
      if (row[x] == 1) {
        px(x, y, 'black');
      }
    }
  }
}

function addWall(w, range) {
  var x = range[0][0];
  for (var y = range[0][1]; y < range[1][1]; y++) {
    w[y][x] = 1
  }
}

function addFloor(w, range) {
  var y = range[0][1];
  for (var x = range[0][0]; x < range[1][0]; x++) {
    w[y][x] = 1
  }
}


function px(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
}

function getVal(maxVal) {
  return Math.floor(Math.random() * maxVal)
}

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function grid(x, y) {
  var g = [];
  for (var i = 0; i < y; i++) {
    g[i] = new Array(x)
  }
  return g;
}

function forEach(a, f) {
  for (var i = 0; i < a.length; i++) {
    f(a[i]);
  }
}

function any(a, f) {
  for (var i = 0; i < a.length; i++) {
    if(f(a[i])===true){
    	return true;
    }
  }
  return false;
}

function log(s) {
  document.getElementById('log').innerHTML += s;
}

//capture keystrokes
(function () {
  document.onkeydown = stroke;

  function stroke(e) {
    e = e || window.event;
    lastKey = e.keyCode;
  };
})();

//start the game
(function () {
  var world = grid(worldSize, worldSize)

  /*addFloor(world, [
    [0, 0],
    [49, 0]
  ]);*/
  addFloor(world, [
    [10, 10],
    [40, 10]
  ]);
  addFloor(world, [
    [10, 40],
    [20, 40]
  ]);
  addFloor(world, [
    [30, 40],
    [41, 40]
  ]);

  addWall(world, [
    [0, 0],
    [0, 50]
  ]);
  addWall(world, [
    [49, 0],
    [49, 50]
  ]);
  addWall(world, [
    [10, 10],
    [10, 40]
  ]);
  addWall(world, [
    [40, 10],
    [40, 40]
  ]);
    addWall(world, [
    [25, 10],
    [25, 23]
  ]);
    addWall(world, [
    [25, 40],
    [25, 50]
  ]);

  drawWorld(world)
  animationId = setInterval(function () {
    game(world)
  }, 1000 / 30)
})();