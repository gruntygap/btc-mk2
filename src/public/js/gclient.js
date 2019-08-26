// Client ID and API key from the Developer Console
var CLIENT_ID = "260456992509-kothasqkfal1d5r6oi6t3pj8so3kl1rg.apps.googleusercontent.com";
var API_KEY = "AIzaSyBIGF2uETf51A5ZBVyJ64PrYHeWmS6pmVo";

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

var authorizeButton = document.getElementById("authorize_button");
var signoutButton = document.getElementById("signout_button");
var viewButton = document.getElementById('view_button');
var addButton = document.getElementById('add_button');

/**
    *  On load, called to load the auth2 library and API client library.
    */
function handleClientLoad() {
    gapi.load("client:auth2", initClient);
}

/**
    *  Initializes the API client library and sets up sign-in state
    *  listeners.
    */
function initClient() {
    gapi.client
        .init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        })
        .then(
            function() {
                // Listen for sign-in state changes.
                gapi.auth2
                    .getAuthInstance()
                    .isSignedIn.listen(updateSigninStatus);

                // Handle the initial sign-in state.
                updateSigninStatus(
                    gapi.auth2.getAuthInstance().isSignedIn.get()
                );
                authorizeButton.onclick = handleAuthClick;
                signoutButton.onclick = handleSignoutClick;
                viewButton.onclick = handleViewClick;
                addButton.onclick = handleAddClick;
            },
            function(error) {
                appendPre(JSON.stringify(error, null, 2));
            }
        );
}

/**
    *  Called when the signed in status changes, to update the UI
    *  appropriately. After a sign-in, the API is called.
    */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = "none";
        signoutButton.style.display = "inline";
        viewButton.style.display = 'inline';
        addButton.style.display = 'inline';
    } else {
        authorizeButton.style.display = "block";
        signoutButton.style.display = "none";
        viewButton.style.display = 'none';
        addButton.style.display = 'none';
    }
}

/**
    *  Sign in the user upon button click.
    */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
    *  Sign out the user upon button click.
    */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

function handleViewClick(event) {
    listUpcomingEvents();
}

function handleAddClick(event) {
    createFakeAppointment();
}

/**
    * Append a pre element to the body containing the given message
    * as its text node. Used to display the results of the API call.
    *
    * @param {string} message Text to be placed in pre element.
    */
function appendPre(message) {
    var pre = document.getElementById("content");
    var textContent = document.createTextNode(message + "\n");
    pre.appendChild(textContent);
}

/**
    * Print the summary and start datetime/date of the next ten events in
    * the authorized user's calendar. If no events are found an
    * appropriate message is printed.
    */
function listUpcomingEvents() {
    gapi.client.calendar.events
        .list({
            calendarId: "primary",
            timeMin: new Date().toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 10,
            orderBy: "startTime"
        })
        .then(function(response) {
            var events = response.result.items;
            appendPre("Upcoming events:");

            if (events.length > 0) {
                for (i = 0; i < events.length; i++) {
                    var event = events[i];
                    var when = event.start.dateTime;
                    if (!when) {
                        when = event.start.date;
                    }
                    appendPre(event.summary + " (" + when + ")");
                }
            } else {
                appendPre("No upcoming events found.");
            }
        });
}

function createFakeAppointment() {
    const events = createEvents();
    for (let i = 0; i < events.length; i++) {
        const request = gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': events[i]
        });
        request.execute((eventt) => {
            appendPre('Event Created: ' + eventt.htmlLink);
        });
    }
}

function createEvents() {
    const classEvents = window.classes;
    const events = [];
    for (let i = 0; i < classEvents.length; i++) {
        events.push({
            "summary": classEvents[i].name,
            "location": classEvents[i].classroom,
            "description": `Instructor: ${classEvents[i].instructor}\nCredits: ${classEvents[i].credits}\nTerm: ${classEvents[i].term}\nLevel: ${classEvents[i].level}\n`,
            "start": {
                "dateTime": classEvents[i].startDatetime,
                "timeZone": "America/Chicago",
            },
            "end": {
                "dateTime": classEvents[i].endDatetime,
                "timeZone": "America/Chicago",
            },
            "recurrence": [
                "RRULE:FREQ=WEEKLY;BYDAY="+classEvents[i].dow+";UNTIL="+classEvents[i].until+";"
            ],
        });
    }
    return events;
}

