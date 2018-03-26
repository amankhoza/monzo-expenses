# Monzo Expenses

## Set up server to handle requests from browser javascript:

1. Go to https://developers.monzo.com/ and get access token and account number (remember to get right account number, prepaid (no longer in use) or current account)
1. Set token and account number in server.py 
1. Set start and end date in server.py in the format `YYYY-MM-DDThh:mm:ssZ` eg. `2018-03-10T23:00:00Z`
1. Set up virtualenv and install python dependencies using the following:
1. cd to monzo-expenses directory
1. `sudo pip install virtualenv`
1. `virtualenv venv`
1. `. venv/bin/activate`
1. `pip install Flask flask-cors requests`
1. `FLASK_APP=server.py flask run`

## Run browser javascript:

1. Go to expenses website
1. Paste javascript from expenses.js into address bar (most browsers will omit the prefix javascript when pasting text into the address bar so watch out for this)
1. Hit Enter and wait for the magic to happen

## Upload receipts
1. Once expenses are filled in its time to upload receipts, these can be combined into one pdf using the following commands:
1. `sudo apt install img2pdf jpegoptim`
1. cd into monzo-expenses/receipts
1. `jpegoptim -m20 *.jpg`
1. `img2pdf *.jpg -o receipts.pdf`
1. Then upload receipts.pdf and you're done!
