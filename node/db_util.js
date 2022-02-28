const aws = require("aws-sdk");
const client = new aws.SecretsManager();
const rds = new aws.RDS();

async function getSecretValue () {
  const secretName = 'MySecretForPOC';
  try {
    console.log('Getting secrets');
    let secret;
    const data = await client.getSecretValue({ SecretId: secretName }).promise();
    if (data.SecretString) secret = data.SecretString;
    return secret ? JSON.parse(secret) : secret
  } catch (err) {
    if (err.code === 'ResourceNotFoundException') {
      console.log(`The requested secret ${secretName} was not found`);
    } else if (err.code === 'InvalidRequestException') {
      console.log(`The request was invalid due to: ${err.message}`);
    } else if (err.code === 'InvalidParameterException') {
      console.log(`The request had invalid params: ${err.message}`);
    }
    throw err;
  }
};
async function getRDSHost () { 
    const params = {
        DBInstanceIdentifier: 'testdatabase',
      };
    try {
      let response = {}
      const data = await rds.describeDBInstances(params).promise();
      response = {
        "rds_host": data.DBInstances[0].Endpoint.Address,
        "db_name" :  data.DBInstances[0].DBName,
        "port": data.DBInstances[0].Endpoint.Port
      }
      return response
    } catch (err) { 
        console.log(err)
    }
}

function parentEncode(inputString) {
  const literls = {
    ':'	: '%3A',
    '/': '%2F',
    '?': '%3F',
    '#': '%23',
    '[': '%5B',
    ']': '%5D',
    '@': '%40',
    '!': '%21',
    '$': '%24',
    '&': '%26',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '*': '%2A',
    '+': '%2B',
    ',': '%2C',
    ';': '%3B',
    '=': '%3D',
    '%': '%25',
    ' ': '%20'
  }

  const result = [];
  for (let char of inputString) {
    if (literls[char]) {
      result.push(literls[char]);
    } else{
      result.push(char);
    }
  }
  return result.join('');
}

// get rds hostname and secrets from secrets manager
async function formulateDBURL() {
  const rds = await getRDSHost();
  const secret =  await getSecretValue();
  return `postgresql://${secret.username}:${parentEncode(secret.password)}@${rds.rds_host}:${rds.port}/${rds.db_name}`;
}

module.exports = {
  formulateDBURL
};