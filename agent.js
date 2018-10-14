var GAMEBOARD = [];

var getXY = function(x, y) {
    var i = Math.floor((x - BUBBLES_X_START + BUBBLES_GAP/2)/BUBBLES_GAP);
    var j = Math.floor((y - BUBBLES_Y_START + 9)/17.75);

    return {x: i, y: j}
}

var buildGameboard = function () {
    GAMEBOARD = [];
    for(var i = 0; i < 26; i++) {
        GAMEBOARD.push([]);
        for(var j = 0; j < 29; j++) {
            GAMEBOARD[i].push({
                bubble: false,
                superBubble: false,
                inky: false,
                pinky: false,
                blinky: false,
                clyde: false,
                pacman: false,
                eaten: false,
                row: j,
                col: i,
                nodeWeight: Infinity,
                edges: new Map(),
                previousNode: 0,
                visited: false
            });
        }
    }

    for(var i = 0; i < BUBBLES_ARRAY.length; i++) {
        var bubbleParams = BUBBLES_ARRAY[i].split( ";" );
        var y = parseInt(bubbleParams[1]) - 1;
        var x = parseInt(bubbleParams[2]) - 1;
        var type = bubbleParams[3];
        var eaten = parseInt(bubbleParams[4]);
        if (type === "b") {
            GAMEBOARD[x][y].bubble = true;
        } else {
            GAMEBOARD[x][y].superBubble = true;
        }
        if(eaten === 0) {
            GAMEBOARD[x][y].eaten = false;
        } else {
            GAMEBOARD[x][y].eaten = true;
        }
    }

    for(var i = 0; i < 26; i++) {
        for(var j = 0; j < 29; j++) {
            if(!GAMEBOARD[i][j].bubble && !GAMEBOARD[i][j].superBubble){
                GAMEBOARD[i][j] = null;
            }
        }
    }

    for(var i = 0; i < 26; i++) {
        for(var j = 0; j < 29; j++) {
            if((i === 0 && (j === 13)) ||
                (i === 1 && (j === 13)) ||
                (i === 2 && (j === 13)) ||
                (i === 3 && (j === 13)) ||
                (i === 4 && (j === 13)) ||
                (i === 6 && (j === 13)) ||
                (i === 7 && (j === 13)) ||
                (i === 8 && (j >= 10 && j <= 18)) ||
                (i === 9 && (j === 10 || j === 16)) ||
                (i === 10 && (j === 10 || j === 16)) ||
                (i === 11 && (((j >= 8) && (j <= 10)) || j === 16)) ||
                (i === 12 && (j === 10 || j === 16)) ||
                (i === 13 && (j === 10 || j === 16)) ||
                (i === 14 && (((j >= 8) && (j <= 10)) || j === 16)) ||
                (i === 15 && (j === 10 || j === 16)) ||
                (i === 16 && (j === 10 || j === 16)) ||
                (i === 17 && (j >= 10 && j <= 18)) ||
                (i === 18 && (j === 13)) ||
                (i === 19 && (j === 13)) ||
                (i === 21 && (j === 13)) ||
                (i === 22 && (j === 13)) ||
                (i === 23 && (j === 13)) ||
                (i === 24 && (j === 13)) ||
                (i === 25 && (j === 13)))  {
                GAMEBOARD[i][j] = {
                    bubble: false,
                    superBubble: false,
                    inky: false,
                    pinky: false,
                    blinky: false,
                    clyde: false,
                    pacman: false,
                    eaten: false,
                    row: j,
                    col: i,
                    nodeWeight: Infinity,
                    edges: new Map(),
                    previousNode: 0,
                    visited: false
                };
            }
        }
    }

    // set ghost positions on gameboard
    var ip = getXY(GHOST_INKY_POSITION_X,GHOST_INKY_POSITION_Y);
    if(GAMEBOARD[ip.x][ip.y] && ip.x >= 0 && ip.x < 26) GAMEBOARD[ip.x][ip.y].inky = true;
    var pp = getXY(GHOST_PINKY_POSITION_X,GHOST_PINKY_POSITION_Y);
    if(GAMEBOARD[pp.x][pp.y] && pp.x >= 0 && pp.x < 26) GAMEBOARD[pp.x][pp.y].pinky = true;
    var bp = getXY(GHOST_BLINKY_POSITION_X,GHOST_BLINKY_POSITION_Y);
    if(GAMEBOARD[bp.x][bp.y] && bp.x >= 0 && bp.x < 26) GAMEBOARD[bp.x][bp.y].blinky = true;
    var cp = getXY(GHOST_CLYDE_POSITION_X,GHOST_CLYDE_POSITION_Y);
    if(GAMEBOARD[cp.x][cp.y] && cp.x >= 0 && cp.x < 26) GAMEBOARD[cp.x][cp.y].clyde = true;

    // set pacman's position on gameboard
    var pacp = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
    if(GAMEBOARD[pacp.x][pacp.y] && pacp.x >= 0 && pacp.x < 26) {
        GAMEBOARD[pacp.x][pacp.y].pacman = true;
        // set initial path cost to 0
        GAMEBOARD[pacp.x][pacp.y].pathCost = 0;
        GAMEBOARD[pacp.x][pacp.y].nodeWeight = 0;
        GAMEBOARD[pacp.x][pacp.y].previousNode = 0;
    }

    // create edges arrays for each traversable space, then calculate weight
    var inkyDanger;
    var pinkyDanger;
    var blinkyDanger;
    var clydeDanger;
    var totalDanger;
    for (var i = 0; i < 26; i++) {
        for (var j = 0; j < 29; j++) {
            if (GAMEBOARD[i][j] != null) {
                sourceNode = GAMEBOARD[i][j];
                if (j != 28) {
                    if (GAMEBOARD[i][j + 1]) {
                        // calculate weight of space
                        inkyDanger = 220 - Math.abs(ip.x - j+1 + ip.y - i);
                        pinkyDanger = 220 - Math.abs(pp.x - j+1 + pp.y - i);
                        blinkyDanger = 220 - Math.abs(bp.x - j+1 + bp.y - i);
                        clydeDanger = 220 - Math.abs(cp.x - j+1 + cp.y - i);
                        totalDanger = inkyDanger + pinkyDanger + blinkyDanger + clydeDanger;
                        sourceNode.edges.set(GAMEBOARD[i][j + 1], totalDanger);
                    }
                }
                if (j != 0) {
                    if (GAMEBOARD[i][j - 1] != null) {
                        // calculate weight of space
                        inkyDanger = 220 - Math.abs(ip.x - j-1 + ip.y - i);
                        pinkyDanger = 220 - Math.abs(pp.x - j-1 + pp.y - i);
                        blinkyDanger = 220 - Math.abs(bp.x - j-1 + bp.y - i);
                        clydeDanger = 220 - Math.abs(cp.x - j-1 + cp.y - i);
                        totalDanger = inkyDanger + pinkyDanger + blinkyDanger + clydeDanger;
                        sourceNode.edges.set(GAMEBOARD[i][j - 1], totalDanger);
                    }
                }
                if (i != 25) {
                    if (GAMEBOARD[i + 1][j]) {
                        // calculate weight of space
                        inkyDanger = 220 - Math.abs(ip.x - j + ip.y - i+1);
                        pinkyDanger = 220 - Math.abs(pp.x - j + pp.y - i+1);
                        blinkyDanger = 220 - Math.abs(bp.x - j + bp.y - i+1);
                        clydeDanger = 220 - Math.abs(cp.x - j + cp.y - i+1);
                        totalDanger = inkyDanger + pinkyDanger + blinkyDanger + clydeDanger;
                        sourceNode.edges.set(GAMEBOARD[i + 1][j], totalDanger);
                    }
                }
                if (i != 0) {
                    if (GAMEBOARD[i - 1][j] != null) {
                        // calculate weight of space
                        inkyDanger = 220 - Math.abs(ip.x - j + ip.y - i-1);
                        pinkyDanger = 220 - Math.abs(pp.x - j + pp.y - i-1);
                        blinkyDanger = 220 - Math.abs(bp.x - j + bp.y - i-1);
                        clydeDanger = 220 - Math.abs(cp.x - j + cp.y - i-1);
                        totalDanger = inkyDanger + pinkyDanger + blinkyDanger + clydeDanger;
                        sourceNode.edges.set(GAMEBOARD[i - 1][j], totalDanger);
                    }
                }
            }
        }
    }

};

