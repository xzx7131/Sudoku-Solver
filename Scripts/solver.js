//show message on the web page
function showMessage(title,message,type="info"){
    var msgTitle = document.getElementById("msg_title");
    msgTitle.innerText = title;
    var msg = document.getElementById("msg");
    msg.innerText = message;
    var msgIcon = document.getElementById("msg_icon");
    var okbtn = document.getElementById("okbtn");
    var clear = document.getElementById("solveClear");
    if (type == "error"){
        msgIcon.style.backgroundImage = "url(msgIcons/error.svg)";
        okbtn.style.left = '60%';
        clear.style.display = 'none';
    }else if (type == "info"){
        msgIcon.style.backgroundImage = "url(msgIcons/info.svg)";
        okbtn.style.left = '60%';
        clear.style.display = 'none';
    }else if (type == "solved"){
        msgIcon.style.backgroundImage = "url(msgIcons/solved.svg)";
        okbtn.style.left = '30%';
        clear.style.display = 'inline';
    }
    var panel = document.getElementById("popWindow");
    panel.style.display = "inline";
}

//clear input
function clearGrid(){
    for (var n=0;n<81;n++){
        document.body.getElementsByTagName("input")[n].value = '';
        document.body.getElementsByTagName("input")[n].style.color = '#0000ff';
    }
    showMessage("Sudoku Solver","Info: Input cleared");
}

//solve the puzzle from the web page
function solve(){
    var start = performance.now();

    var bool = checkInput();
    if(bool){
        var grid = readTopic();
        if(!isValidGrid(grid)){
            showMessage("Sudoku Solver","Error:Invalid grid",type="error");
        }else{
            if(search(grid)){
                var stop = performance.now();
                var time = stop-start;
                showOutput(time);
            }else{
                showMessage("Sudoku Solver","Error:No solution",type="error");
            }
        }
    }

    //hide the load window
    var loading = document.getElementById("load");
    loading.style.display = 'none';
}

function load(){
    var loadWindow = document.getElementById("load");
    loadWindow.style.display = 'inline';

    setTimeout("solve()",10);
}

function checkInput(){
    var arr = new Array();
    
    for(var i=0; i<81; i++){
        arr[i] = Number(document.getElementsByTagName("input")[i].value);
        if(isNaN(arr[i])){
            showMessage("Sudoku Solver","Error:Input should be any number between 1 and 9",
            type="error");
            return false
        }
    }
    
    if(arr.every(function isZero(x){return x == 0})){
        showMessage("Sudoku Solver","Error:Wrong Input",type="error");
        return false
    }
    
    return true
}

function readTopic(){
    var arr = new Array();
    
    for(var i=0; i<81; i++){
        arr[i] = Number(document.getElementsByTagName("input")[i].value);
    }
    
    var grid = new Array();
    for(var i=0; i<9; i++){
        grid[i] = new Array();
        for(var j=0; j<9; j++){
            grid[i][j] = 0;
        }    
    }
    
    
    for(var i=0; i<81; i++){
        grid[Math.floor(i/9)][i%9] = arr[i];
    }
    
    return grid
}
function getCellList(grid){
    var freeCellList = new Array();
    index = 0
    
    for(var i=0; i<9; i++){
        for(var j=0; j<9; j++){
            if(grid[i][j] == 0){
                freeCellList[index] = new Array(i,j);
                index++;
            }
        }
    }
                
    return freeCellList
}

function isValid(i,j,grid){
    for(var column=0; column<9; column++){
        if((column != j) && (grid[i][column] == grid[i][j])){
            return false
        }
    }
         
    for(var row=0; row<9; row++){
        if((row != i) && (grid[row][j] == grid[i][j])){
            return false
        }
    }
 
    for(var row=Math.floor(i/3)*3; row < Math.floor(i/3)*3+3; row++){
        for(var col=Math.floor(j/3)*3; col < Math.floor(j/3)*3+3; col++){
            if((row != i) && (col != j) && (grid[row][col] == grid[i][j])){
                return false
            }
        }
    }
             
    return true
}

function isValidGrid(grid){
    for(var i=0; i<9; i++){
        for(var j=0; j<9; j++){
            if((grid[i][j] < 0) || (grid[i][j] > 9) || ((grid[i][j] != 0) && (! isValid(i,j,grid)))){
                return false
            }
        }
    }
    return true
}


function search(grid){
    var freeCellList = getCellList(grid);
    var numberOfFreeCells = freeCellList.length;
    if(numberOfFreeCells == 0){
        return true
    }
    
    var k = 0;
 
    while(true){
        var i = freeCellList[k][0];
        var j = freeCellList[k][1];
        if(grid[i][j] == 0){
            grid[i][j] = 1;
        }
 
        if(isValid(i,j,grid)){
            if(k+1 == numberOfFreeCells){
                return true
            }else{
                k++;
            }
        }else{
            if(grid[i][j] < 9){
                grid[i][j]++;
            }else{
                while(grid[i][j] == 9){
                    if(k == 0){
                        return false
                    }
                    grid[i][j] = 0;
                    k--;
                    i = freeCellList[k][0];
                    j = freeCellList[k][1];
 
                } 

                grid[i][j]++;
            }
        }
    }
 
    return true
}

function showOutput(time_used){
    var grid = readTopic();
    var grid_original = readTopic();
    
    if(search(grid)){
        for(var i=0; i<81; i++){
            if(grid[Math.floor(i/9)][i%9] != grid_original[Math.floor(i/9)][i%9]){
                document.getElementsByTagName("input")[i].value = grid[Math.floor(i/9)][i%9];
                document.getElementsByTagName("input")[i].style.color = '#000000';
            }
        }
    }

    var formatTime = Math.round(time_used*1000)/1000;
    var msg = "Execution time: "+formatTime+"ms";
    showMessage("Puzzle solved",msg,type="solved");
}
