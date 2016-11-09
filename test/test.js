var name = require('../src/main.js');
var chai = require('chai');

var expect = chai.expect;

describe('vue', function () {
    it('should hava an name "vue"', function () {
        expect(name).to.be.equal('vue');
    })
})