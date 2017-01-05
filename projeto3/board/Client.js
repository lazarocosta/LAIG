/**
 * Client
 * @constructor
 */
function Client(address,port) {
    this.address = address || 'http://localhost';
    this.port = port || 8081;
}

Client.prototype.constructor = Client;

Client.prototype.createRequest = function () {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE ) {
            if (request.status == 200) {
                return request.responseText;
            }
            else if (request.status == 400) {
                console.log("Bad request");
                return false;
            }
            else {
                console.log("No available connection");
                return false;
            }
        }
    };
    return request;
};

Client.prototype.sendRequest = function(requestString) {
    var request = this.createRequest();
    var requestUrl = this.address + ":" + this.port + "/" + requestString;
    request.open("GET", requestUrl, false);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
    return request.onreadystatechange();
};

/*function getPrologRequest(requestString, onSuccess, onError, port) {
    var requestPort = port || 8081
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

    request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
    request.onerror = onError || function () { console.log("Error waiting for response"); };

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

function handleReply(data) {
    return data.target.response;
}*/