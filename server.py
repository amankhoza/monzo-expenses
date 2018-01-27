# pip install Flask flask-cors requests

from flask import Flask
from flask_cors import CORS
from flask.json import jsonify
import requests
import urllib
import os

app = Flask(__name__)
CORS(app)

ACC_ID = ''
TOKEN = ''
START_DATE = ''
END_DATE = ''

def get_transactions(acc_id, token, since=None, before=None, category=None, t_range=None):
    '''
      Get transactions
      returns list of a users transactions
      t_range = transactions range (start and end indices of transactions you want)
    '''
    params = {'account_id': acc_id}
    if since:
        params['since'] = since
    if before:
        params['before'] = before

    url = 'https://api.monzo.com/transactions'
    response = requests.get(url=url,
                            headers={'Authorization': 'Bearer ' + token},
                            params=params)
    transactions = response.json()['transactions']

    results = []

    if category:
        filter_transactions = []
        for t in transactions:
            if t['category'] == category:
                filter_transactions.append(t)
        results = filter_transactions
    else:
        results = transactions

    if t_range:
        return {"requested_transactions": results[t_range[0]:t_range[1]], "total_transactions": len(results)}
    else:
        return results

@app.route('/expenses/<indices>')
def expenses(indices):
    print('serve request')
    # Adjust start_index as expenses are indexed starting from 1, NOT 0 !
    start_index = int(indices.split('-')[0])-1
    end_index  = int(indices.split('-')[1])
    transactions_data = get_transactions(ACC_ID, TOKEN, START_DATE, END_DATE, category='holidays', t_range=[start_index, end_index])
    transactions = transactions_data['requested_transactions']
    receipt_no = start_index+1
    if not os.path.exists('./receipts'):
        os.makedirs('./receipts')
    for t in transactions:
        print(t['created'])
        attachments = t['attachments']
        if attachments:
            if len(attachments) is 1:
                urllib.urlretrieve(attachments[0]['url'], './receipts/'+str(receipt_no)+'.jpg')
            else:
                for attachment_no in range(len(attachments)):
                    urllib.urlretrieve(attachments[attachment_no]['url'], './receipts/'+str(receipt_no)+'_'+str(attachment_no)+'.jpg')
        receipt_no += 1
    print('done')
    response = jsonify({"requested_transactions": transactions, "total_transactions": transactions_data["total_transactions"]})
    print(str(response))
    return response
