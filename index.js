"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var axios_1 = __importDefault(require("axios"));
var app = express_1.default();
app.get("/:name", function (req, res) {
    axios_1.default.get("https://restcountries.com/v3.1/name/" + req.params.name + "?fullText=true")
        .then(function (response) { return res.json(response.data); }).catch(function () { return res.json({ 'error': 'con not find country name' }); });
});
var matches = ["malta", "ger", "fr", "eng", "mor", "ha", "ita", "den"];
app.get("/match/:name", function (req, res) {
    axios_1.default.get("https://restcountries.com/v3.1/name/" + req.params.name)
        .then(function (response) {
        var data = response.data;
        var results = Array();
        var _loop_1 = function (elm) {
            var elmtemp = elm.name.common;
            matches.forEach(function (element) {
                if (elmtemp.toLocaleLowerCase().includes(element.toLocaleLowerCase())) {
                    results.push(elm);
                }
            });
        };
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var elm = data_1[_i];
            _loop_1(elm);
        }
        res.json(results);
    });
});
app.get("/game/results", function (req, res) {
    var Reel1 = ["cherry", "lemon", "apple", "banana", "banana", "banana", "lemon", "lemon"];
    var Reel2 = ["lemon", "apple", "lemon", "lemon", "cherry", "apple", "banana", "lemon"];
    var Reel3 = ["apple", "apple", "lemon", "apple", "cherry", "lemon", "banana", "lemon"];
    /*Rewards
            ● 3 cherries in a row: 50 coins, 2 cherries in a row: 40 coins
            ● 3 Apples in a row: 20 coins, 2 Apples in a row: 10 coins
            ● 3 Bananas in a row: 15 coins, 2 Bananas in a row: 5 coins
            ● 3 lemons in a row: 3 coins
    */
    res.json(scan_results(Reel1, Reel2, Reel3));
});
app.listen(3001, function () {
    console.log("serving at http://localhost:3001");
});
function scan_results(reel1, reel2, reel3) {
    var result = {};
    var results = [];
    for (var i = 0; i < reel1.length; i++) {
        if (reel1[i] == reel2[i] && reel2[i] == reel3[i] && reel2[i] == "cherry") {
            //50 coins
            result.coin = 50;
            result.spin_results = "3 cherry";
        }
        else if (reel1[i] == reel2[i] && reel1[i] == "cherry" || reel2[i] == reel3[i] && reel2[i] == "cherry") {
            //40 coins
            result.coin = 40;
            result.spin_results = "2 cherry";
        }
        else if (reel1[i] == reel2[i] && reel2[i] == reel3[i] && reel2[i] == "apple") {
            // 20 coins
            result.coin = 20;
            result.spin_results = "3 apple";
        }
        else if (reel1[i] == reel2[i] && reel1[i] == "apple" || reel2[i] == reel3[i] && reel2[i] == "apple") {
            // 10 coins 
            result.coin = 10;
            result.spin_results = "2 apple";
        }
        else if (reel1[i] == reel2[i] && reel2[i] == reel3[i] && reel2[i] == "banana") {
            // 15 coins
            result.coin = 15;
            result.spin_results = "3 banana";
        }
        else if (reel1[i] == reel2[i] && reel1[i] == "banana" || reel2[i] == reel3[i] && reel2[i] == "banana") {
            // 5 coins
            result.coin = 5;
            result.spin_results = "2 banana";
        }
        else if (reel1[i] == reel2[i] && reel2[i] == reel3[i] && reel2[i] == "lemon") {
            // 3 coins
            result.coin = 3;
            result.spin_results = "3 lemon";
        }
        else {
            result.coin = 0;
            result.spin_results = reel1[i] + "," + reel2[i] + "," + reel3[i];
        }
        results.push(result);
        result = {};
    }
    /*Rewards
        ● 3 cherries in a row: 50 coins, 2 cherries in a row: 40 coins
        ● 3 Apples in a row: 20 coins, 2 Apples in a row: 10 coins
        ● 3 Bananas in a row: 15 coins, 2 Bananas in a row: 5 coins
        ● 3 lemons in a row: 3 coins
*/
    return results;
}
