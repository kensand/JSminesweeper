/*
 File: /~ksanders/experiments/javascript/minesweeper/minesweeper.js
 Kenneth Sanders, UMass Lowell Computer Science, kenneth_sanders@student.uml.ed\
u
 Copyright (c) 2016 by Kenneth Sanders. All rights reserved.
 May be freely copied or excerpted for educational purposes with credit to the \
author.
*/


var board = null;
var selected = null;
var clicked = null;
var width = 20;
var height = 20;
var mines = 25;
var started = "false";
var uncovered = 0;

//Setup the game itself.
function game(){

    //set gamestate	
    if(started == "false"){
	started = "true";
    }
    else if(started == "true"){
	return;
    }
    else if(started == "over"){
	//if it's over delete the old board
	uncovered = 0;
	var myNode = document.getElementById("container");
	while (myNode.firstChild) {
	    myNode.removeChild(myNode.firstChild);
	}
	started = "true";
    }

    //get game attributes
    width = document.getElementById("width").value;
    height = document.getElementById("height").value;
    mines = document.getElementById("mines").value;
    
    //make lists for square states (will hold array of arrays representing each square)
    clicked = new Array(0);
    board = new Array(0);

    //create div elements for squares and fill state arrays
    for(var i = 0; i < height; i++){
	var row = new Array(0);
	var rowelem = document.createElement("div");
	var clickedrow = new Array(0);
	rowelem.className = "row";
	for(var j = 0; j < width; j++){
	    var elem = document.createElement("div");
	    elem.className = "square";
	    //set square onclick and onrightclicks
	    elem.onclick = processClick;
	    elem.oncontextmenu=rightClick;
	    
	    //sets square ids to their locations, so that we can find where each square is when it's clicked.
	    elem.setAttribute("id", i.toString() + "," + j.toString());
	    rowelem.appendChild(elem);
	    clickedrow.push("not_clicked");
	    row.push("empty");
	}
	clicked.push(clickedrow);
	board.push(row);
	document.getElementById("container").appendChild(rowelem);

    }
    //setup sizing of container to fit squares
    var container = document.getElementById("container");
    container.style.minWidth = 24 * width + "px";
    container.style.minHeight = 24 * height + "px";
    container.style.maxWidth = 24 * width + "px";
    container.style.maxHeight = 24 * height + "px";
    container.style.width = 24 * width + "px";
    container.style.height = 24 * height + "px";

    //generate random mine locations	
    for(var i = 0; i < mines; i++){
	var randx = Math.floor(Math.random() * width);
	var randy = Math.floor(Math.random() * height);
	if(board[randy][randx] == "empty"){
	    board[randy][randx] = "mine";
	}
	else{
	    i--;
	}
    }
}

//The onrightclick function - cycles between flag, question mark, and nothing.
function rightClick(){
    if(started == "over"){
	console.log("rightclick returning because started == over");
	return false;
    }
    console.log("got right click");
    if(board == null){
        console.log("returning from right click");
	return;
    }
    var str = this.id;
    var comma = str.search(",");
    var r = str.slice(0, comma);
    var c = str.slice(comma + 1, str.length);
    r = parseInt(r);
    c = parseInt(c);
    console.log("id = " + str + ", r = " + r + ", c = " + c);
    if(clicked[r][c] == "not_clicked"){
	clicked[r][c] = "marked";
	img = document.createElement("img");
	img.setAttribute("src", "flag.png");
	this.appendChild(img);
    }
    else if(clicked[r][c] == "marked"){
	while(this.hasChildNodes()){
	    this.removeChild(this.firstChild);
	}
	this.innerHTML = "<p>?</p>";
	clicked[r][c] = "unknown";
    }
    else if(clicked[r][c] == "unknown"){
	this.innerHTML = "";
	clicked[r][c] = "not_clicked";
    }
    return false;
}

