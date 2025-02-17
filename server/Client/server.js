//Basic setup imports
require('dotenv').config();
const db = require("./models/database"),
    config = require("./Nodedetails/config"),
    index = require("./Routes/index"),
    port = config.port;
// Third party imports
const express = require("express"),
    path = require("path"),
    cookieParser = require("cookie-parser"),
    https = require("https"),
    useragent = require("express-useragent"),
    cors = require("cors"),
    pathToRegexp = require("path-to-regexp"),
    helmet = require("helmet"),
    fs = require("fs"),
    morgan = require("morgan");
app = express();

// Get host in log
morgan.token("host", function (req) {
    return req.hostname;
});
//Get IP in logs
morgan.token("ip", function (req) {
    return req.ip;
});

// Allow express JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Allow cookies
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.enable("trust proxy");
//Product from valnerabilities
app.use(helmet());
//Format of log
app.use(
    morgan(
        ":ip -> :host - :method :url :status :res[content-length] - :response-time ms"
    )
);
// Allow User Agent
app.use(useragent.express());

//HTTPS setup for find route exception
function exception_routes(path, fn) {
    var regexp = pathToRegexp(path)
    return function (req, res, next) {
        if (regexp.test(req.path)) return next()
        else return fn(req, res, next)
    }
}
//HTTPS SETUP
if (process.env.NODE_ENV == 'staging' || process.env.NODE_ENV == 'testing' || process.env.NODE_ENV == 'production') {
    var whitelist = process.env.clientDomain, whitelist2 = process.env.adminDomain;
    var corsOptions = {
        origin: function (origin, callback) {
            if (!origin) {
                callback(new Error('Not allowed by CORS - Tool'))
            }
            else if (origin.search("^.*" + whitelist + ".*$") > -1 || origin.search("^.*" + whitelist2 + ".*$") > -1) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS - ' + origin))
            }
        },
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'cache-control', 'authorization'],
        credentials: true
    }
    app.use(exception_routes(['/common'], cors(corsOptions)))
    if (process.env.NODE_ENV == 'production') {
        app.use("/common/api/v1", index);
    }
    else {
        app.use("/api", index);
    }
}
//Development Setup
else {
    app.use(cors());
    app.use("/api", index);
}
//Certificate validate for production or staging
if (process.env.TLS_ENABLE == "true") {
    var options = {
        port: port,
        tls: {
            key: fs.readFileSync('./keys/private.key', "utf-8"),
            cert: fs.readFileSync('./keys/certificate.crt', "utf-8"),
            ca: fs.readFileSync('./keys/ca_bundle.crt')
        },
    };

    var server = https.createServer(options.tls, app);
    server.listen(options.port, () => {
        console.log(`Damro project running on port ${options.port}`);
    });
    module.exports = server; // for testing purpose
}
//Development app listen
 else {
    app.listen(port, () => {
        console.log(`Demo project running on port ${port}`);
    });
    module.exports = app; // for testing purpose
}
//Base get for check service running
app.get('/', (req, res) => {
    return res.json({ status: 200, msg: "Welcome to demo" });
})
