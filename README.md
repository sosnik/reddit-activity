Charts the posting history (and displays comment text) of supplied reddit users.

# Usage
1. Supply the list of users you want to investigate in `users`, one per line
2. Run `./bundle.sh`
3. Open `timesniffer.html` in a web browser

`bundle.sh` fetches the user page json for each user in `users` and bundles it together in a simple array which is processed by the charting code in the html file.

If you want to use local files instead of fetching from reddit (such as for deleted users) modify the bundle script accordingly (such as with `cat` instead of `wget`).

# TODO
* Make zoom work
* make better file hierarchy
* Make it run as a proper webapp
* Fetch users from within the webapp without involving an external shell script
* Export to other formats.