//function that processes a left click on a square.
function processClick(){
    if(started == "over"){
        return;
    }
    
    console.log("got click: " + this.id + ", started = " + started);
    if(board == null){
	return;
    }
    var str = this.id;
    var comma = str.search(",");
    var r = str.slice(0, comma);
    var c = str.slice(comma + 1, str.length);
    r = parseInt(r);
    c = parseInt(c);
    console.log("r = " + r + ", c = " + c);

    if(clicked[r][c] == "clicked"){
	console.log("got here");
	

	if(r - 1 >= 0 && clicked[r-1][c] == "not_clicked"){
	    var count = getCount(r-1,c);
	    if(board[r-1][c] == "mine"){
                gameLost();
		clicked[r-1][c] = "clicked";
            }
	    else if(count != 0){
		clicked[r-1][c] = "clicked";
		document.getElementById((r-1).toString() + "," + c.toString()).innerHTML = "<p>" + count.toString() + "</p>";
		document.getElementById((r-1).toString() + "," + c.toString()).style.backgroundColor = "white";
	    }
	    else{
		document.getElementById((r-1).toString() + "," + c.toString()).style.backgroundColor = "green";
		recurseClear(r-1,c)
	    }
	}
	
	if(r - 1 >= 0 && c - 1 >= 0 && clicked[r-1][c-1] == "not_clicked"){
            var count = getCount(r - 1,c-1);
	    if(board[r-1][c-1] == "mine"){
                gameLost();
		clicked[r-1][c-1] = "clicked";

	    }
	    else if(count != 0){
		clicked[r-1][c-1] = "clicked";
                document.getElementById((r-1).toString() + "," + (c-1).toString()).innerHTML = "<p>" + count.toString() + "</p>";
		document.getElementById((r-1).toString() + "," + (c-1).toString()).style.backgroundColor = "white";
            }
            else{
                document.getElementById((r-1).toString() + "," + (c-1).toString()).style.backgroundColor = "green";
		recurseClear(r-1, c-1);
	    }
        }
	
	if(c - 1 >= 0 && clicked[r][c-1] == "not_clicked"){
            
            var count = getCount(r,c-1);
	    if(board[r][c-1] == "mine"){
                gameLost();
		clicked[r][c-1] = "clicked";

            }
	    else if(count != 0){
                document.getElementById(r.toString() + "," + (c-1).toString()).innerHTML = "<p>" + count.toString() + "</p>";
		document.getElementById(r.toString() + "," + (c-1).toString()).style.backgroundColor = "white";
		clicked[r][c-1] = "clicked";

	    }
            else{
                document.getElementById(r.toString() + "," + (c-1).toString()).style.backgroundColor = "green";
		recurseClear(r,c-1);
	    }
        }

	if(r + 1 < height && c-1 >= 0 && clicked[r+1][c-1] == "not_clicked"){
            var count = getCount(r+1,c-1);
	    if(board[r+1][c-1] == "mine"){
                gameLost();
		clicked[r+1][c-1] = "clicked";

            }
            else if(count != 0){
                document.getElementById((r+1).toString() + "," + (c-1).toString()).innerHTML = "<p>" + count.toString() + "</p>";
		document.getElementById((r+1).toString() + "," + (c-1).toString()).style.backgroundColor = "white";
		clicked[r+1][c-1] = "clicked";

	    }
            else{
                document.getElementById((r+1).toString() + "," + (c-1).toString()).style.backgroundColor = "green";
		recurseClear(r+1,c-1);
            }
        }
	if(r + 1 < height && clicked[r+1][c] == "not_clicked"){
	    
            var count = getCount(r+1,c);
	    if(board[r+1][c] == "mine"){
                gameLost();
		clicked[r+1][c] = "clicked";

            }
	    else if(count != 0){
		document.getElementById((r+1).toString() + "," + c.toString()).innerHTML = "<p>" + count.toString() + "</p>";
		document.getElementById((r+1).toString() + "," + c.toString()).style.backgroundColor = "white";
		clicked[r+1][c] = "clicked";

	    }
            else{
                document.getElementById((r+1).toString() + "," + c.toString()).style.backgroundColor = "green";
		recurseClear(r+1,c);
	    }
        }
	//TODO make all ifs in this section look like the one below
	if(r + 1 < height && c + 1 < width && clicked[r+1][c+1] == "not_clicked"){
	    var count = getCount(r+1,c+1);
	    if(board[r+1][c+1] == "mine"){
                gameLost();
		clicked[r+1][c+1] = "clicked";

            }
	    else if(count != 0){
		document.getElementById((r+1).toString() + "," + (c+1).toString()).innerHTML = "<p>" + count.toString() + "</p>";
		document.getElementById((r+1).toString() + "," + (c+1).toString()).style.backgroundColor = "white";
		clicked[r+1][c+1] = "clicked";
	    }
            else{
                document.getElementById((r+1).toString() + "," + (c+1).toString()).style.backgroundColor = "green";
		recurseClear(r+1, c+1);
	    }
        }
	if(c+1 < width && clicked[r][c+1] == "not_clicked"){
           
            var count = getCount(r,c+1);
	    if(board[r][c+1] == "mine"){
                gameLost();
		clicked[r][c+1] = "clicked";

	    }
            else if(count != 0){
                document.getElementById(r.toString() + "," + (c+1).toString()).innerHTML = "<p>" + count.toString() + "</p>";
		document.getElementById(r.toString() + "," + (c+1).toString()).style.backgroundColor = "white";
		clicked[r][c+1] = "clicked";

	    }
            else{
                document.getElementById(r.toString() + "," + (c+1).toString()).style.backgroundColor = "green";
		recurseClear(r, c+1);
	    }
        }

	if( r-1 >=0 && c+1 < width && clicked[r-1][c+1] == "not_clicked"){
            
            var count = getCount(r-1,c+1);
	    if(board[r-1][c+1] == "mine"){
                gameLost();
		clicked[r-1][c+1] = "clicked";
		
	    }
            else if(count != 0){
                document.getElementById((r-1).toString() + "," + (c+1).toString()).innerHTML = "<p>" + count.toString() + "</p>";
		document.getElementById((r-1).toString() + "," + (c+1).toString()).style.backgroundColor = "white";
		clicked[r-1][c+1] = "clicked";

	    }
            else{
                document.getElementById((r-1).toString() + "," + (c+1).toString()).style.backgroundColor = "green";
                recurseClear(r-1, c+1);
            }
        }



    }
    else if(clicked[r][c] != "not_clicked"){
	return;
    }
    if(board[r][c] == "mine"){
	gameLost();
    }
    else{
	var count = getCount(r,c);
	if(count > 0){
            this.innerHTML = "<p>" + count.toString() + "</p>";
	    this.style.backgroundColor = "white"
	    clicked[r][c] = "clicked";
	    uncovered++;
	    gameEnd();
	}
	else{
	    console.log("recursing");
	    recurseClear(r,c)
            this.style.backgroundColor = "green";
        
	}
	//clicked[r][c] =="clicked";
	
    }
}

