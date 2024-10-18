const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require("needle");
const {
    environmentalScripts
} = require("../../config/config");

function ResearchHandler(db) {
    "use strict";

    const researchDAO = new ResearchDAO(db);

(req, res) => {
    if (req.query.symbol && validUrl.isUri(req.query.url)) {
        const url = req.query.url + req.query.symbol;
        needle.get(url, (error, newResponse, body) => {
            if (!error && newResponse.statusCode === 200) {
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                let sanitizedBody = xss.inHTMLData(body); // sanitize body before output
                res.write("<h1>The following is the stock information you requested.</h1>\n\n");
                res.write("\n\n");
                if (sanitizedBody) {
                    res.write(sanitizedBody);
                }
            } else {
                res.writeHead(500);
                res.write('Error processing your request.');
            }
            return res.end();
        });
    } else {
        return res.render("research", {
            environmentalScripts
        });
    }
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


