const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.fddfdtcqpohoylqjqlpi:Saudi%23Taxi2026@aws-1-us-east-1.pooler.supabase.com:6543/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => {
    console.log('Connected successfully with pg!');
    return client.end();
  })
  .catch(err => {
    console.error('Connection error with pg:', err);
  });
