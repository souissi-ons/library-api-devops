const request = require('supertest');
const app = require('./server');

describe('Library API Endpoints', () => {

    it('GET /health should return status UP', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'UP');
    });

    it('GET /books should return a list of books', async () => {
        const res = await request(app).get('/books');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('POST /books should create a new book', async () => {
        const newBook = { title: 'The Phoenix Project', author: 'Gene Kim' };
        const res = await request(app).post('/books').send(newBook);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('title', 'The Phoenix Project');
    });

    it('GET /books/:id should return specific book', async () => {
        const res = await request(app).get('/books/1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', 1);
    });

    it('GET /books/:id should return 404 for non-existent book', async () => {
        const res = await request(app).get('/books/999');
        expect(res.statusCode).toEqual(404);
    });

});