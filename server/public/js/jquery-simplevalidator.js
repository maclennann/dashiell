// A simple JQuery plugin that runs the value in a text box against a validation
// action and prints the results to a div.
//
// Binds to a button and runs on-click.
//
// dataSelector must be a selector that targets a textbox (your input for validation)
// resultSelector must be a selector that targets a div into which the validation results are printed
// validationAction must be a function that expects a string and returns a promise
$(function(){

    $.fn.simpleValidator = function(dataSelector, resultSelector, validationAction) {

        // Store all this so the closure has access when we actually have to run it.
        var button = this;
        var results = $(resultSelector);
        var action = validationAction;
        var textBox = $(dataSelector);

        var validate = function(e) {
            var dataValidator = new $.simpleValidator.ui.spinningButton(button);
            dataValidator.spinButton();

            action(textBox.val(), e).done(function(result) {
                results.html(result);
            })
            .fail(function(data, statusText, error) {
                results.html("Error! " + status + "<br/>" + error);
            })
            .always(function() {
                dataValidator.stopButton();
            });
        };

        button.on('click', function(e) {
            e.preventDefault();
            validate(e);
        });
    }

    $.simpleValidator = $.simpleValidator || {};
    $.simpleValidator.ui = $.simpleValidator.ui || {
        spinningButton: function(selector) {
            var button = $(selector);
            var spin = function() {
                button.each(function(btn){
                    reallySpin(button[btn]);
                });

            },
            stop = function() {
                $(button).children(".fa").removeClass("fa-circle-o-notch fa-spin");
            },
            reallySpin = function(obj){
                obj = $(obj);

                if (obj.children(".fa").length !== 1) {
                    obj.append("<i class='fa'></i>");
                }
                $(obj).children(".fa").addClass("fa-circle-o-notch fa-spin");
            };

            return {
                spinButton: spin,
                stopButton: stop
            };
        }
    };

    $.simpleValidator.validators = $.simpleValidator.validators || {
        // Built-in validator to post the contents of your textbox to a url
        // Whatever the server sends back will be dropped into the result element
        urlValidator: function (url, method, paramName) {
            return function (paramValue) {
                var data = {};
                data[paramName] = paramValue;

                return $.ajax({
                    url: url,
                    contentType: 'application/json',
                    dataType: 'html',
                    type: method,
                    data: data
                });
            }
        }
    };

}());
