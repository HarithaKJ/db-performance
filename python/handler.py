import json
import time
from . import db_connection


def hello(event, context):
    start_time = time.time()
    db_session = db_connection.get_db_session()
    print("--- %s start - connection established seconds ---" % round(time.time() - start_time, 2))
    sql_query = f"""
    CREATE TABLE entity (
        entity_uuid uuid NOT NULL,
        entity_type varchar NOT NULL
    );
    """

    start_time = time.time()
    result = db_session.execute(sql_query)
    print("--- %s start - table creation seconds ---" % round(time.time() - start_time, 2))
    print("global entity", result)

    sql_query = f"""
    INSERT into entity (
        entity_uuid,
        entity_type
    ) values ('632e33b1-832d-4a7f-9df1-3c754745f058', 'haru')
    """

    start_time = time.time()
    result = db_session.execute(sql_query)
    print("--- %s start - insert query seconds ---" % round(time.time() - start_time, 2))
    print("global entity", result)

    db_session.commit()

    sql_query = f"""
    select * from entity;
    """

    start_time = time.time()
    result = db_session.execute(sql_query).fetchone()
    print("--- %s start - result fetched seconds ---" % round(time.time() - start_time, 2))
    print("global entity", result)
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
