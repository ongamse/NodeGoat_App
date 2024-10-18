const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require("needle");
const {
    environmentalScripts
} = require("../../config/config");

function ResearchHandler(db) {
    "use strict";

    const researchDAO = new ResearchDAO(db);

(req, res) => {
    // QWIETAI-AUTOFIX
    if (req.query.symbol && validUrl.isUri(req.query.symbol)) {
        const url = req.query.url + req.query.symbol;
        return needle.get(url, (error, newResponse, body) => {
            if (!error && newResponse.statusCode === 200) {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                // Mask sensitive data
                let sanitizedBody = maskSensitiveData(body);
                res.write("<h1>The following is the stock information you requested.</h1>\n\n");
                res.write("\n\n");
                if (sanitizedBody) {
                    res.write(sanitizedBody);
                }
            } else {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });
                res.write("An error occurred while fetching the stock information.");
            }
            return res.end();
        });
    } else {
        res.writeHead(400, {
            "Content-Type": "text/plain"
        });
        res.write("Invalid symbol provided.");
        return res.end();
    }
}

    };

}

module.exports = ResearchHandler;

