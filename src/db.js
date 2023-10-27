require('dotenv').config();
const mysql = require('mysql2/promise');

const discordDbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const DiscordPool = mysql.createPool(discordDbConfig);
const pqDBConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'pquarm'
};

const pqPool = mysql.createPool(pqDBConfig);

async function SQLQuery(sql, values, dbPool) {
    const connection = await dbPool.getConnection();
    try {
        const [results, fields] = await connection.query(sql, values);
        return results;
    } catch (error) {
        console.error('Query Execution Error:', error);
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    dbQuery: function (sql, values, dbPool) {
        if (dbPool === "Discord") {
            return SQLQuery(sql, values, DiscordPool);
        }
        if (dbPool === "PQ") {
            return SQLQuery(sql, values, pqPool);
        }
    }
}