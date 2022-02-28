const { PrismaClient } = require('@prisma/client')
const db_module = require('./db_util.js')

module.exports.dbPerf = async (event) => {

    const db_url = await db_module.formulateDBURL();
    // Starts the timer
    console.time('connection');
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: db_url
        }
      }
    });
    // Ends the timer and print the time
    console.timeEnd('connection');
    // Starts the timer
    console.time('query');
    const result = await prisma.$queryRaw`SELECT * FROM entity`
    // Ends the timer and print the time
    console.timeEnd('query');
    console.log('fetch entity query result', result)
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