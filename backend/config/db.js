// import mysql from 'mysql2/promise';

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: 'Hatdug1969',
//     database: 'social_media',
//     // charset: 'utf8mb4',
//     // decimalNumbers: true,
// });

// pool.getConnection()
//     .then(async (conn) => {
//         try {
//             const res = conn.query('SELECT 1');
//             console.log("Connected to MySQL DB");
//             conn.release();
//             return res;
//         } catch (err) {
//             conn.release();
//             throw err;
//         }
//     })
//     .catch(err => {
//         console.error("Database connection failed:", err);
//     });

// export default pool;