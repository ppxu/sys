__author__ = 'daxingplay'
text = '0x1,0x1,0x2,0x1f,0x10,0x10,0x1f,0x10,0x0,0x80,0x0,0xf8,0x8,0x8,0xf8,0x8,0x10,0x10,0x1f,0x10,0x10,0x10,0x1f,0x10,0x8,0x8,0xf8,0x8,0x8,0x8,0xf8,0x8;0x1,0x0,0x3f,0x24,0x7f,0x4,0x1f,0x4,0x0,0x80,0xfe,0x44,0xf8,0x40,0xf8,0x40,0x7f,0x4,0xb,0x10,0x22,0x41,0x0,0x0,0xfc,0x40,0x20,0xd8,0xe,0x84,0xc0,0x80;'
tao = [0x0,0x0,0x4,0x6,0x4,0x4,0x4,0x8,0x0,0x40,0x60,0x40,0x40,0x40,0x40,0x20,0x8,0x10,0x10,0x20,0x40,0x80,0x0,0x0,0x20,0x10,0x10,0x8,0xe,0x4,0x0,0x0]
tao2 = [0x1,0x1,0x2,0x4,0x9,0x10,0x6f,0x0,0x0,0x0,0x80,0x40,0x30,0x8e,0xe4,0x20,0x0,0x2,0x1,0x28,0x28,0x28,0x4f,0x0,0x40,0x80,0x0,0x88,0x96,0x12,0xf0,0x0]

if __name__ == "__main__":
    import sys
    from types import *

    try:
        text_bytes = []
        text_bytes_str = text
        texts = text_bytes_str.split(';')
        for txt in texts:
            if len(txt):
                txt_byes = txt.split(',')
                txt_byes_arr = []
                for b in txt_byes:
                    txt_byes_arr.append(hex(int(b, 16)))
                text_bytes.append(txt_byes_arr)
        for b in tao:
            print type(b)
        print(text_bytes)
    except IndexError:
        # If no arguments given, show help text
        print "led.py please specify a text bytes string"