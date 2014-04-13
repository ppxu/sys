#!/usr/bin/env python
# -*- coding: UTF-8 -*-
# ---------------------------------------------------------
# This demo script is intended to run on an array of 8
#   MAX7219 boards, connected as described in the library
#   script.  It should run without errors on other-sized
#   arrays, but would not then fully or correctly display
#   the operation of the library functions
# The variable NUM_MATRICES, defined in the MAX7219array.py
#   library script, should always be set to be consistent
#   with the actual hardware setup in use.  If it is not
#   set correctly, then the functions will not work as
#   intended:
#   a)NUM_MATRICES set > actual number or matrices:
#     The functions will assume the presence of the
#     non-existent extra matrices off to the left-hand
#     side of the real array, and so some data sent will
#     not be displayed
#   b)NUM_MATRICES set < actual number of matrices:
#     The functions should work correctly in the right-
#     most matrices declared to the library. Some of
#     the displayed data will however be duplicated on
#     the addition non-declared matrices
# The main script calling the library functions should
#   send arguments appropriate for the value of
#   NUM_MATRICES set in the library.  Error-trapping in
#   the library attempts to capture any inappropriate
#   arguments (and either set them to appropriate values
#   instead or simply ignore the command) but may not
#   correct or eliminate them all. If required, the
#   NUM_MATRICES variable could be imported into the
#   main script to allow the script to adjust to the
#   size of array in use
# ---------------------------------------------------------

import time
from random import randrange
from types import *

# Import library
# Import fonts

# The following imported variables make it easier to feed parameters to the library functions

# Initialise the library and the MAX7219/8x8LED array
from max7219 import MAX7219array as m7219

m7219.init()

# tao = [0x0,0x0,0x4,0x6,0x4,0x4,0x4,0x8,0x0,0x40,0x60,0x40,0x40,0x40,0x40,0x20,0x8,0x10,0x10,0x20,0x40,0x80,0x0,0x0,0x20,0x10,0x10,0x8,0xe,0x4,0x0,0x0]
# tao2 = [0x1,0x1,0x2,0x4,0x9,0x10,0x6f,0x0,0x0,0x0,0x80,0x40,0x30,0x8e,0xe4,0x20,0x0,0x2,0x1,0x28,0x28,0x28,0x4f,0x0,0x40,0x80,0x0,0x88,0x96,0x12,0xf0,0x0]

print('current have ' + str(m7219.NUM_MATRICES) + ' matrices.')

def static_chinese_bytes(text_bytes):
    max_chinese = int(m7219.NUM_MATRICES / 4)
    available_matrices = max_chinese * 4
    print('there are ' + str(available_matrices) + ' available.')
    for matrix in range(available_matrices):
        if matrix < available_matrices / 2:
            num = 2
            row = 0
            cur_char = int(matrix / 2)
        else:
            num = (max_chinese + 1) * 2
            row = 1
            cur_char = int((matrix - available_matrices / 2) / 2)
        # cur_char = int((matrix - minus) / num)
        if cur_char < len(text_bytes):
            cur_char_byte = text_bytes[cur_char]
            print('cur matrix: ' + str(matrix) + '; cur number: ' + str(num) + '; cur char: ' + str(cur_char))
            # j = (matrix - (cur_char + row) * 2) * 8
            if row == 0:
                j = (matrix - cur_char * 2) * 8
            else:
                j = ((matrix - available_matrices / 2) - (cur_char - 1) * 2) * 8
            print('cur num: ' + str(j))
            for i in range(8):
                byte = cur_char_byte[j + i]
                byte = int(byte, 16) - 0x00
                m7219.send_matrix_reg_byte(matrix, i+1, byte)

if __name__ == "__main__":
    import sys

    try:
        text_bytes_arr = []
        text_bytes_str = sys.argv[1]
        texts = text_bytes_str.split(';')
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
    except IndexError:
        # If no arguments given, show help text
        print "led.py please specify a text bytes string"