__author__ = 'daxingplay'

import time
from bottle import route, run, request
from max7219 import MAX7219array as m7219

m7219.init()
print('current have ' + str(m7219.NUM_MATRICES) + ' matrices.')

def static_chinese_bytes(text_bytes):
    max_chinese = int(m7219.NUM_MATRICES / 4)
    available_matrices = max_chinese * 4
    # print('there are ' + str(available_matrices) + ' available.')
    for matrix in range(available_matrices):
        if matrix < available_matrices / 2:
            num = 2
            row = 0
            cur_char = int(matrix / 2)
        else:
            num = (max_chinese + 1) * 2
            row = 1
            cur_char = int((matrix - available_matrices / 2) / 2)
        if cur_char < len(text_bytes):
            cur_char_byte = text_bytes[cur_char]
            # print('cur matrix: ' + str(matrix) + '; cur number: ' + str(num) + '; cur char: ' + str(cur_char))
            if row == 0:
                j = (matrix - cur_char * 2) * 8
            else:
                j = ((matrix - available_matrices / 2) - (cur_char - 1) * 2) * 8
            # print('cur num: ' + str(j))
            for i in range(8):
                byte = cur_char_byte[j + i]
                byte = int(byte, 16) - 0x00
                m7219.send_matrix_reg_byte(matrix, i+1, byte)

@route('/display', method="POST")
def display():
    text = request.forms.get('text')
    delay = request.forms.get('delay')
    if not delay:
        delay = 0
    else:
        delay = float(delay)

    text_bytes_arr = []
    texts = text.split(';')
    for txt in texts:
        if len(txt):
            txt_byes = txt.split(',')
            if len(txt_byes) == 32:
                txt_byes_arr = []
                for b in txt_byes:
                    txt_byes_arr.append(hex(int(b, 16)))
                text_bytes_arr.append(txt_byes_arr)
    print(text_bytes_arr)
    static_chinese_bytes(text_bytes_arr)
    if delay > 0:
        print('sleep for ' + str(delay) + ' seconds.')
        time.sleep(delay)

run(host='localhost', port=8338)