var express = require('express');
var fs = require('fs');
var https = require('https');
var request = require('request');
var router = express.Router();
// var Client = require('ftp');
const Client = require('ssh2-sftp-client');


router.get('/', function (req, res, next) {

    let rawdata = fs.readFileSync('demo.json');


    // request.get('xxx', function (error, response, rawdata) {
    //     // console.log(response.statusCode);
    //     console.log(error);
    //     console.log(response.statusCode);
    //     if (!error && response.statusCode == 200) {
    //         console.log("if");
    //         fs.writeFile('mockdata.txt', rawdata, 'utf8', (err) => {
    //             console.log(err);

    //         })
    //     }
    // });

    let ts = Date.now();
    let filename = "report_" + ts + ".txt";

    fs.writeFile(filename, rawdata, function (err) {
        if (err) return console.log(err);
        console.log('Hello World > helloworld.txt');
    });

    // res.send('successly finished!');

    const config = {
        host: 'xxx',
        port: 22,
        username: 'xxx',
        password: 'xxx',
        algorithms: {
            kex: [
              "diffie-hellman-group1-sha1",
              "ecdh-sha2-nistp256",
              "ecdh-sha2-nistp384",
              "ecdh-sha2-nistp521",
              "diffie-hellman-group-exchange-sha256",
              "diffie-hellman-group14-sha1"
            ],
            cipher: [
              "3des-cbc",
              "aes128-ctr",
              "aes192-ctr",
              "aes256-ctr",
              "aes128-gcm",
              "aes128-gcm@openssh.com",
              "aes256-gcm",
              "aes256-gcm@openssh.com"
            ],
            serverHostKey: [
              "ssh-rsa",
              "ecdsa-sha2-nistp256",
              "ecdsa-sha2-nistp384",
              "ecdsa-sha2-nistp521"
            ],
            hmac: [
              "hmac-sha2-256",
              "hmac-sha2-512",
              "hmac-sha1"
            ]
        }
    };

    let client = new Client();
    


    let data = fs.createReadStream('helloworld.txt');
    let remote = '/' + filename;
    
    
    client.connect(config)
        .then(() => {
            return client.put(data, remote);
        })
        .then(() => {
            return client.end();
        })
        .catch(err => {
            console.error(err.message);
        });

        fs.unlink(filename, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });

        res.send('successly finished!');
});

module.exports = router;