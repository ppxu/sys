#!/bin/bash

ffmpeg -loglevel panic -y -i zhong.wav -ar 44100 -acodec flac zhong.flac