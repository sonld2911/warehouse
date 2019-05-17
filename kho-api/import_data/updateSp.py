import pymongo
import random


class Sp(object):
    def __init__(self):
        self.sever = "mongodb://127.0.0.1:27017/"
        self.db_name = "products"

    def run(self):
        try:
            connection = pymongo.MongoClient(self.sever)
            db = connection["kho"]
            products_1 = db[self.db_name]
            products = db["products"]
            warehouses_01 = products.find({})
            warehouses_01 = list(warehouses_01)
            # print(warehouses_01)
            for row in warehouses_01:
                print(row["_id"])
                print("\n")
                row["location"] = "shelf {}".format(random.randint(1, 101))
                row["expiryDate"] = "{} years".format(random.randint(1, 5))
                products.update({"_id": row["_id"]}, row)

        except Exception:
            print("Can't connect mongoDB")
            print("{}".format(Exception))


Sp().run()
