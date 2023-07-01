const checkAuth = (req, res, next) => {
    console.log(req.session, req.session.userId, req.sessionID);
    if(!(req.session)) {
        return res.status(401).json({error: 'Unauthorized access.'});
    }
    // If user is authenticated, go to the next middleware or route handler
    next();
}

module.exports = checkAuth;