const knex = require('knex');
const config = require('../src/config');

const app = require('../src/app');
const helpers = require('./test-helpers');


//all tests done using Bob Smith Dummy Account
describe('Rides Endpoints', () => {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testRides = helpers.makeRidesArray();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });

    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('/api/rides routes', () => {
    describe('POST /api/rides', () => {
      beforeEach('insert users and rides', async () => {
        await helpers.seedUsers(db);
        await helpers.seedRides(db);
      });
      it('should return the ride based on search params', () => {
        const testSearch = {
          starting: testRides[0].starting,
          destination: testRides[0].destination,
        };

        return supertest(app)
          .post('/api/rides')
          .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
          .send(testSearch)
          .expect(201, [testRides[0]]);
        // .expect(res => {
        //   expect(res.body).to.be.an('array');
        //   expect(res.body[0].id).to.eql(testRides[0].id);
        //   expect(res.body[0].driver_id).to.eql(testRides[0].driver_id);
        //   expect(res.body[0].starting).to.eql(testRides[0].starting);
        //   expect(res.body[0].destination).to.eql(testRides[0].destination);
        //   expect(res.body[0].description).to.eql(testRides[0].description);
        //   expect(res.body[0].capacity).to.eql(testRides[0].capacity);
        //   expect(res.body[0].p1).to.eql(testRides[0].p1);
        //   expect(res.body[0].p2).to.eql(testRides[0].p2);
        //   expect(res.body[0].p3).to.eql(testRides[0].p3);
        //   expect(res.body[0].p4).to.eql(testRides[0].p4);
        //   expect(res.body[0].p5).to.eql(testRides[0].p5);
        //   expect(res.body[0].p6).to.eql(testRides[0].p6);
        //   expect(res.body[0].p7).to.eql(testRides[0].p7);

        // });
      });

    });
  });

  // describe('/api/rides/driver routes', () => {

  describe('GET /driver', () => {
    beforeEach('insert users and rides', async () => {
      await helpers.seedUsers(db);
      await helpers.seedRides(db);
    });
    it('should return the rides that a driver is driving', () => {

      return supertest(app)
        .get('/api/rides/driver')
        .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
        .expect(200);
    });
  });

  describe('POST /driver', () => {

    beforeEach('insert users and rides', async () => {
      await helpers.seedUsers(db);
      await helpers.seedRides(db);
    });

    it('should add a new ride that a driver is driving', () => {

      newRide = {
        starting: 'Blacksburg',
        destination: 'Virginia Beach',
        date: '2019-12-01',
        time: '08:00:00',
        description: '$10 for gas',
        capacity: 4,
      };

      return supertest(app)
        .post('/api/rides/driver')
        .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
        .send(newRide)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('driver_id');
          expect(res.body.starting).to.eql(newRide.starting);
          expect(res.body.destination).to.eql(newRide.destination);
          expect(res.body.time).to.eql(newRide.time);
          expect(res.body.description).to.eql(newRide.description);
          expect(res.body.capacity).to.eql(newRide.capacity);
        })
        .expect(res => {
          db
            .from('rides')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.id).to.eql(res.body.id);
            });
        });
    });

  });

  describe('DEL /driver', () => {
    beforeEach('insert users and rides', async () => {
      await helpers.seedUsers(db);
      await helpers.seedRides(db);
    });
    it('should delete the ride by id', () => {

      const idToDelete = {
        ride_id: '8c792a91-d346-4f93-bd77-1c04ddc7ccac'
      };

      return supertest(app)
        .delete('/api/rides/driver')
        .send(idToDelete)
        .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
        .expect(204);
    });
  });

  // });

  // describe('/api/rides/:ride_id routes', () => {
  describe('GET /:ride_id', () => {
    beforeEach('insert users and rides', async () => {
      await helpers.seedUsers(db);
      await helpers.seedRides(db);
    });
    it('should get ride by id', () => {

      let ride_id = '8c792a91-d346-4f93-bd77-1c04ddc7ccac';

      return supertest(app)
        .get(`/api/rides/${ride_id}`)
        .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
        .expect(200);
    });
  });
  // });

  // describe.only('/api/rides/passenger routes', () => {


  describe('GET /api/rides/passenger', () => {
    beforeEach('insert users and rides', async () => {
      await helpers.seedUsers(db);
      await helpers.seedRides(db);
    });

    it('should get rides by passenger id', () => {

      return supertest(app)
        .get('/api/rides/passenger')
        .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
        .expect(200);
    });
  });

  describe('POST /api/rides/passenger', () => {
    beforeEach('insert users and rides', async () => {
      await helpers.seedUsers(db);
      await helpers.seedRides(db);
    });
    it('should add a passenger to a ride', () => {

      let rideId = {
        ride_id: 'd72628e3-1ef8-4cd4-b1d0-0db190c6e3c7'
      };

      return supertest(app)
        .post('/api/rides/passenger')
        .send(rideId)
        .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
        .expect(201);
    });
  });

  describe('PATCH /api/rides/passenger', () => {
    beforeEach('insert users and rides', async () => {
      await helpers.seedUsers(db);
      await helpers.seedRides(db);
    });
    it('should remove passenger from ride if they are a part of it', () => {

      const rideId = {
        ride_id: '64ea927f-441d-40d4-974b-9c79c8c22d1d'
      };

      return supertest(app)
        .patch('/api/rides/passenger')
        .send(rideId)
        .set('Authorization', `bearer ${config.TEST_ID_TOKEN}`)
        .expect(200);
    });
  });
  // });

});