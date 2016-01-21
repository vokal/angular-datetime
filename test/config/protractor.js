var config = {
    capabilities: {
        browserName: "chrome"
    },
    params: {},
    directConnect: true,
    baseUrl: "http://localhost:3000",
    rootElement: "html",
    specs: [
        "test/*.js"
    ],
    jasmineNodeOpts: {
        isVerbose: true,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 60000
    },
    plugins: [ {
        chromeA11YDevTools: {
            treatWarningsAsFailures: true
        },
        package: "protractor-axs"
    } ],
    onPrepare: function ()
    {
        browser.driver.manage().window().setSize( 1280, 1024 );
    }
};

if( process.env.TRAVIS )
{
    config.capabilities.browserName = "phantomjs";
    config.directConnect = false;
}

exports.config = config;
