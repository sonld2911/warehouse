import pymongo
from xlrd import open_workbook

class Sp(object):
    def __init__(self):
        self.sever = "mongodb://127.0.0.1:27017"
        self.db_name = "kho"

    def run(self):
        try:
            connection = pymongo.MongoClient(self.sever)
            db = connection[self.db_name]
            db.insert([{
                "uid": user,
                "longDate": self.long,
                "shortDate": self.short,
                "status": status,
                "updatedAt": datetime.now(),
                "createdAt": datetime.now()
            }])
        except Exception:
            print("Can't connect mongoDB")
