#!/bin/bash

echo "var datastore = [" > bundle.js
while read user; do
	wget -O- -q "https://www.reddit.com/user/$user.json?limit=1000" >> bundle.js
	echo "," >> bundle.js
done < users
echo "]" >> bundle.js
