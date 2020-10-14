import pymongo
username = 'alus20x'
password = 'asdfg8307'
connection = pymongo.MongoClient('mongodb://%s:%s@localhost' % (username, password))

db = connection.alux
alux_collection = db.alux