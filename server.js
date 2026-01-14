const express = require('express');

const app = express();
app.use(express.json());

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
    res.json(books);
});

// GET book by ID
app.get('/books/:id', (req, res) => {
    const book = books.find((b) => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
});

// POST new book
app.post('/books', (req, res) => {
    const book = { id: books.length + 1, ...req.body };
    books.push(book);
    res.status(201).json(book);
});

// Start server
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Library API running on port ${PORT}`);
    });
}

module.exports = app;