function drawRect(i,j) {
    var ctx = PACMAN_CANVAS_CONTEXT;
    var ygap = 17.75;
    var x = BUBBLES_X_START + i*BUBBLES_GAP - BUBBLES_GAP/2;
    var y = BUBBLES_Y_START + j*ygap- 9;
    var w = BUBBLES_GAP;
    var h = ygap;

    if(GAMEBOARD[i][j]){
        ctx.strokeStyle = "green";
        ctx.rect(x,y,w,h);
        ctx.stroke();
    }
}

function drawDebug() {
    for(var i = 0; i < 26; i++) {
        for(var j = 0; j < 29; j++) {
            drawRect(i,j);
        }
    }
}

// resort the array
function sortArray(array) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        while (count <= i) {
            if (array[i] != null && array[count] != null && array[i].nodeWeight >= array[count].nodeWeight) {
                var tempNode = array[i];
                array.splice(i, 1);
                array.splice(count, 0, tempNode);
            }
            count++;
        }
        count = 0;
    }
    return array;
}

function diskstras() {
    var unvisitedSpaces = [];
    var visitedSpaces = [];
    var index = 0;
    for (var i = 0; i < 26; i++) {
        for (var j = 0; j < 29; j++) {
            if (GAMEBOARD[i][j] != null) {
                unvisitedSpaces[index] = GAMEBOARD[i][j];
                index++;
            }
        }
    }
    unvisitedSpaces = sortArray(unvisitedSpaces);
    var currentNode = unvisitedSpaces.pop();
    // reset index back to 0!
    index = 0;
    while (unvisitedSpaces.length > 0) {
        var edgeMap = currentNode.edges;
        var keyIterator = edgeMap.keys();
        for (i = 0; i < edgeMap.size; i++) {
            var boardSpace = keyIterator.next().value;
            if (!boardSpace.pacman && !boardSpace.visited) {
                boardSpace.nodeWeight = edgeMap.get(boardSpace) + currentNode.nodeWeight;
                boardSpace.previousNode = currentNode;
            }
        }
        visitedSpaces[index] = currentNode;
        currentNode.visited = true;
        sortArray(unvisitedSpaces);
        currentNode = unvisitedSpaces.pop();
        index++;
    }
    return visitedSpaces;
}

