from flask import Flask, request, jsonify
import time
import json
import sqlite3

app = Flask(__name__)

baglanti = sqlite3.connect("./mesajlar.db")
cursor = baglanti.cursor()
cursor.execute("SELECT * FROM yuk_sahibi_ilanlari")

data = cursor.fetchall()
liste_data = [list(t) for t in data]
for sublist in liste_data:
    del sublist[0]

print(liste_data)

client_requests = {}

request_limit = 3

fast_request = {
    "message": "You are sending requests too fast. Please wait."
}

fast_request_fixed = json.dumps(fast_request, ensure_ascii=False)

@app.route('/get_data', methods=['GET'])
def get_data():
    client_ip = request.remote_addr
    current_time = time.time()

    if client_ip in client_requests:
        last_request_time = client_requests[client_ip]
        if current_time - last_request_time < request_limit:
            return fast_request_fixed, 429, {'Content-Type': 'application/json; charset=utf-8'}

    client_requests[client_ip] = current_time

    json_str = json.dumps(liste_data, ensure_ascii=False, indent=3)
    return json_str, 200, {'Content-Type': 'application/json; charset=utf-8'}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1234)
