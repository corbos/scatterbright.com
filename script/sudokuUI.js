var Sudoku = (function(sudoku) {

    var ui = function(prefix, logFunc) {
        this.prefix = prefix;
        this.log = logFunc;
        if(typeof logFunc !== "function") {
            this.log = function(){};
        }
    };

    var getModel = function(theUI) {

        var model = new sudoku.Model(),
            i = 0,
            j = 0,
            txt;

        for(i = 0; i < 9; i++) {
            for(j = 0; j < 9; j++) {
                txt = document.getElementById(theUI.prefix + i.toString() + '_' + j.toString());
                if(txt.value.length > 0 && !model.mark(i, j, txt.value * 1 - 1)){
                    return null;
                }
            }
        }
        return model;
    };

    ui.prototype = {

        drawPuzzle:function() {
            var i, j, k, l;
            document.write('<table cellpadding="0" cellspacing="0" class="sudoku_table">');
            for(i = 0; i < 3; i++) {
                document.write('<tr>');
                for(j = 0; j < 3; j++) {
                    document.write('<td class="sudoku_cell">');
                    for(k = 0; k < 3; k++) {
                        document.write('<div>');
                        for(l = 0; l < 3; l++) {
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

        load:function(puzzle) {
            var i, j, inputs = document.getElementsByTagName('input');

            for(i = 0; i < inputs.length; i++) {
                if(inputs[i].className === 'sudoku_text') {
                    inputs[i].value = '';
                }
            }

            for(i = 0; i < 9; i++) {
                for(j = 0; j < 9; j++) {
                    if(puzzle.charAt(i * 9 + j) !== 'X') {
                        document.getElementById(this.prefix + i.toString() + '_' + j.toString()).value = puzzle.charAt(i * 9 + j);
                    }
                }
            }
        },

        solve:function() {

            var model = getModel(this),
                i = 0,
                j = 0,
                txt;

            if(model != null && model.step(0))
            {
                for(i = 0; i < 9; i++) {
                    for(j = 0; j < 9; j++) {
                        txt = document.getElementById(this.prefix + i.toString() + '_' + j.toString());
                        txt.value = model.solved[i][j] + 1;
                    }
                }
            } else {
                this.log('The puzzle is unsolvable.');
            }
        }
    };

    sudoku.UI = ui;

    return sudoku;
}(Sudoku));
