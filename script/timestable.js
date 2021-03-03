function TimesTableDriller() {

    function question(left, right) {
        this.left = left;
        this.right = right;
        this.answer = left * right;
    }

    function byId(id) {
        return document.getElementById(id);
    }

    var STATUS_WAIT = 0;
    var STATUS_READY = 1;
    var STATUS_ANSWER = 2;
    var STATUS_DONE = 3;

    var CANVAS_WIDTH = 800;
    var CANVAS_HEIGHT = 600;
    var CANVAS_HALF_WIDTH = CANVAS_WIDTH / 2;
    var MESSAGE_WIDTH = 700;
    var MESSAGE_HEIGHT = 200;
    var MESSAGE_CENTER_Y = 150;
    var ANSWER_WIDTH = 300;
    var ANSWER_HEIGHT = 200;
    var ANSWER_CENTER_Y = 400;

    var paper = Raphael('paper', CANVAS_WIDTH, CANVAS_HEIGHT);
    var panel = paper.rect(0, 0, 0, 0, 20);
    var txt = paper.text();
    var answerPanel = paper.rect(
        (CANVAS_WIDTH - ANSWER_WIDTH) / 2,
        ANSWER_CENTER_Y - (ANSWER_HEIGHT / 2),
        ANSWER_WIDTH,
        ANSWER_HEIGHT,
        20).attr({ fill: '#FFFFFF', stroke: '#000000' });
    var answerTxt = paper.text(CANVAS_HALF_WIDTH, ANSWER_CENTER_Y, '')
        .attr({ 'font-size': 100 });

    var that = this;
    var status = STATUS_WAIT;
    var given = Number.NaN;
    var correct = 0;
    var incorrect = 0;
    var time;
    var q = null;
    var qIndex = 0;
    var qCount = 0;
    var questions = [];

    function randInt(limit) {
        return Math.floor(Math.random() * (limit + 1));
    }

    function showMessage(msg, color, fontsize, callback) {
        panel.attr({ x: CANVAS_HALF_WIDTH, y: MESSAGE_CENTER_Y, width: 0, height: 0, fill: color });
        txt.attr({ x: CANVAS_HALF_WIDTH, y: MESSAGE_CENTER_Y, 'font-size': 1, text: msg });
        panel.animate({
            x: (CANVAS_WIDTH - MESSAGE_WIDTH) / 2,
            y: MESSAGE_CENTER_Y - (MESSAGE_HEIGHT / 2),
            width: MESSAGE_WIDTH,
            height: MESSAGE_HEIGHT
        },
            1000,
            callback);
        txt.animate({ 'font-size': fontsize }, 1000);
    }

    this.drill = function () {
        given = Number.NaN;
        answerPanel.attr({ fill: '#FFFFFF' });
        answerTxt.attr({ text: ' ' });
        status = STATUS_WAIT;
        correct = 0;
        incorrect = 0;
        questions.length = 0;
        for (var i = 0; i <= 11; i++) {
            for (var j = 0; j <= 11; j++) {
                questions.push(new question(i, j));
                byId('td' + i.toString() + '_' + j.toString()).className = '';
            }
        }
        byId('paper').style.display = "block";
        byId('results').style.display = "none";
        showMessage('How many questions\nshould I ask you?', '#94CDFF', 50, function () { status = STATUS_READY; });
    };

    function ask() {
        given = Number.NaN;
        qIndex = randInt(questions.length - 1);
        q = questions[qIndex];
        showMessage(
            q.left.toString() + ' X ' + q.right.toString() + ' =',
            '#D8FFCF', 100);
        answerPanel.attr({ fill: '#FFFFFF' });
        answerTxt.attr({ text: ' ' });
        status = STATUS_ANSWER;
    }

    function done() {
        status = STATUS_DONE;
        byId('resultCorrect').innerText = 'You answered ' + correct.toString()
            + ' out of ' + (correct + incorrect).toString() + ' questions correctly.';
        byId('resultTime').innerText = getTimeMessage(new Date().getTime() - time);
        byId('paper').style.display = "none";
        byId('results').style.display = "block";
    }

    function getTimeMessage(diff) {
        var msg = 'It took you ';
        var m = Math.floor(diff / 60000);
        if (m > 0)
            msg = msg + m.toString() + ' minute' + (m > 1 ? 's' : '') + ' and ';
        var s = (diff % 60000) / 1000;
        return msg + s.toString() + ' seconds.';
    }

    function handleQuestionCount() {
        if (!isNaN(given)) {
            qCount = given;
            showMessage('Ready?', '#94CDFF', 100, function () {
                ask();
                time = new Date().getTime();
            });
        }
    }

    function handleAnswer() {
        if (!isNaN(given) && given == q.answer) {
            correct++;
            byId('td' + q.left.toString() + '_' + q.right.toString()).className = 'correct';
            answerPanel.attr({ fill: '#00FF00' });
        }
        else {
            incorrect++;
            byId('td' + q.left.toString() + '_' + q.right.toString()).className = 'incorrect';
            answerPanel.attr({ fill: '#FF0000' });
        }
        questions.splice(qIndex, 1);
        qCount--;
        if (questions.length == 0 || qCount <= 0)
            setTimeout(function () { done(); }, 250);
        else
            setTimeout(function () { ask(); }, 250);
    }

    document.addEventListener("keydown", function (e) {
        e.preventDefault();
        if (status == STATUS_READY || status == STATUS_ANSWER) {
            if (e.key == "Backspace") {
                if (given < 10)
                    given = Number.NaN;
                else
                    given = Math.floor(given / 10);
            }
            else if (e.key == "Enter") {
                if (status == STATUS_READY)
                    handleQuestionCount();
                else
                    handleAnswer();
            }
            else {
                var num = parseInt(e.key, 10);
                if (!isNaN(num)) {
                    if (isNaN(given)) given = 0;
                    if (given < 100)
                        given = given * 10 + num;
                }
            }
            if (isNaN(given))
                answerTxt.attr({ text: ' ' });
            else
                answerTxt.attr({ text: given.toString() });
        }
        else if (status == STATUS_DONE && e.key == "Enter") {
            e.preventDefault();
            that.drill();
        }
    });
}

new TimesTableDriller().drill();
