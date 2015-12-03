/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other


/* PsuedoCode Recursive BackTracking
create new Board
var solution = 0

Helper function (n, emptyBoard)
x  for loop(i -> n) {
x    addToggle to current node @ (row n, column i)

    check if Toggle passes tests
      if Toggle works, 
        helper(n+1, Board w/newToggle)
      
      else if Toggle fails tests
        unToggle node
        break;
      
      else if no children
        solution++
        return;
  }
Helper(n, new Board(n))
*/




window.findNRooksSolution = function(n) {
  var board = new Board({"n": n});
  for (var i = 0; i<n; i++) {
    board.togglePiece(i,i);
  }
  var solution = board.rows();

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board({"n":n});
  
  var workingRow = 0
  var numColumns = n;

  //i = iterates over the columns. go from workingColumns to numColumns
  //

  var helper = function(workingRow) { 
    for (var i=0; i < numColumns; i++) {
      board.togglePiece(workingRow, i)
    
      //Check for conflict. 
        //If conflict, untoggle piece, 
      if(board.hasAnyRooksConflicts()) {
        board.togglePiece(workingRow, i)
        continue;
      //Base case: if get to bottom, add to solution
      } 
      if (workingRow === n-1) {
        solutionCount++
        board.togglePiece(workingRow, i);

      //Recursive case: Iterate to next row and call the same
      } else {
        helper(workingRow+1);
        board.togglePiece(workingRow, i)
      }  
    }
  }
  helper(workingRow);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);

  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution;
  var board = new Board({"n":n});
  var workingRow = 0
  var numColumns = n

  //i = iterates over the columns. go from workingColumns to numColumns
  //

  var helper = function(workingRow) { 
    for (var i=0; i < numColumns; i++) {
      board.togglePiece(workingRow, i)
      //Check for conflict. 
        //If conflict, untoggle piece, 
      if(board.hasAnyQueensConflicts()) {
        board.togglePiece(workingRow, i)
        continue;
      //Base case: if get to bottom, add to solution
      } 
      if (workingRow === n-1) {
         //board.togglePiece(workingRow, i)
         solution = board.rows();
         break;
        }
      //Recursive case: Iterate to next row and call the same
      else {
        console.log(solution, JSON.stringify(board.rows()))
        helper(workingRow+1);
        if (solution === undefined) {
          board.togglePiece(workingRow, i)
        }
      }  
    }
  }
  if (n===0) return [];
  else if (n===1) solution = [[1]];
  else if (n===2) solution = [[0,0],[0,0]];
  else if (n===3) solution = [[0,0,0],[0,0,0],[0,0,0]];
  else {
    helper(workingRow);
  }
  console.log('Single solution for ' + n + ' queens:', solution);
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board({"n":n});
  
  var workingRow = 0
  var numColumns = n;

  var helper = function(workingRow) { 
    for (var i=0; i < numColumns; i++) {
      board.togglePiece(workingRow, i)
    
      //Check for conflict. 
        //If conflict, untoggle piece, 
      if(board.hasAnyQueensConflicts()) {
        board.togglePiece(workingRow, i)
        continue;
      //Base case: if get to bottom, add to solution
      } 
      if (workingRow === n-1) {
        solutionCount++
        board.togglePiece(workingRow, i);

      //Recursive case: Iterate to next row and call the same
      } else {
        helper(workingRow+1);
        board.togglePiece(workingRow, i)
      }  
    }
  }
  helper(workingRow);

  console.log('Number of solutions for ' + n + ' Queens:', solutionCount);

  return solutionCount;
};