// find path from dijkstra
function findSafestPath(spacesArray) {
    var firstNode = spacesArray[0];
    var nextNode = firstNode.previousNode;
    var thePath = [];
    thePath.push(firstNode);
    thePath.push(nextNode);
    while (nextNode.previousNode !== 0) {
        nextNode = nextNode.previousNode;
        thePath.push(nextNode);
    }
    thePath = thePath.reverse();
    return thePath;
}

// pick direction from path
function pickDirection(safestNextSpace) {
    var pacPos = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
    console.log("pacmans: " + pacPos.x + ", " + pacPos.y);
    console.log("safespace: " + safestNextSpace.col + ", " + safestNextSpace.row);
    var returnDir = -1;
    if (pacPos.x === safestNextSpace.col - 1) returnDir = 3;
    if (pacPos.x === safestNextSpace.col + 1) returnDir = 1;
    if (pacPos.y === safestNextSpace.row - 1) returnDir = 4;
    if (pacPos.y === safestNextSpace.row + 1) returnDir = 2;
    console.log("direction chosen: " + returnDir);
    return returnDir;
}

function selectMove() {

    buildGameboard();

    if (!PACMAN_DEAD && !GAMEOVER) { // make sure the game is running
        var spacesCost = diskstras();
        spacesCost = sortArray(spacesCost);
        safestPath = findSafestPath(spacesCost);
        //console.log("length: " + safestPath.length);
        var newDir = pickDirection(safestPath[1]);
        var directions = [];
    }
};

//setInterval(drawDebug, 1000/3);
