var dashiell = dashiell || {};

dashiell.queryRunner = function(text) {
    var action = $('input[name=qtype]:checked').val();
    var deferred = new $.Deferred();

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
        dashiell.queryResults(result.Guid).done(deferred.resolve);
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
            var answerString = "";

            // Make some HTML out of the results
            answer.forEach(function (a){
                answerString = answerString + "Host: " + a.Hostname + "<br/>";
                var payload = JSON.parse(a.Payload)["1"];
                answerString = answerString + "Package: " + payload.name + "<br/>";
                answerString = answerString + "Version: " + payload.version + "<br/>";
                answerString = answerString + "<br/><br/>";
            });

            deferred.resolve(answerString);
        });
    }, 3000);

    return deferred.promise();
}
