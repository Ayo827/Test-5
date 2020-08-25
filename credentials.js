module.exports.credential = {
    cookieSecret: 'Your cookie secret goes in here',
    gmail: {
        user: 'dopeman827gmail.com',
        password: 'Oluwatosin2000' 
    },
    // meadowlarkSmtp: {
    //     user: 'your meadowlarkSmtp username',
    //     password:  'your password'
    // }
    mongo: {
        development: {
        connectionString: 'your_dev_connection_string' 
        },
        production: {
        connectionString: 'your_production_connection_string' 
        }
       }
}
//module.exports = credential;
