const express = require('express');
const fileup = require('express-fileupload');
const db = require('../../config/database.js');


// Get all TODO items
exports.getAll = (req, res) => {
    const userId = req.session.userId;
    // When requesting for the whole database, use the .all() method
    db.all(`SELECT * FROM todos where user_id = ?`, [userId], (err, rows) => {
        if(err) {
            console.error(err.message);
            res.status(500).send({error: 'Failed to fetch tasks.'});
        } else {
            res.send(rows);
        }
    });
};

// Add a new TODO item
exports.addTask = (req, res) => {
    const {task} = req.body;
    const userId = req.session.userId;
    console.log(req.session.user, req.session.userId);

    // Prepare query
    const stmt = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`);
    // Execute query on the PREPARE object, NOT the database itself
    stmt.run(userId, task, (err) => {
        if(err) {
            console.error(err.message);
            res.status(500).send({error: 'Failed to add task.'});
        } else {
            res.sendStatus(200);
        }
    });

    // Finalise query
    stmt.finalize();
};


// Update a TODO task item
exports.updateTask = (req, res) => {
    const {task} = req.body;
    const id = req.params.id;
    const userId = req.session.userId;

    const stmt = db.prepare(`UPDATE todos SET task = ? WHERE id = ? AND user_id = ?`);

    stmt.run(task, id, userId, (err) => {
        if(err) {
            console.error(err.message);
            res.status(500).send({error: 'Failed to update task information.'});
        } else {
            res.sendStatus(200);
        }
    });

    stmt.finalize();
};

// Set a TODO item as complete
exports.completeTask = (req, res) => {
    const {id} = req.params;
    const userId = req.session.userId;

    const stmt = db.prepare(`UPDATE todos SET completed = NOT completed WHERE id = ? AND user_id = ?`);

    stmt.run(id, userId, (err) => {
        if(err) {
            console.error(err.message);
            res.status(500).send({error: 'Failed to set task as completed.'});
        } else {
            res.sendStatus(200);
        }
    });

    stmt.finalize();
};

// DELETE a TODO item
exports.deleteTask = (req, res) => {
    const {id} = req.params;
    const userId = req.session.userId;

    const stmt = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`);

    stmt.run(id, userId, (err) => {
        if(err) {
            console.error(err.message);
            res.status(500).send({error: 'Failed to delete task.'});
        } else {
            res.sendStatus(200);
            db.run(`REINDEX todos`);
        }
    });
    stmt.finalize();
};

// Search tasks by keyword
exports.search = (req, res) => {
    const userId = req.session.userId;
    const {keyword} = req.params;
    const term = `%${keyword}%`; // Add wildcards to search for the keyword within the task
  
    db.all(`SELECT * FROM todos WHERE task LIKE ? AND user_id = ?`, [term, userId], (err, rows) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.send(rows);
      }
    });
};

// Upload file(s) for a task
exports.uploadFiles = (req, res) => {
    const {id} = req.params;
    const file = req.files ? req.files.files : null;
    const userId = req.session.userId;
  
    if (!file) {
      res.status(400).send('No file uploaded');
      return;
    }
  
    const filePath = `./files/${file.name}`;
  
    file.mv(filePath, (err) => {
      if (err) {
        res.status(500).send({ error: err.message });
        return;
      }
  
      const stmt = db.prepare(`UPDATE todos SET files = ? WHERE id = ? AND user_id = ?`);
      stmt.run(filePath, id, (queryErr) => {
        if (queryErr) {
            console.error(queryErr.message);
          res.status(500).send({ error: 'Failed to upload files to task.' });
        } else {
          res.sendStatus(200);
        }
        stmt.finalize();
      });
    });
};

// Set labels for a task
exports.setLabels = (req, res) => {
    const {id} = req.params;
    const userId = req.session.userId;
    const {labels} = req.body;
    const labelStr = labels.join(','); // array of labels to delimited string

    const stmt = db.prepare(`UPDATE todos SET labels = ? WHERE id = ? AND user_id = ?`);
    
    stmt.run(labelStr, id, userId, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({error: 'Failed to update task labels.'})
        } else {
            res.status(200).json({message: 'Task labels updated successfully.'})
        }
    })

    stmt.finalize();
};

// TODO:
// Priority will be shown in the fronted as HIGH=1, NORMAL=2, LOW=3
// Need to build a dictionary to have the cross-reference of values
exports.setPriority = (req, res) => {
    const {id} = req.params;
    const {priority} = req.body;
    const userId = req.session.userId;

    db.run(`UPDATE todos SET priority = ? WHERE id = ? AND user_id =?`, [priority, id, userId], (err) => {
        if(err){
            console.error(err.message);
            return res.status(500).json({error: 'Failed to update task priority.'});
        }
        res.json({message: 'Task priority updated successfully.'})
    });
};


exports.setDueDate = (req, res) => {
    const {id} = req.params;
    const {due_date} = req.body;
    const userId = req.session.userId;

    db.run(`UPDATE todos SET due_date = ? WHERE id = ? AND user_id = ?`, [due_date, id, userId], (err) => {
        if(err){
            console.error(err.message);
            return res.status(500).json({error: 'Failed to update task due_date.'});
        }
        res.json({message: 'Task due_date updated successfully.'})
    });
};