//function that is called if a mine is clicked
function gameLost(){
    for(i = 0; i < height; i++){
        for(j = 0; j < width; j++){
            if(board[i][j] == "mine"){
                document.getElementById(i.toString() + "," + j.toString()).innerHTML = "";
                document.getElementById(i.toString() + "," + j.toString()).style.backgroundColor = "red";
            }
        }
    }
    started = "over";
    console.log("GAME OVER");
}

//function that is called when all squares without mines are cleared
function gameEnd(){
    if(uncovered == (width * height - mines)){
	alert("You win!");
	started = "over";
    }
    return;
}

//recursive clear that is called if a square with no adjacent mines is cleared
//effectively "clicks" all adjacent squares, since they are known to be mine free.
function recurseClear(r,c){
    if(r < 0 || c < 0 || r >= height || c >= width || clicked[r][c] == "clicked"){
	console.log("recursion returning");
	return;
    }
    var count = getCount(r,c);
    clicked[r][c] = "clicked";
    uncovered++;
    gameEnd();
//    console.log("uncovered = " + uncovered.toString() + ", total to uncover: " + (width * height - mines).toString());
    if(count > 0){
	document.getElementById(r.toString() + "," + c.toString()).innerHTML = "<p>" + count.toString() + "</p>";
	document.getElementById(r.toString() + "," + c.toString()).style.backgroundColor = "white";
	return;
    }
    else{
	document.getElementById(r.toString() + "," + c.toString()).style.backgroundColor = "green";
	
	if(r > 0 && clicked[r-1][c] == "not_clicked"){
	    recurseClear(r - 1, c);
	}
	if(r > 0 && c > 0 && clicked[r-1][c - 1] == "not_clicked"){
            recurseClear(r - 1,c - 1);
        }
	if(r > 0 && c < width - 1 && clicked[r-1][c + 1] == "not_clicked"){
            recurseClear(r - 1,c + 1);
        }

	if(r < height - 1 && c > 0 && clicked[r+1][c - 1] == "not_clicked"){
            recurseClear(r + 1,c - 1);
        }
	if(r < height - 1 && c < width - 1 && clicked[r+1][c + 1] == "not_clicked"){
            recurseClear(r + 1,c + 1);
        }
	if(r < height - 1 && clicked[r+1][c] == "not_clicked"){
            recurseClear(r + 1,c);
        }
	if(c > 0 && clicked[r][c - 1] == "not_clicked"){
            recurseClear(r,c - 1);
        }
	if(c < width && clicked[r][c + 1] == "not_clicked"){
            recurseClear(r,c + 1);
        }

   }
}

//gets the count of adjacent mines given the location of a square
function getCount(r,c){
    var count = 0; 
    if(r - 1 >= 0){
	if(board[r - 1][c] == "mine"){
	    count++;
	}
    }
    if(r + 1 < height){
        if(board[r + 1][c] == "mine"){
	    count++;
        }
    }
    if(r - 1 >= 0 && c - 1 >= 0){
        if(board[r - 1][c - 1] == "mine"){
	    count++;
        }
    }
    if(r - 1 >= 0 && c + 1 < width){
        if(board[r - 1][c + 1] == "mine"){
	    count++;
            }
    }
    if(r + 1 < height && c - 1 >= 0){
        if(board[r + 1][c - 1] == "mine"){
	    count++;
        }
    }
    if(r + 1 < height && c + 1 < width){
        if(board[r + 1][c + 1] == "mine"){
	    count++;
        }
    }
    if(c - 1 >= 0){
        if(board[r][c - 1] == "mine"){
	    count++;
        }
    }
    if(c + 1 < width){
        if(board[r][c + 1] == "mine"){
	    count++;
        }
    }
    return count;
}

    
/*
    console.log(r.toString() + ", " + c.toString());
    console.log(board);
    if(board[c][r] == "mine"){
	document.getElementById(c.toString()+ "," + r.toString()).setAttribute("background-color", "red");
    }
*/

