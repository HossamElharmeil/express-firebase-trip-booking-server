module.exports = (req, res, next) => {
    console.log(req.body);
    req.uid = req.body.uid
    return next()
}