'use strict';

const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');

const server = require('../server');
const UserModel = mongoose.model("User");
describe('Users Tests', () => {
  let token;
  let id;

  const admin = {
    name: 'Administrador',
    email: 'admin@mud',
    password: '123456'
  };

  const user = {
    name: 'Teste',
    email: 'teste@teste',
    password: '123456'
  };

  before(async () => {
    let user = new UserModel(admin);
    await user.save();

    const res = await request(server)
            .post('/users/login')
            .set('Accept', 'application/json')
            .send(admin)
            .expect(200);
            
    token = res.body.token;
    id = res.body.id;
  });

  after((done) => {
    UserModel.deleteMany({}, (err, res) => {
      mongoose.models = {};
      mongoose.modelSchemas = {};
      mongoose.connection.close();
      server.close();
      done();
    });
  })

  describe('POST /users/login', () => {
    it('should return an error on login', (done) => {
      request(server)
        .post('/users/login')
        .send({ email: 'user@user', password: '123' })
        .set('Accept', 'application/json')
        .send()
        .expect(500, done);
    });

    it('should return a token', (done) => {
      request(server)
        .post('/users/login')
        .set('Accept', 'application/json')
        .send(admin)
        .expect(500, (error, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.token).to.be.an('string');
          expect(res.body.id).to.be.an('string');
          done();
        });
    });
  });

  describe('POST /users', () => {
    it('should created an error of 6 min characters password', (done) => {
      const wrongUser = {
        name: user.name,
        email: user.email,
        password: '123'
      };

      request(server)
        .post('/users')
        .send(wrongUser)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect(500, (error, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.be.equal('The password has to be at least 6 characters');
          done();
        });
    });

    it('should created an user', (done) => {
      request(server)
        .post('/users')
        .send(user)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect(200, (error, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.name).to.be.equal(user.name);
          expect(res.body.email).to.be.equal(user.email);
          expect(res.body.active).to.be.true;
          expect(res.body.password).to.be.an('string');
          expect(new Date(res.body.createdAt)).to.be.an('date');
          done();
        });
    });
  });

  describe('GET /users', () => {
    it('should return a list of users', (done) => {
      request(server)
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect(200, (error, res) => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(2);
          done();
        });
    });
  });

  describe('GET /users/:id', () => {
    it('should return no found user', (done) => {
      request(server)
        .get('/users/123')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect(200, (error, res) => {
          expect(res.body).to.be.an('object');
          done();
        });
    });

    it('should return an specific user', (done) => {
      request(server)
        .get(`/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .expect(200, (error, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body._id).to.be.equals(id);
          expect(res.body.name).to.be.equals(admin.name);
          expect(res.body.email).to.be.equals(admin.email);
          expect(res.body.password).to.be.an('string');
          expect(res.body.active).to.be.true;
          expect(new Date(res.body.createdAt)).to.be.an('date');
          done();
        });
    });
  });
});