from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import boto3
import json

Session = None

def create_db_engine(db_conn_string, debug_mode=False):
    return create_engine(db_conn_string, pool_pre_ping=True)


def create_db_session(engine):
    global Session
    if not Session:
        Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        # todo: setup connection pooling properties
    return Session()

def get_secrets(secret_name):
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(
        SecretId=secret_name
    )
    secret_value = json.loads(response['SecretString'])
    return secret_value

def get_rds_endpoint():
    client = boto3.client('rds')
    instances = client.describe_db_instances(DBInstanceIdentifier='testdatabase')
    return {
        "rds_host": instances.get('DBInstances')[0].get('Endpoint').get('Address'),
        "db_name" :  instances.get('DBInstances')[0].get('DBName')

    }
