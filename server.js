const express = require('express');
const { logger, observeMiddleware, metricsEndpoint } = require('./plugins');

const app = express(); 
app.use(express.json());

app.use(observeMiddleware);

app.get('/metrics', metricsEndpoint);

app.get('/health', (req, res) => {
    res.json({ status: 'UP' });
});

app.get('/', (req, res) => {
    res.json({ message: 'Library API is running' });
});

const books = [
    { id: 1, title: 'The DevOps Handbook', author: 'Gene Kim' },
    { id: 2, title: 'Continuous Delivery', author: 'Jez Humble' },
];

app.get('/books', (req, res) => {
    logger.info('Fetching all books');
    res.json(books);
});

app.get('/books/:id', (req, res) => {
    const book = books.find((b) => b.id === parseInt(req.params.id));
    if (!book) {
        logger.warn(`Book with id ${req.params.id} not found`);
        return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
});

app.post('/books', (req, res) => {
    const book = { id: books.length + 1, ...req.body };
    books.push(book);
    logger.info(`New book added: ${book.title}`); 
    res.status(201).json(book);
});

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        logger.info(`Library API running on port ${PORT}`);
    });
}

module.exports = app;