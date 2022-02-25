const { PrismaClient } = require('@prisma/client')
const db_module = require('./db_util.js')
// const path = require('path')
// require('dotenv').config(({ path: path.resolve(__dirname, './.env')}))

module.exports.testhandler = async (event) => {

    const db_url = await formulateDBURL()
    // Starts the timer
    console.time();
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: db_url
        }
      }
    });
    // Ends the timer and print the time
    console.timeEnd();
    console.log('connection established')
    // Starts the timer
    console.time();
    const result = await prisma.$queryRaw`SELECT * FROM entity`
    // Ends the timer and print the time
    console.timeEnd();
    console.log('fetch entity');
    console.log('query result', result)
    // disconnect
    await prisma.$disconnect()
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Go Serverless v2.0! Your function executed successfully!',
          input: event,
        },
        null,
        2
      ),
    };
  }
  // get rds hostname and secrets from secrets manager
  async function formulateDBURL() {
    const rds = await db_module.getRDSHost()
    const secret =  await db_module.getSecretValue()
    return `postgresql://${secret.username}:${secret.password}@${rds.rds_host}:${rds.port}/${rds.db_name}`

  }