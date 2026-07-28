# Importing sqlite3, connecting to the created banks database, and getting a cursor
import sqlite3
connection = sqlite3.connect('pk_banks.db')
sql = connection.cursor()

# Creating banks table
banks_table = 'CREATE TABLE IF NOT EXISTS ' \
    'banks (' \
    '"Name" TEXT,' \
    '"Contact Information" TEXT' \
    ')'
sql.execute(SELECT * FROM banks)
