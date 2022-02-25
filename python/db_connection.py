from . import db_utils
def get_db_session():

  # get secrets from secret manager
  secret_value = db_utils.get_secrets('MySecretForPOC')
  
  # get the rds endpoint

  rds_instance = db_utils.get_rds_endpoint()


  creds = {
    "username": secret_value['username'],
    "password": secret_value['password'],
    "engine":"PostgreSQL",
    "host": rds_instance['rds_host'],
    "port":5432,
    "dbname":rds_instance['db_name']
  }


  db_uri = f"postgresql://{creds['username']}:{creds['password']}@{creds['host']}:{creds['port']}/{creds['dbname']}"

  
  engine = db_utils.create_db_engine(db_uri)
  session = db_utils.create_db_session(engine)
  return session