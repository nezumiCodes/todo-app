const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../../config/database.js');

exports.register = (req, res) => {
    const {email, username, password} = req.body;
    const saltRounds = 10;

    db.get(`SELECT id FROM users WHERE email = ?`, email, (err, emailExists) => {
        if(err) {return res.status(500).json({error: 'Error checking email address.'})}

        if(emailExists) {return res.status(409).json({error: 'Email already registered.'});}

        db.get(`SELECT id FROM users WHERE username = ?`, username, (err, userExists) => {
            if(err) {return res.status(500).json({error: 'Error checking username.'})}

            if(userExists) {return res.status(409).json({error: 'Username is taken.'});}

            const hashPass = bcrypt.hashSync(password, saltRounds);

            db.run(`INSERT INTO users (email, username, password) VALUES (?,?,?)`,
                    [email, username, hashPass], 
                    (err) => {
                        if(err) {
                            console.error(err.message);
                            return res.status(500).json({error: 'Failed to register user.'});
                        }
                        res.status(200).json({message: 'Successfully registered user.'});
                    });
            });
        });
};

exports.login = (req, res) => {
    const {login, password} = req.body;

    db.get(`SELECT * FROM users WHERE email = ? OR username = ?`, [login, login], 
    (err, user) => {
        if(err) {
            console.error(err.message);
            return res.status(500).json({error: 'Authentication failed. Wrong email or username.'});
        }

        if(!user) {
            return res.status(401).json({error: 'Invalid login or password.'}); // Unauthorized
        }

        const passMatch = bcrypt.compareSync(password, user.password);
        if(!passMatch) {
            res.status(401).json({error: 'Invalid password.'}); // Unauthorized
        }

        req.session.user = user;
        req.session.userId = user.id;
        console.log(user, res.sessionID);
        res.json({message: 'User authenticated successfully.'})
    });
};

exports.logout = (req, res) => {
    req.session.destroy();

    res.redirect('/login');
};

