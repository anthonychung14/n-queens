// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      //counter = 0
      //forEach
        //  if element === 0, counter ++
      //return false if counter > 1
      var counter = 0;
      var status = false;
      for (var i = 0; i < this.rows().length; i++) {
        if (this.rows()[rowIndex][i] === 1) {
          counter++;
        }
        if (counter > 1) { 
          status = true;
          break;
        } 
      }
      return status;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var rowConflict = false;
      for(var i = 0; i < this.rows().length; i++) {
        if (this.hasRowConflictAt(i)) {
          rowConflict= true;
          break;
        }
      }
      return rowConflict
      //
    },


    columns: function() {
      var colArray = [];
      var matrix = this.rows();
      for (var j=0; j<matrix.length; j++) {
        var col = [];
        for (var i=0; i<matrix.length; i++) {
          col.push(matrix[i][j]);
        }
        colArray.push(col);
      }
      return colArray;
      // return this.rows().reduce(function(matrix, row) {
      //   return row.reduce(function(colArray, item) {
      //     colArray.push(item) 
      //   }, []) 
      // }, []);
    },
    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var counter = 0;
      var status = false;
      for (var i = 0; i < this.columns().length; i++) {
        if (this.columns()[colIndex][i] === 1) {
          counter++;
        }
        if (counter > 1) { 
          status = true;
          break;
        } 
      }
      return status;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var colConflict = false;
      for(var i = 0; i < this.columns().length; i++) {
        if (this.hasColConflictAt(i)) {
          colConflict= true;
          break;
        }
      }
      return colConflict;
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict

    majDiag: function() {
      //Builds a diag array from the top right iterating all the way down to bottom left
      var majDiagHash = {};
      //make a matrix of all diag keys
      for (var i = -(this.get("n")-1); i < (this.get("n")); i++) {
        majDiagHash[i] = [];
      }
      //compute diag index for all values and assign to key

      //iterate over all values in array. calculate diag index and add to key

      for (var t = 0; t < this.get("n"); t++) {
        for (var u = 0; u <this.get("n"); u++) {
          majDiagHash[this._getFirstRowColumnIndexForMajorDiagonalOn(t, u)].push(this.rows()[t][u]);
        }
      }

      return majDiagHash;
    },

    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var counter = 0;
      var status = false;
      
      //lookup index and then loop
      var diagArray = this.majDiag()[majorDiagonalColumnIndexAtFirstRow];
      for (var i = 0; i < diagArray.length; i++) {
        if (diagArray[i] === 1) {
          counter++;
        }
        if (counter > 1) { 
          status = true;
          break;
        } 
      }
      return status;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var diagConflict = false;
      var diagHash = this.majDiag();
      for (var i = -(this.get("n")-1); i < (this.get("n")); i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          diagConflict = true;
          break;
        }        
      }
      return diagConflict;
    },

    minDiag: function() {
      //Builds a diag array from the top right iterating all the way down to bottom left
      var minorDiagHash = {};
      //make a matrix of all diag keys
      for (var i = 0; i <= ((2*this.get("n"))-2); i++) {
        minorDiagHash[i] = [];
      }
      //compute diag index for all values and assign to key

      //iterate over all values in array. calculate diag index and add to key

      for (var a = 0; a < this.get("n"); a++) {
        for (var b = 0; b <this.get("n"); b++) {
          minorDiagHash[this._getFirstRowColumnIndexForMinorDiagonalOn(a, b)].push(this.rows()[a][b]);
        }
      }

      return minorDiagHash;
    },

    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var counter = 0;
      var status = false;

      var diagArray = this.minDiag()[minorDiagonalColumnIndexAtFirstRow];
      for (var i = 0; i < diagArray.length; i++) {
        if (diagArray[i] === 1) {
          counter++;
        }
        if (counter > 1) { 
          status = true;
          break;
        } 
      }
      return status;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var diagConflict = false;
      var diagHash = this.minDiag();

      for (var i = 0; i <= ((2*this.get("n"))-2); i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          diagConflict = true;
          break;
        } 
      }
      return diagConflict; // fixme
    },


    //Solver Helper Functions here
    toggleSafely: function(rowIndex, colIndex) {
      //check row conflict
      this.togglePiece(rowIndex, colIndex)
      if (this.hasColConflictAt(colIndex) || this.hasRowConflictAt(rowIndex)) {
        this.togglePiece(rowIndex, colIndex)
      }
    }


    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
