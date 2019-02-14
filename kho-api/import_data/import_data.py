# -*- coding: utf-8 -*- 

from xlrd import open_workbook

class Arm(object):
    def __init__(self, id, name, eamil, date):
        self.id = id
        self.name = name
        self.eamil = eamil
        self.date = date

    def __str__(self):
        return("Arm object:\n"
               "  id = {0}\n"
               "  name = {1}\n"
               "  email = {2}\n"
               "  date = {3}\n"
               .format(self.id, self.name, self.eamil,
                       self.date))

wb = open_workbook("./BaoCaoXuatNhapTon.xlsx")
# wb = open_workbook("./data_nal.xlsx")
for sheet in wb.sheets():
    number_of_rows = sheet.nrows
    number_of_columns = sheet.ncols

    items = []
    for row in range(14, number_of_rows):
        values = []
        for col in range(number_of_columns):
            value  = (sheet.cell(row,col).value)
            try:
                value = str(int(value)).encode('UTF-8')
            except ValueError:
                pass
            finally:
                values.append(value)
        # item = Arm(*values)
        print(values[0])
        # items.append(item)

# for item in items:
#     print(item)
#     print("Accessing one single value (eg. DSPName): {0}".format(item.dsp_name))
