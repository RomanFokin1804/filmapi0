/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');

const { keys } = require('../config/config');
const User = require('../models/user');
const AccessTokenDB = require('../models/accessToken');
const RefreshTokenDB = require('../models/refreshToken');
const server = require('../app');

const should = chai.should();
const { expect } = chai;

chai.use(chaiHttp);
const newEmail = 'test@test.com';

describe('Task api/favourites', () => {
  before((done) => {
    /* mongoose.connect(keys.mongoURI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .then(() => console.log('MongoDB connected'))
      .then(() => done())
      .catch((error) => console.log(error)); */
    done();
  });

  let accessToken = '';
  let refreshToken = '';

  describe('1) Adding a new user, access token and refresh token to the database', () => {
    before((done) => {
      const user = {
        email: newEmail,
        name: 'test test',
        avatar: 'https://lh3.googleusercontent.com/-RQYLJS_rA5o/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucnrCyB5MolkUnQ7wUvVXFukGIqlMw/s96-c/photo.jpg',
      };
      const newUser = new User(user);
      newUser.save()
        .then(() => {
        });
      const time = new Date();
      accessToken = jwt.sign({
        email: user.email,
        time: `${time.getDate()}.${time.getMonth() + 1}.${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`,
      },
      keys.jwt,
      { expiresIn: 24 * 60 * 60 });
      refreshToken = jwt.sign({
        email: user.email,
        time: `${time.getDate()}.${time.getMonth() + 1}.${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`,
      },
      keys.jwtRefresh,
      { expiresIn: 7 * 24 * 60 * 60 });
      const newAccessToken = new AccessTokenDB({ userId: newUser._id, token: accessToken });
      newAccessToken.save()
        .then(() => {
        });
      const newRefreshToken = new RefreshTokenDB({ userId: newUser._id, token: refreshToken });
      newRefreshToken.save()
        .then(() => {
        });
      done();
    });

    let addedAccessTokenUserId = '';
    let addedRefreshTokenUserId = '';
    let addedUserUserId = '';

    it('1.1) Check whether the access token is added to the database', (done) => {
      AccessTokenDB.findOne({ token: accessToken })
        .then((addedAccessToken) => {
          expect(addedAccessToken.token).to.equal(accessToken);
          addedAccessTokenUserId = addedAccessToken.userId;
          done();
        });
    });

    it('1.2) Check whether the refresh token is added to the database', (done) => {
      RefreshTokenDB.findOne({ token: refreshToken })
        .then((addedRefreshToken) => {
          expect(addedRefreshToken.token).to.equal(refreshToken);
          addedRefreshTokenUserId = addedRefreshToken.userId;
          done();
        });
    });

    it('1.3) Check whether the user is added to the database', (done) => {
      User.findOne({ email: newEmail })
        .then((addedUser) => {
          expect(addedUser.email).to.equal(newEmail);
          addedUserUserId = addedUser._id;
          done();
        });
    });

    it('1.4) Checking if the user _id and the access token userId match', (done) => {
      expect(String(addedUserUserId)).to.equal(addedAccessTokenUserId);
      done();
    });

    it('1.5) Checking if the user _id and the refresh token userId match', (done) => {
      expect(String(addedUserUserId)).to.equal(addedRefreshTokenUserId);
      done();
    });
  });

  describe('2) Test GET route /api/favourites (the favorites list must be empty )', () => {
    it('2.1) It should return empty list favourites', (done) => {
      chai.request(server)
        .get('/api/favourites')
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.count).to.equal(0);
          expect(res.body.next).to.equal(null);
          expect(res.body.previous).to.equal(null);
          expect(res.body.results.length).to.equal(0);
          done();
        });
    });
  });

  describe('3) Test POST route /api/favourites', () => {
    it('3.1) Empty request, it should return status(400) and message: that field title is empty', (done) => {
      chai.request(server)
        .post('/api/favourites')
        .type('form')
        .send({})
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.message).to.equal('title is required');
          done();
        });
    });

    it('3.2) Request without field plot, it should return status(400) and message: that field plot is empty', (done) => {
      chai.request(server)
        .post('/api/favourites')
        .type('form')
        .send({
          title: "Schindler's List",
          genre: 'Biography, Drama, History',
          released: '1994-02-04T00:00:00.000Z',
          runtime: '195 min',
          imdbRating: '8.9',
          poster: 'https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
          country: 'USA',
          imdbID: 'tt0108051',
          year: '1993',
        })
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.message).to.equal('plot is required');
          done();
        });
    });

    it('3.3) Request with all fields, it should return status(200) and status: true', (done) => {
      chai.request(server)
        .post('/api/favourites')
        .type('form')
        .send({
          title: 'Schindlers List',
          genre: 'Biography, Drama, History',
          released: '1994-02-04T00:00:00.000Z',
          runtime: '195 min',
          imdbRating: '8.9',
          plot: 'Oskar Schindler is a vainglorious and greedy German businessman who becomes an unlikely humanitarian amid the barbaric German Nazi reign when he feels compelled to turn his factory into a refuge for Jews. Based on the true story of Oskar Schindler who managed to save about 1100 Jews from being gassed at the Auschwitz concentration camp, it is a testament to the good in all of us.',
          poster: 'https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
          country: 'USA',
          imdbID: 'tt0108051',
          year: '1993',
        })
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          console.log(res.body);
          res.should.have.status(200);
          expect(res.body.status).to.equal(true);
          done();
        });
    });

    it('3.4) Adding four items to favourites list', (done) => {
      for (let i = 2; i < 6; i++) {
        chai.request(server)
          .post('/api/favourites')
          .type('form')
          .send({
            title: 'Schindlers List',
            genre: 'Biography, Drama, History',
            released: '1994-02-04T00:00:00.000Z',
            runtime: '195 min',
            imdbRating: '8.9',
            plot: 'Oskar Schindler is a vainglorious and greedy German businessman who becomes an unlikely humanitarian amid the barbaric German Nazi reign when he feels compelled to turn his factory into a refuge for Jews. Based on the true story of Oskar Schindler who managed to save about 1100 Jews from being gassed at the Auschwitz concentration camp, it is a testament to the good in all of us.',
            poster: 'https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
            country: 'USA',
            imdbID: `tt010805${i}`,
            year: '1993',
          })
          .set({ Authorization: `Bearer ${accessToken}` })
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body.status).to.equal(true);
          });
      }
      done();
    });

    it('3.5) Repeat p.3.3, it should return status(409) and message: This film has alredy in cathegory favourites', (done) => {
      chai.request(server)
        .post('/api/favourites')
        .type('form')
        .send({
          title: 'Schindlers List',
          genre: 'Biography, Drama, History',
          released: '1994-02-04T00:00:00.000Z',
          runtime: '195 min',
          imdbRating: '8.9',
          plot: 'Oskar Schindler is a vainglorious and greedy German businessman who becomes an unlikely humanitarian amid the barbaric German Nazi reign when he feels compelled to turn his factory into a refuge for Jews. Based on the true story of Oskar Schindler who managed to save about 1100 Jews from being gassed at the Auschwitz concentration camp, it is a testament to the good in all of us.',
          poster: 'https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
          country: 'USA',
          imdbID: 'tt0108051',
          year: '1993',
        })
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(409);
          expect(res.body.message).to.equal('This film has alredy in cathegory favourites');
          done();
        });
    });
  });

  describe('4) Test GET route /api/favourites', () => {
    it('4.1) Request without parameters, it should return full list of favourites with five items', (done) => {
      chai.request(server)
        .get('/api/favourites')
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.count).to.equal(5);
          expect(res.body.next).to.equal(null);
          expect(res.body.previous).to.equal(null);
          expect(res.body.results.length).to.equal(5);
          done();
        });
    });

    it('4.2) Request with wrong page number (?page=0&limit=1), it should return status(400) and message: The selected page is out of range (less than 1). Select a page from 1 to 5', (done) => {
      chai.request(server)
        .get('/api/favourites/?page=0&limit=1')
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.message).to.equal('page must be greater than or equal to 1');
          done();
        });
    });

    it('4.3) Request with wrong page number (?page=4&limit=2), it should return status(400) and message: The selected page is out of range (more than 3). Select a page from 1 to 3', (done) => {
      chai.request(server)
        .get('/api/favourites/?page=4&limit=2')
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.message).to.equal('page must be less than or equal to 3');
          done();
        });
    });

    it('4.4) Request with wrong limit (?page=1&limit=0), it should return status(400) and message: The selected limit is less than 1', (done) => {
      chai.request(server)
        .get('/api/favourites/?page=1&limit=0')
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.message).to.equal('limit must be greater than or equal to 1');
          done();
        });
    });

    it('4.5) Request with parameters of first page with two items(?page=1&limit=2), it should return status(200), count: 5, link on next page, null on previous page, and items 1 and 2', (done) => {
      chai.request(server)
        .get('/api/favourites/?page=1&limit=2')
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.count).to.equal(5);
          expect(res.body.next).to.equal('https://filmapi0.herokuapp.com/api/favourites/?page=2&limit=2');
          expect(res.body.previous).to.equal(null);
          expect(res.body.results.length).to.equal(2);
          done();
        });
    });

    it('4.6) Request with parameters of second page with two items(?page=2&limit=2), it should return status(200), count: 5, link on next page, link on previous page, and items 3 and 4', (done) => {
      chai.request(server)
        .get('/api/favourites/?page=2&limit=2')
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.count).to.equal(5);
          expect(res.body.next).to.equal('https://filmapi0.herokuapp.com/api/favourites/?page=3&limit=2');
          expect(res.body.previous).to.equal('https://filmapi0.herokuapp.com/api/favourites/?page=1&limit=2');
          expect(res.body.results.length).to.equal(2);
          done();
        });
    });

    it('4.7) Request with parameters of third page with one item(?page=3&limit=2), it should return status(200), count: 5, null on next page, link on previous page, and item 5', (done) => {
      chai.request(server)
        .get('/api/favourites/?page=3&limit=2')
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.count).to.equal(5);
          expect(res.body.next).to.equal(null);
          expect(res.body.previous).to.equal('https://filmapi0.herokuapp.com/api/favourites/?page=2&limit=2');
          expect(res.body.results.length).to.equal(1);
          done();
        });
    });
  });

  describe('5) Test GET route /api/favourites/is-movie-favourite', () => {
    it('5.1) Request with parameter imdbID of an existing film, it should return status(200) and status: true', (done) => {
      chai.request(server)
        .get('/api/favourites/is-movie-favourite/?imdbID=tt0108051')
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.status).to.equal(true);
          done();
        });
    });

    it('5.2) Request with parameter imdbID of a non-existing film, it should return status(200) and status: false', (done) => {
      chai.request(server)
        .get('/api/favourites/is-movie-favourite/?imdbID=tt0108050')
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.status).to.equal(false);
          done();
        });
    });

    it('5.3) Request without parameter, it should return status(400), status: false and message: imdbID not specified', (done) => {
      chai.request(server)
        .get('/api/favourites/is-movie-favourite')
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.status).to.equal(false);
          expect(res.body.message).to.equal('imdbID is required');
          done();
        });
    });
  });

  describe('6) Test DELETE route /api/favourites', () => {
    it('6.1) Request with parameter imdbID of an existing film, it should return status(200) and status: true', (done) => {
      chai.request(server)
        .delete('/api/favourites/?imdbID=tt0108051')
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.status).to.equal(true);
          done();
        });
    });

    it('6.2) GET request to /api/favourites/is-movie-favourite to check p.6.1', (done) => {
      chai.request(server)
        .get('/api/favourites/is-movie-favourite/?imdbID=tt0108051')
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.status).to.equal(false);
          done();
        });
    });

    it('6.3) Request with parameter imdbID of a non-existing film, it should return status(200) and status: false', (done) => {
      chai.request(server)
        .delete('/api/favourites/?imdbID=tt0108050')
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.status).to.equal(false);
          done();
        });
    });

    it('6.4) Request without parameter, it should return status(400), status: false and message: imdbID not specified', (done) => {
      chai.request(server)
        .delete('/api/favourites')
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.status).to.equal(false);
          expect(res.body.message).to.equal('imdbID is required');
          done();
        });
    });

    it('6.5.1) Delete second item from favourites list (equal 6.1)', (done) => {
      chai.request(server)
        .delete('/api/favourites/?imdbID=tt0108052')
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.status).to.equal(true);
          done();
        });
    });

    it('6.5.2) Delete third item from favourites list (equal 6.1)', (done) => {
      chai.request(server)
        .delete('/api/favourites/?imdbID=tt0108053')
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.status).to.equal(true);
          done();
        });
    });

    it('6.5.3) Delete fourth item from favourites list (equal 6.1)', (done) => {
      chai.request(server)
        .delete('/api/favourites/?imdbID=tt0108054')
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.status).to.equal(true);
          done();
        });
    });

    it('6.5.4) Delete fifth item from favourites list (equal 6.1)', (done) => {
      chai.request(server)
        .delete('/api/favourites/?imdbID=tt0108055')
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.status).to.equal(true);
          done();
        });
    });

    it('6.6) Repeat p.2 (GET request /api/favourites), check deleting result, it should return empty favourites list', (done) => {
      chai.request(server)
        .get('/api/favourites')
        .set({ Authorization: `Bearer ${accessToken}` })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.count).to.equal(0);
          expect(res.body.next).to.equal(null);
          expect(res.body.previous).to.equal(null);
          expect(res.body.results.length).to.equal(0);
          done();
        });
    });
  });

  describe('7) Delete new user, access token and request token from database', () => {
    before((done) => {
      AccessTokenDB.deleteOne({ token: accessToken }, () => {
      });
      RefreshTokenDB.deleteOne({ token: refreshToken }, () => {
      });
      User.deleteOne({ email: newEmail }, () => {
      });
      done();
    });

    it('7.1) Check deleting access token from database', (done) => {
      AccessTokenDB.findOne({ token: accessToken })
        .then((addedAccessToken) => {
          expect(addedAccessToken).to.equal(null);
          done();
        });
    });

    it('7.2) Check deleting refresh token from database', (done) => {
      RefreshTokenDB.findOne({ token: refreshToken })
        .then((addedRefreshToken) => {
          expect(addedRefreshToken).to.equal(null);
          done();
        });
    });

    it('7.3) Check deleting user from database', (done) => {
      User.findOne({ email: newEmail })
        .then((addedUser) => {
          expect(addedUser).to.equal(null);
          done();
        });
    });
  });
});
