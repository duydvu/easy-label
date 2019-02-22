module.exports = {
    // Specify which app to run if multiple apps are presented
    APP: 'app',
    // The port which localhost will run on when starting the server
    PORT: 3000,
    // The port used by Webpack Dev Server
    WEBPACK_PORT: 8080,
    // The API url, could be the host IP, domain name of the web server or a small service
    API_URL: '',
    // CSS vendor prefix configuration,
    // specify the range of browsers and their versions to be supported
    CSS_PREFIX: [
        'last 3 versions',
        'Firefox >= 20',
        'iOS >= 7',
    ],
};
