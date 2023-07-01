// Prevent access to POST and DELETE methods to users that are not authenticated
const protect = (req, res, next) => {
    if(["POST", "PUT", "DELETE"].indexOf(req.method) == -1) { next(); }
    else {
        if(req.session.username) {
            next();
        } else {
            res.status(404).json({error: "User not logged in."});
        }
    }
}