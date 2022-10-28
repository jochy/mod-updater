#!/bin/bash

bfg -b 10M  # To remove all blobs from history, whose size is superior to 10Mb
git reflog expire --expire=now --all
git gc --prune=now --aggressive