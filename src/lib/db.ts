import { Pool } from 'pg' 

const pool = new Pool({
    user: 'postgres',
    password: 'Beyonce123@',
    host: 'localhost',
    port: 5432,
    database: 'herde_ent'
  })
  
  export default pool