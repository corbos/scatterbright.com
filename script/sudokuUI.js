var Sudoku = (function(sudoku){

    var ui = function(prefix, logFunc){
        this.prefix = prefix;
        this.log = logFunc;
    };
    
    var getModel = function(theUI){
        var model = new sudoku.Model();
        for(var i=0;i<9;i++){
            for(var j=0;j<9;j++){
                var txt = $('#' + theUI.prefix + i.toString() + '_' + j.toString());
                if(txt.val().length > 0 && !model.mark(i,j,txt.val() * 1 - 1)){
                    return null;
                }
            }
        }
        return model;
    };
    
    ui.prototype = {
        drawPuzzle:function(){
            document.write('<table cellpadding="0" cellspacing="0" class="sudoku_table">');
            for(var i=0;i<3;i++){
                document.write('<tr>');
                for(var j=0;j<3;j++){
                    document.write('<td class="sudoku_cell">');
                    for(var k=0;k<3;k++){
                        document.write('<div>');
                        for(var l=0;l<3;l++){
                            document.write('<input type="text" class="sudoku_text" id="' + this.prefix + ((i * 3) + k).toString() + '_' + ((j * 3) + l).toString() + '" />');
                        }
                        document.write('</div>');
                    }
                    document.write('</td>');
                }
                document.write('</tr>');
            }
            document.write('</table>');
        },
        load:function(puzzle){         
            $('.sudoku_text').val('');
            for(var i=0;i<9;i++){
                for(var j =0;j<9;j++){
                    if(puzzle.charAt(i * 9 + j) != 'X'){
                        $('#' + this.prefix + i.toString() + '_' + j.toString()).val(puzzle.charAt(i * 9 + j));
                    }
                }
            }
        },
        solve:function(){
            var model = getModel(this);            
            if(model != null && model.step(0))
            {
                for(var i=0;i<9;i++){
                    for(var j=0;j<9;j++){
                        var txt = $('#' + this.prefix + i.toString() + '_' + j.toString());
                        txt.val(model.solved[i][j] + 1);
                    }
                }
            }
            else{
                if(typeof(this.log) == 'function')
                    this.log('The puzzle is unsolvable.');
            }                    
        }
    };  

    sudoku.UI = ui;
    
    return sudoku;
}(Sudoku));