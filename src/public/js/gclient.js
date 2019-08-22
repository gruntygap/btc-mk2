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
        signoutButton.style.display = "block";
        viewButton.style.display = 'block';
        addButton.style.display = 'block';
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
    let event = {
        'summary': 'Google I/O 2015',
        'location': '800 Howard St., San Francisco, CA 94103',
        'description': 'A chance to hear more about Google\'s developer products.',
        'start': {
            'dateTime': '2019-09-03T09:00:00-07:00',
            'timeZone': 'America/Los_Angeles'
        },
        'end': {
            'dateTime': '2019-09-03T10:00:00-07:00',
            'timeZone': 'America/Los_Angeles'
        },
        'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=2'
        ],
        'reminders': {
            'useDefault': false,
            'overrides': [
                {'method': 'email', 'minutes': 24 * 60},
                {'method': 'popup', 'minutes': 10}
            ]
        }
    };
    const request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
    });
    request.execute((eventt) => {
        appendPre('Event Created: ' + eventt.htmlLink);
    });
}

function createEvents() {
    const classEvents = window.classes;
    const events = [];
    for (let i = 0; i < classEvents.length; i++) {
        let event = {
            "summary": class_.class_name,
            "location": class_.class_location,
            "description": "",
            "start": {
                "dateTime": start.strftime("%Y-%m-%dT%H:%M:%S-06:00"),
                "timeZone": "America/Chicago",
            },
            "end": {
                "dateTime": end.strftime("%Y-%m-%dT%H:%M:%S-06:00"),
                "timeZone": "America/Chicago",
            },
            "recurrence": [
                "RRULE:FREQ=WEEKLY;BYDAY="+days+";UNTIL="+until+";"
            ],
        };
    }
}

