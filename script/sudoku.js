var Sudoku = (function(){

    var sudoku = {};
    
    sudoku.section = function(row, col){
        var srow = Math.floor(row / 3) * 3;
        var scol = Math.floor(col / 3);
        return srow + scol;
    };
    
    var model = function(){
        this.rows = [];
        this.cols = [];
        this.sect = [];
        this.solved = [];
        for(var i=0;i<9;i++){
            this.rows.push([true,true,true,true,true,true,true,true,true]);
            this.cols.push([true,true,true,true,true,true,true,true,true]);
            this.sect.push([true,true,true,true,true,true,true,true,true]);
            this.solved.push([-1,-1,-1,-1,-1,-1,-1,-1,-1]);
        }
    };
    
    model.prototype = {
        mark:function (row,col,v){	
            var sect = sudoku.section(row,col);            
            var result = this.rows[row][v] && this.cols[col][v] && this.sect[sect][v];
            if(result){
                this.solved[row][col] = v;
                this.rows[row][v] = false;
                this.cols[col][v] = false;
                this.sect[sect][v] = false;
            }
            return result;
        },
        step:function(index){

            if(index == 81){
                return true;
            }
            
            var i = Math.floor(index / 9);
            var j = index % 9;
            
            if(this.solved[i][j] > -1){
                return this.step(index + 1);
            }
            
            var sect = sudoku.section(i,j);
            
            for(var k=0;k<9;k++){
                if(this.mark(i,j,k)){
                    if(this.step(index + 1)){
                        return true;
                    }
                     //rollback changes		
                    this.solved[i][j] = -1;
                    this.rows[i][k] = true;
                    this.cols[j][k] = true;
                    this.sect[sect][k] = true;		
                }              
            }
            return false;
        }
    };
    
    sudoku.Model = model;
    
    return sudoku;
}());