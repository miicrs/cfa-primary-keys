# Importing sqlite3, connecting to the created banks database, and getting a cursor
import sqlite3
connection = sqlite3.connect('pk_tables.db')
sql = connection.cursor()

# Creating banks table
banks_table = 'CREATE TABLE IF NOT EXISTS ' \
    'banks (' \
    '"banks_id" INTEGER PRIMARY KEY AUTOINCREMENT,' \
    '"Name" TEXT,' \
    '"Phone number" TEXT' \
    ')'
sql.execute(banks_table);

# Inserting banking information to the table
# bank_info = '''INSERT INTO banks ("Name", "Phone number") VALUES \
#     ("Bank of America", "800-432-1000"), \
#     ("JPMorgan Chase", "800-935-9935"), \
#     ("Citi Bank", "800-374-9700"), \
#     ("Wells Fargo", "800-869-3557"), \
#     ("TD Bank", "888-751-9000"), \
#     ("Capital One", "877-383-4802"), \
#     ("HSBC Bank", "800-898-5999"), \
#     ("USAA", "800-531-8722"), \
#     ("Fidelity", "800-343-3548"), \
#     ("Key Bank", "800-539-2968"), \
#     ("US Bank", "800-872-2657"), \
#     ("BECU", "800-233-2328"), \
#     ("Cathay Bank", "213-625-4791"), \
#     ("PNC", "888-762-2265"), \
#     ("SunTrust", "800-786-8787"), \
#     ("Barclays", "800-309-6191") \
# '''
# sql.execute(bank_info);

# Creating users table
users_table = 'CREATE TABLE IF NOT EXISTS ' \
    'users (' \
    '"user_id" INTEGER PRIMARY KEY AUTOINCREMENT,' \
    '"First Name" TEXT,' \
    '"Last Name" TEXT,' \
    '"Phone number" TEXT UNIQUE,' \
    '"Email" TEXT UNIQUE,' \
    '"Password" TEXT' \
    ')'
sql.execute(users_table);

# Creating goals table
goals_table = 'CREATE TABLE IF NOT EXISTS ' \
    'goals (' \
    '"goals_id" INTEGER PRIMARY KEY AUTOINCREMENT,' \
    '"Goals" TEXT' \
    ')'
sql.execute(goals_table);

# Inserting goals into the table
goals_info = '''INSERT INTO goals ("Goals") VALUES \
    ("Saving money"), \
    ("Investing"), \
    ("Understanding credit"), \
    ("Paying off loans / debts"), \
    ("Retirement"), \
    ("Asset protection"), \
    ("Credit score"), \
    ("Tracking your spending"), \
    ("Building credit"), \
    ("Investment portfolio"), \
    ("Taxes"), \
    ("Emergency funds"), \
    ("Other") \
'''
sql.execute(goals_info);

# Creating junction table
junction_table = 'CREATE TABLE IF NOT EXISTS ' \
    'junction (' \
    '"user_id" INTEGER,' \
    '"bank_id" INTEGER,' \
    '"goals_id" INTEGER,' \
    'FOREIGN KEY(user_id) REFERENCES users(user_id),' \
    'FOREIGN KEY(bank_id) REFERENCES banks(bank_id)' \
    'FOREIGN KEY(goals_id) REFERENCES goals(goals_id)' \
    ')'
sql.execute(junction_table);

connection.commit()

connection.close()
