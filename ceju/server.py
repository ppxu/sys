#!/usr/bin/python

__author__ = 'daxingplay'

import time
import atexit
import signal
import sys
import RPi.GPIO as GPIO
from bottle import route, run, request
from max7219 import MAX7219array as m7219

## common functions


def cleanup():
    GPIO.cleanup()
    print "clean up GPIO settings."
    sys.exit(0)


## setup ultrasonic measurement

# Use BCM GPIO references
# instead of physical pin numbers
GPIO.setmode(GPIO.BCM)

# Define GPIO to use on Pi
GPIO_TRIGGER = 25
GPIO_ECHO = 4

GPIO.setup(GPIO_TRIGGER, GPIO.OUT)  # Trigger
GPIO.setup(GPIO_ECHO, GPIO.IN)      # Echo

## setup max7219 led matrices

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

## routes

@route('/distance')
def distance():
    # Set trigger to False (Low)
    GPIO.output(GPIO_TRIGGER, False)

    # Allow module to settle
    time.sleep(0.1)
    # Send 10us pulse to trigger
    GPIO.output(GPIO_TRIGGER, True)
    time.sleep(0.00001)
    GPIO.output(GPIO_TRIGGER, False)
    start = time.time()
    while GPIO.input(GPIO_ECHO) == 0:
        start = time.time()

    while GPIO.input(GPIO_ECHO) == 1:
        stop = time.time()

    # Calculate pulse length
    elapsed = stop-start

    # Distance pulse travelled in that time is time
    # multiplied by the speed of sound (cm/s)
    distance = elapsed * 34000

    # That was the distance there and back so halve the value
    distance = distance / 2

    return "%.1f" % distance

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
    # print(text_bytes_arr)
    static_chinese_bytes(text_bytes_arr)
    if delay > 0:
        # print('sleep for ' + str(delay) + ' seconds.')
        time.sleep(delay)


@route('./clean')
def clean():
    GPIO.cleanup()
    time.sleep(2)
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(GPIO_TRIGGER, GPIO.OUT)  # Trigger
    GPIO.setup(GPIO_ECHO, GPIO.IN)

try:
    run(host='localhost', port=8338, server='paste')

    signal.signal(signal.SIGTERM, cleanup)
    signal.signal(signal.SIGKILL, cleanup)
    # signal.signal(signal.SIGINT, cleanup)
    signal.pause()
    atexit.register(cleanup)
except KeyboardInterrupt:
    cleanup()