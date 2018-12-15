const expect = require('expect');
const request = require('supertest');
const {User} = require('../models/user');

const {app} = require('./../../server');

beforeEach((done)=>{
   User.findOneAndRemove({email:'testuser@testuser.com'}).then(()=>{
     done();
   });
})


describe('POST /register', () =>{
    it('should create a new user', (done)=>{
        request(app)
        .post('/register')
        .send({email:'testuser@testuser.com',password:'1234567'})
        .expect(200)
        .end(done)
    });
});