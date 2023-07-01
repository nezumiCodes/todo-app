const sqlite3 = require('sqlite3').verbose();

// Connect to database
const db = new sqlite3.Database('./todo.db');

// Create TODO table
// Use the serialize to ensure that the table is created before
// doing any other requests to the database
db.serialize(() => {
    db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY, 
                email VARCHAR(50), 
                username VARCHAR(20),
                password VARCHAR(255)
            )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            task TEXT, 
            priority INTEGER,
            due_date DATETIME,
            completed INTEGER DEFAULT 0, 
            files TEXT, 
            labels TEXT, 
            user_id INTEGER, 
            FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
 
});

// Export the database connection object
module.exports = db;