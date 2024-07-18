import * as http from 'http';
const options = {
    host: '0.0.0.0',
    port: process.env.CORE_SERVICE_PORT || 3333,
    path: '/healthcheck',
    timeout: 1000
};

const healthCheck = http.request(options, (res) => {
    console.log(`HEALTHCHECK STATUS CODE: ${res.statusCode}`);
    if (res.statusCode == 200) {
        process.exit(0);
    }
    else {
        process.exit(1);
    }
});

healthCheck.on('error', function (err) {
    console.error('HEALTHCHECK ERROR');
    process.exit(1);
});

healthCheck.end();