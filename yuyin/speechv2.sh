#!/bin/bash

curl -X POST --data-binary @zhong.flac -A 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.117 Safari/537.36' -H 'Content-Type: audio/x-flac; rate=44100;' 'https://www.google.com.hk/speech-api/v2/recognize?output=json&lang=zh-CN&key=AIzaSyCnl6MRydhw_5fLXIdASxkLJzcJh5iX0M4' | cat >zhong.txt