const AllocationsDAO = require("../data/allocations-dao").AllocationsDAO;
const {
    environmentalScripts
} = require("../../config/config");

function AllocationsHandler(db) {
    "use strict";

    const allocationsDAO = new AllocationsDAO(db);

(req, res, next) => {
    // Fix for A4 Insecure DOR -  take user id from session instead of from URL param
    const { userId } = req.session;
    
    const {
        threshold
    } = req.query;

    allocationsDAO.getByUserIdAndThreshold(userId, threshold, (err, allocations) => {
        if (err) return next(err);
        
        // Sanitize allocations to prevent XSS
        const sanitizedAllocations = sanitizeHtml(allocations);
        
        return res.render("allocations", {
            userId,
            allocations: sanitizedAllocations,
            environmentalScripts
        });
    });
}

}

module.exports = AllocationsHandler;


