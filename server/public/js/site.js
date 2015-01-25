var dashiell = dashiell || {};

dashiell.queryRunner = function(text, e) {
    var action = $(e.target).attr("data-query-engine")
    var deferred = new $.Deferred();

    var spinner = new $.simpleValidator.ui.spinningButton('#run-with');
    spinner.spinButton();
    $(".dropdown-menu>li").addClass("disabled");

    // Post the query!
    var resp = $.ajax({
        url: "/query",
        contentType: 'application/json',
        dataType: 'json',
        type: "POST",
        data: JSON.stringify({Action: action, Payload: text})
    });

    // Once we have the Guid, wait 3 seconds for the query to finish
    // (default server timeout is 2) and query for the results
    resp.done(function(result){
        dashiell.queryResults(result.Guid).done(function(data){
            deferred.resolve(data);
            spinner.stopButton();
            $(".dropdown-menu>li").removeClass("disabled");
        });
    });

    return deferred.promise();
};

dashiell.queryResults = function(guid){
    var deferred = new $.Deferred();

    // After 3 seconds, check our query status
    // for now, we'll just assume it's done.
    setTimeout(function(){
        console.log("checking status!");
        var final = $.ajax({
            url: "/query/"+guid,
            contentType: 'application/json',
            dataType: 'json',
            type: "GET"
        });

        final.done(function(answer){
            var answerString = dashiell.tableResults(answer);

            deferred.resolve(answerString);
        });
    }, 3000);

    return deferred.promise();
};

// TODO: Template-ify this. This doesn't work for deep facter responses!
dashiell.tableResults = function(answer){
    var answerString = "";

    // Make some HTML out of the results
    answer.forEach(function (a){
        var payload = a.Payload;
        answerString = answerString + "<table class='table table-striped table-bordered'>";
        answerString = answerString + "<caption>Host: " + a.Hostname + "</caption>";
        answerString = answerString + "<thead>";
        for(var property in payload["1"]){
            if(payload["1"].hasOwnProperty(property)){
                answerString = answerString + "<th>" + property + "</th>";
            }
        }
        answerString = answerString + "</thead><tbody>";
        for(var row in payload){
            var thisRow = payload[row];
            answerString = answerString + "<tr>";
            for(var property in thisRow){
                if(thisRow.hasOwnProperty(property)){
                    answerString = answerString + "<td>" + thisRow[property] + "</td>";
                }
            }
            answerString = answerString + "</tr>";
        }

        answerString = answerString + "</tbody></table>";
    });

    return answerString;
}
