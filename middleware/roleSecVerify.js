
module.exports = function bigBoyTable(req, res, next) {
    // checks if user is a secretariat (or above) ... staff only have power to manage committees

    if (!(req.tokenData.type === 'secretariat' || req.tokenData.type === 'legend')) return res.status(401).send('Insufficient power. Hit the gym more often. (Insufficient permissions)');

    next();
}