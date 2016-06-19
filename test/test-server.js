var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

describe('chatroom', function() {
    before(function(done) {
        seed.run(function() {
            done();
        });
    });

    it('should show login page on connection');
    it('should show base page on login');
    it('should broadcast entrance on login');
    it('should broadcast message and username');
    it('should broadcast typing on isTyping');
    it('should delete typing notification on stopTyping');
    it('should broadcast exit on disconnect');
});
