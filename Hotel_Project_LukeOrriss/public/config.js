var config = {
	development: {
			  user: 'xyv20hmu', // env var: PGUSER
			  database: 'xyv20hmu', // env var: PGDATABASE
			  password: 'F41r4cr3/P1pps', // env var: PGPASSWORD
			  host: 'cmpstudb-01.cmp.uea.ac.uk', // Server hosting the postgres database
			  port: 5432, // env var: PGPORT
			  max: 10, // max number of clients in the pool
			  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
	},
	production: {
			  user: 'cew19wcu', // env var: PGUSER  - YOUR UEA username
			  database: 'cew19wcu', // env var: PGDATABASE  - YOUR UEA username
			  password: '', // env var: PGPASSWORD  - YOUR UEA password
			  host: 'cmpstudb-01.cmp.uea.ac.uk', // Server hosting the postgres database
			  port: 5432, // env var: PGPORT
			  max: 10, // max number of clients in the pool
			  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
	},
	
};
module.exports = config;