import pymongo
from xlrd import open_workbook

class Sp(object):
    def __init__(self):
        self.sever = "mongodb://127.0.0.1:27017/"
        self.db_name = "products_1"
    def run(self):
        try:
            connection = pymongo.MongoClient(self.sever)
            db = connection["kho"]
            # db = connection[self.db_name]
            # wb = open_workbook("./data_nal.xlsx")
            # for sheet in wb.sheets():
            #     number_of_rows = sheet.nrows
            #     number_of_columns = sheet.ncols

            #     items = []
            #     for row in range(14, number_of_rows):
            #         values = []
            #         for col in range(number_of_columns):
            #             value  = (sheet.cell(row,col).value)
            #             try:
            #                 value = str(int(value)).encode('UTF-8')
            #             except ValueError:
            #                 pass
            #             finally:
            #                 values.append(value)
            #         # item = Arm(*values)
            #         # print(values[1])
            #         # items.append(item)
            a = db.getCollection('products').find({})
            print(a)
            # db.insert([{
            #     "statistical" : {
            #         "new" : 0,
            #         "recovery" : 0,
            #         "guarantee" : 0
            #     },
            #     "description" : values[9],
            #     "manufacturer" : values[5],
            #     "machinePart" : values[4],
            #     "code" : values[0],
            #     "name" : values[2],
            #     "warehouseId" : ObjectId("5c0e8eab8803f91fb9465fb1"),
            #     "createdAt" : datetime.now(),
            #     "updatedAt" : datetime.now(),
            # }])
        except Exception:
            print("Can't connect mongoDB")
Sp().run()