import { endOfDay, format, getDay, parse, setDay } from 'date-fns';
import parser from 'fast-html-parser';
import superagent from 'superagent';

// Might have to place this into getClassData, not sure.

async function getLoginFormHtml(agent: any) {
    const request = await agent
        .get('https://auth-prod.bethel.edu/cas/login?service=https%3A%2F%2Fbanner.bethel.edu%2Fssomanager%2Fc%2FSSB');
    return request;
}

async function getExecutionString(html: string) {
    const parsable = parser.parse(html);
    const executionElement = parsable.querySelectorAll('input')
        .filter((thing: any) => thing.attributes.name === 'execution')[0];
    const executionParam = executionElement.attributes.value;
    return executionParam;
}

async function getDetailScheduleHtml(user: string, pass: string, execution: string, agent: any) {
    const req1 = await agent
        .post('https://auth-prod.bethel.edu/cas/login')
        .type('form')
        .set('user-agent', 'YEETMAN')
        .send({ separator: ':' })
        .send({ username: user })
        .send({ password: pass })
        .send({ execution })
        .send({ _eventId: 'submit' });
    const req2 = await agent
        .get('https://banner.bethel.edu/prod8/bwskfshd.P_CrseSchdDetl?term_in=202011')
        .set('user-agent', 'YEETMAN');
    return req2;
}

function parseDetailSchedule(html: string) {
    const parsable = parser.parse(html);
    const names = parsable.querySelectorAll('.captiontext').map((yote: any) => yote.text).filter((yote: any) => yote !== 'Scheduled Meeting Times');
    const metaData = parsable.querySelector('.pagebodydiv')
        .querySelectorAll('table')
        .filter((something: any) => something.attributes.SUMMARY === 'This layout table is used to present the schedule course detail');
    const meetingData = parsable.querySelector('.pagebodydiv')
        .querySelectorAll('table')
        .filter((something: any) => something.attributes.SUMMARY === 'This table lists the scheduled meeting times and assigned instructors for this class..');
    const classData = [];
    for (let i = 0; i < metaData.length; i++) {
        const trs = metaData[i].removeWhitespace().querySelectorAll('tr');
        const event = meetingData[i].removeWhitespace().querySelectorAll('td');

        const term = trs[0].querySelector('td').text;
        const crn = trs[1].querySelector('td').text;
        const status = trs[2].querySelector('td').text;
        const instructor = trs[3].querySelector('TD').text;
        const credits = trs[5].querySelector('td').text;
        const level = trs[6].querySelector('td').text;
        const campus = trs[7].querySelector('td').text;

        const time = event[1].text;
        let dow = event[2].text;
        const classroom = event[3].text;
        const yearConstraints = event[4].text;

        // recreate/create some resources
        dow = convertWeekdays(dow);
        const { endDatetime, startDatetime, until } = splitDate(yearConstraints, time, dow);

        const emptyStructure = {
            campus,
            classroom,
            credits,
            crn,
            dow,
            endDatetime,
            instructor,
            level,
            name: names[i],
            startDatetime,
            status,
            term,
            time,
            until,
        };
        classData.push(emptyStructure);
    }
    return classData;
}

function splitDate(constraints: string, times: string, dow: string) {
    const dateArray = constraints.split(' - ');
    const timeArray = times.split(' - ');
    const dowArray = dow.split(',');
    const dowNumArray: number[] = [];
    const dowConfirm: any = {
        FR: 5,
        MO: 1,
        TH: 4,
        TU: 2,
        WE: 3,
    };
    let startDatetime = parse(`${dateArray[0]}|${timeArray[0]}`, 'MMM dd, yyyy|h:mm aaaa', new Date());
    let endDatetime = parse(`${dateArray[0]}|${timeArray[1]}`, 'MMM dd, yyyy|h:mm aaaa', new Date());
    const until = format(endOfDay(parse(`${dateArray[1]}`, 'MMM dd, yyyy', new Date())), "yyyyMMdd'T'kkmmss'Z'");
    for (let i = 0; i < dowArray.length; i++) {
        dowNumArray.push(dowConfirm[dowArray[i]]);
    }
    // ensure that the start of the event is on a day of class
    type lol = 0 | 1 | 2 | 3 | 5 | 6 | 4 | undefined;
    const firstDayInt: lol = getDay(startDatetime) as lol;
    let attempt = 1;
    // Enter condition
    while (!dowNumArray.includes(firstDayInt as number)) {
        const numToTest = (firstDayInt as number + attempt) % 7;
        if (dowNumArray.includes(numToTest)) {
            startDatetime = setDay(startDatetime, numToTest, { weekStartsOn: firstDayInt });
            endDatetime = setDay(endDatetime, numToTest, { weekStartsOn: firstDayInt });
            break;
        }
        if (attempt > 7) {
            throw new Error('Couldn\'t create a nice date for google');
            break;
        }
        attempt++;
    }
    return { endDatetime, startDatetime, until };
}

function convertWeekdays(dowMini: string) {
    // convert MWF or TR or whatever to an array of google accepted vals
    const days: string[] = [];
    const googleDays: any = {
        F: 'FR',
        M: 'MO',
        R: 'TH',
        T: 'TU',
        W: 'WE',
    };
    for (let i = 0; i < dowMini.length; i++) {
        days.push(googleDays[dowMini.charAt(i)]);
    }
    // convert array to comma separated string
    let newDow = '';
    for (let i = 0; i < days.length; i++) {
        if (i === days.length - 1) {
            newDow = newDow + days[i];
        } else {
            newDow = newDow + days[i] + ',';
        }
    }
    return newDow;
}

export default async function getClassData(username: string, password: string) {
    try {
        const agent = superagent.agent();
        const loginHtml = await getLoginFormHtml(agent);
        const executionString = await getExecutionString(loginHtml.text);
        const detailScheduleHtml = await getDetailScheduleHtml(username, password, executionString, agent);
        const classes = parseDetailSchedule(detailScheduleHtml.text);
        return classes;
    } catch (error) {
        throw new Error(error.message);
    }
}
