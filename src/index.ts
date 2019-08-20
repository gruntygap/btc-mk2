import parser from 'fast-html-parser';
import superagent from 'superagent';

const agent = superagent.agent();

async function getFormData() {
    const request = await agent
        .get('https://auth-prod.bethel.edu/cas/login?service=https%3A%2F%2Fbanner.bethel.edu%2Fssomanager%2Fc%2FSSB');
    return request;
}

async function yeet(user: string, pass: string, execution: string) {
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

getFormData()
    .then((res) => {
        let html = res.text;
        let parsable = parser.parse(html);
        const executionElement = parsable.querySelectorAll('input')
            .filter((thing: any) => thing.attributes.name === 'execution')[0];
        const executionParam = executionElement.attributes.value;
        const username = '';
        const password = '';
        yeet(username, password, executionParam).then((resp) => {
            // console.log(resp.text);
            html = resp.text;
            parsable = parser.parse(html);
            const names = parsable.querySelectorAll('.captiontext')
                .map((yote: any) => yote.text).filter((yote: any) => yote !== 'Scheduled Meeting Times');
            const metaData = parsable.querySelector('.pagebodydiv')
                .querySelectorAll('table')
                .filter((something: any) => something.attributes.SUMMARY === 'This layout table is used to present the schedule course detail');
            const meetingData = parsable.querySelector('.pagebodydiv')
                .querySelectorAll('table')
                .filter((something: any) => something.attributes.SUMMARY === 'This table lists the scheduled meeting times and assigned instructors for this class..');
            let classData = [];
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
                const dow = event[2].text;
                const classroom = event[3].text;
                const yearConstraints = event[4].text;

                const emptyStructure = {
                    campus,
                    classroom,
                    credits,
                    crn,
                    dow,
                    instructor,
                    level,
                    name: names[i],
                    status,
                    term,
                    time,
                    yearConstraints,
                };
                classData.push(emptyStructure);
            }
            console.log(classData);
        }).catch((error) => console.error(error));
    })
    .catch((err) => console.error(err));
