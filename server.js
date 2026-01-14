const express = require('express');
const { logger, observeMiddleware, metricsEndpoint } = require('./plugins');

const app = express(); 
app.use(express.json());

app.use(observeMiddleware);

app.get('/metrics', metricsEndpoint);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'UP' });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Library API is running' });
});

// In-memory books data
const books = [
    { id: 1, title: 'The DevOps Handbook', author: 'Gene Kim' },
    { id: 2, title: 'Continuous Delivery', author: 'Jez Humble' },
];

// GET all books
app.get('/books', (req, res) => {
    logger.info('Fetching all books'); // Remplacement de console.log
    res.json(books);
});

// GET book by ID
app.get('/books/:id', (req, res) => {
    const book = books.find((b) => b.id === parseInt(req.params.id));
    if (!book) {
        logger.warn(`Book with id ${req.params.id} not found`); // Log d'avertissement
        return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
});

// POST new book
app.post('/books', (req, res) => {
    const book = { id: books.length + 1, ...req.body };
    books.push(book);
    logger.info(`New book added: ${book.title}`); // Log d'info
    res.status(201).json(book);
});

// Start server
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        // Utilisation du logger pour le démarrage
        logger.info(`Library API running on port ${PORT}`);
    });
}

module.exports = app;