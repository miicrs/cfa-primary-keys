# Importing sqlite3, connecting to the created banks database, and getting a cursor
import sqlite3
connection = sqlite3.connect('pk_banks.db')
sql = connection.cursor()

# Creating banks table
banks_table = 'CREATE TABLE IF NOT EXISTS ' \
    'banks (' \
    '"Name" TEXT,' \
    '"Phone number" TEXT' \
    ')'
sql.execute(banks_table);
connection.commit();

# ("", ""), \

bank_info = '''INSERT INTO banks VALUES \
    ("Bank of America", "800-432-1000"), \
    ("JPMorgan Chase", "800-935-9935"), \
    ("Citi Bank", "800-374-9700"), \
    ("Wells Fargo", "800-869-3557"), \
    ("TD Bank", "888-751-9000"), \
    ("Capital One", "877-383-4802"), \
    ("HSBC Bank", "800-898-5999"), \
    ("USAA", "800-531-8722"), \
    ("Fidelity", "800-343-3548"), \
    ("Key Bank", "800-539-2968"), \
    ("US Bank", "800-872-2657"), \
    ("BECU", "800-233-2328"), \
    ("Cathay Bank", "213-625-4791"), \
    ("PNC", "888-762-2265"), \
    ("SunTrust", "800-786-8787"), \
    ("Barclays", "800-309-6191") \
'''
sql.execute(bank_info);

connection.commit();

sql.execute('SELECT * FROM banks')
view = sql.fetchall()
for row in view:
    print(row)

connection.close()
