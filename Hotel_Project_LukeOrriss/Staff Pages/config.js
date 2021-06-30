var config = {
    development: {
        user      : 'xyv20hmu',
        database  : 'xyv20hmu',
        password  : 'F41r4cr3/P1pps',
        host      : 'cmpstudb-01.cmp.uea.ac.uk',
        port      : 5432,
        max       : 10,

        idleTimoutMillis : 30000
    },
    production: {
        user      : 'postgres',
        database  : 'CMP-7003A Hotel Booking',
        password  : '',
        host      : 'localhost',
        port      : 5432,
        max       : 10,

        idleTimoutMillis : 30000
    },
};

module.exports = config;