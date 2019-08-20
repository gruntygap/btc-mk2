const superagent = require('superagent');
const parser = require('fast-html-parser');

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
            console.log(resp.text);
            html = resp.text;
            parsable = parser.parse(html);
            // const names = parsable.querySelectorAll('.captiontext').map((yote) => yote.text).filter((yote) => yote !== 'Scheduled Meeting Times');
            // console.log({names});
            debugger;
        }).catch((error) => console.error(error));
    })
    .catch((err) => console.error(err));
// yeet()
//     .then(() => console.log('finished'))
//     .catch(err => console.error(err));
    //.post('https://auth-prod.bethel.edu/cas/login?service=https%3A%2F%2Fbanner.bethel.edu%2Fssomanager%2Fc%2FSSB')
	// .send({ serviceId: 'https://banner.bethel.edu/ssomanager/c/SSB' })
