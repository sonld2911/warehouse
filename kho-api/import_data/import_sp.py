import pymongo
from xlrd import open_workbook
from datetime import datetime, timedelta
class Sp(object):
    def __init__(self):
        self.sever = "mongodb://127.0.0.1:27017/"
        self.db_name = "products"
    def run(self):
        try:
            connection = pymongo.MongoClient(self.sever)
            db = connection["ws"]
            products_1 = db[self.db_name]
            warehouses = db["warehouses"]
            warehouses_01 = warehouses.find_one({"name": "WAREHOUSE 01"})
            print(warehouses_01.get("_id"))
            # products_1.insert([{
            #     "statistical": {
            #         "new": 0,
            #         "recovery": 0,
            #         "guarantee": 0
            #     },
            #     "description": "sadasdas",
            #     "manufacturer": "Sadasd",
            #     "machinePart": "ASdasdsa",
            #     "code": "Asdasdasd",
            #     "name": "Asdasd",
            #     "warehouseId": warehouses_01.get("_id"),
            #     "createdAt": datetime.now(),
            #     "updatedAt": datetime.now(),
            # }])
            wb = open_workbook("./BaoCaoXuatNhapTon.xlsx")

            sh = wb.sheet_by_index(1)
            print("{0} {1} {2}".format(sh.name, sh.nrows, sh.ncols))

            number_of_rows = sh.nrows
            number_of_columns = sh.ncols
            print("{} {}".format(number_of_rows, number_of_columns))
            for row in range(14, 3462):
                values = []
                for col in range(number_of_columns):
                    value  = (sh.cell(row,col).value)
                    try:
                        value = str(int(value)).encode('UTF-8')
                    except ValueError:
                        pass
                    finally:
                        values.append(value)
                # item = Arm(*values)
                print(row)
                # print(values)
                data_insert = {
                    "statistical" : {
                        "new" : 0,
                        "recovery" : 0,
                        "guarantee" : 0
                    },
                    "technicalSpecifications": values[4],
                    "unit": values[6],
                    "kind": values[8],
                    "description" : values[9],
                    "manufacturer" : values[5],
                    "machinePart" : values[4],
                    "code" : values[0],
                    "name" : values[2],
                    "warehouseId" : warehouses_01.get("_id"),
                    "createdAt" : datetime.now(),
                    "updatedAt" : datetime.now(),
                }
                checkSP = products_1.find({"name": values[0]})
                checkSP = list(checkSP)
                if len(checkSP) == 0:
                    products_1.insert([data_insert])
                print(data_insert)
                # products_1.insert([data_insert])
        except Exception:
            print("Can't connect mongoDB")
Sp().run()