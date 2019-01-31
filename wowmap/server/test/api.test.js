const request = require('supertest');

const app = require('../src/app');

describe('GET /api/v1', () => {
	it('responds with a json message', function(done) {
		request(app).get('/api/v1').set('Accept', 'application/json').expect('Content-Type', /json/).expect(
			200,
			{
				message: 'hello'
			},
			done
		);
	});
});

describe('POST /api/v1/messages', () => {
	it('Responds with inserted message', function(done) {
		const requestObj = {
			name: 'Arnor',
			message: 'cool',
			latitude: -90,
			longitude: 180
		};

		const responseObj = {
			...requestObj,
			_id: '5bdb3825eef7394ee8123a85',
			date: '2018-11-01T17:30:13.383Z'
		};

		request(app)
			.post('/api/v1/messages')
			.send(requestObj)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect((res) => {
				res.body._id = '5bdb3825eef7394ee8123a85';
				res.body.date = '2018-11-01T17:30:13.383Z';
			})
			.expect(200, responseObj, done);
	});
});
