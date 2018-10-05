/**
NOTES:
Add avoids for all ghosts (possibly use closest ghost variable to store which
ghost is closest?)
Add way to target paths with dots Left
Add way to target fruit and super dots when safe to do so
+ Add way to target ghosts when blue
**/
function selectMove() {
    if (!PACMAN_DEAD && !GAMEOVER) { // make sure the game is running
      // update states
        var bubbleArray = createBubbleArray();
        var ghostArray = createGhostArray();
        populateSearchGraph(ghostArray, bubbleArray);
        var directions = [];
        for (var i = 1; i < 5; i++) {
            if (canMovePacman(i)) directions.push(i);
        }

        if (directions.length > 2 || !PACMAN_MOVING) {
          changeDirection();
        }

    }

    // copied from ghost.js and editted to apply to pacman
    function changeDirection() {
    	var direction = PACMAN_DIRECTION;
    	//var state = PACMAN_STATE; add back in when sure what it's for
    	var pacmanX = PACMAN_POSITION_X;
    	var pacmanY = PACMAN_POSITION_Y;

    	var axe = oneAxe();

    	tryDirection = getRightPacDirection(axe, GHOST_BLINKY_POSITION_X, GHOST_BLINKY_POSITION_X, PACMAN_POSITION_X, PACMAN_POSITION_Y);
      if (directions.indexOf(tryDirection) == -1) tryDirection = directions[Math.floor(Math.random() * directions.length)];
    		movePacman(tryDirection);
    }

    // copied from ghost.js and modified to apply to pacman
    function getRightPacDirection(axe, ghostX, ghostY, pacmanX, pacmanY) {
    	if (axe === 1) {
    		if (ghostX >= pacmanX) { // replaced greater than with less than to run
    		 return 3;
    		} else {
    			return 1;
    		}
    	} else {
    		if (ghostY >= pacmanY) { // again replace greater than with less than
    		 return 4;
    		} else {
    			return 2;
    		}
    	}
    }

    // function to create more easily accessed bubble info
    function CreateBubbleObj(bubbleString) {
      var splitBubbleString = bubbleString.split(";");
      var splitBubbleCoords = splitBubbleString[0].split(",");
      this.x = splitBubbleCoords[0];
      this.y = splitBubbleCoords[1];
      this.row = splitBubbleString[1];
      this.col = splitBubbleString[2];
      this.type = splitBubbleString[3];
      this.eaten = splitBubbleString[4];
    }

    // function to create bubble object Array
    function createBubbleArray() {
      var count = 0;
      var bubbleObjArray = [];
      for (bubble in BUBBLES_ARRAY) {
        tempBubble = new CreateBubbleObj(BUBBLES_ARRAY[bubble]);
        bubbleObjArray[count] = tempBubble;
        count++;
      }
      return bubbleObjArray;
    }

    // function to create ghost object
    function createGhostObj(ghostName) {
    this.x = eval("GHOST_" + ghostName + "_POSITION_X");
    this.y = eval("GHOST_" + ghostName + "_POSITION_Y");
    this.dir = eval("GHOST_" + ghostName + "_DIRECTION");
    this.movingTimer = eval("GHOST_" + ghostName + "_MOVING_TIMER");
    this.moving = eval("GHOST_" + ghostName + "_MOVING");
    this.bodyState = eval("GHOST_" + ghostName + "_BODY_STATE");
    this.state = eval("GHOST_" + ghostName + "_STATE");
    this.eatTimer = eval("GHOST_" + ghostName + "_EAT_TIMER");
    this.afraidTimer =  eval("GHOST_" + ghostName + "_AFFRAID_TIMER");
    this.afraidState =  eval("GHOST_" + ghostName + "_AFFRAID_STATE");
    this.tunnel =  eval("GHOST_" + ghostName + "_TUNNEL");
    }

    // function to create array of ghost info
    function createGhostArray() {
      var ghostInfoArray = [];
      ghostInfoArray[0] = new createGhostObj("PINKY");
      ghostInfoArray[1] = new createGhostObj("BLINKY");
      ghostInfoArray[2] = new createGhostObj("INKY");
      ghostInfoArray[3] = new createGhostObj("CLYDE");
      return ghostInfoArray;
    }

    // function to calculate h
    function h(ghostInfoArray, x, y) {
      var totalGhostPaths = 0; // will hold total cost of all ghosts to space
      for (var i = 0; i < 4; i++) {
        totalGhostPaths += Math.abs(ghostInfoArray[0].x - x);
        totalGhostPaths += Math.abs(ghostInfoArray[0].y - y);
      }
      return totalGhostPaths;
    }

    // function to create nD arrays. found on stackoverflow.com:
    // https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript/966938#966938
    function Create2DArray(rows) {
      var arr = [];

      for (var i=0;i<rows;i++) {
         arr[i] = [];
      }

      return arr;
      }

    // function to create evaluation graph
    function populateSearchGraph(ghostInfoArray, bubbleObjArray) {
      var numCol = BUBBLES_X_END - BUBBLES_X_START;
      var numRow = BUBBLES_Y_END - BUBBLES_Y_START;
      var bubbleGap = BUBBLES_GAP;
      var searchGraph = Create2DArray(1000);
      for (var i = 0; i < 550; i++) {
        for (var j = 0; j < 550; j++) {
        searchGraph[i][j] = 5000 - h(ghostInfoArray, i, j);
        }
        //console.log(bubbleObjArray[i].x);
      }

    }
};
