(function(willy){

    var IterateRandom = function(solver){
        this.solver = solver;       
    };

    willy.extendAlgorithm(IterateRandom, 'OneRandom', 'randomSolution');

    IterateRandom.prototype.solve = function(){
        return this.randomSolution();
    };

    willy.register({
        name: 'Iterate Random Solutions',
        IterateRandom: IterateRandom
    });

})(WillyLoman);
