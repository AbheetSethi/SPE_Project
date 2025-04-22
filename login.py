# from flask import Flask, request, jsonify
# from cryptography.fernet import Fernet
# from flask_cors import CORS

# # pip install Flask cryptography

# app = Flask(__name__)
# CORS(app)

# # Generate a key (in production, store this securely!)
# key = Fernet.generate_key()
# fernet = Fernet(key)

# # In-memory "database"
# user_db = {'roshan':'roshan123'}

# @app.route('/register', methods=['POST'])
# def register():
#     data = request.json
#     username = data.get('username')
#     print(username)
#     password = data.get('password')
#     print(password)

#     if not username or not password:
#         return jsonify({"error": "Username and password required"}), 400

#     if username in user_db:
#         return jsonify({"error": "User already exists"}), 409

#     # Encrypt password
#     encrypted_password = fernet.encrypt(password.encode())

#     user_db[username] = encrypted_password
    
#     return jsonify({"message": f"User {username} registered successfully."})

# @app.route('/verify', methods=['POST'])
# def verify():
#     data = request.json
#     username = data.get('username')
#     print(username)
#     password = data.get('password')
#     print(password)

#     if username not in user_db:
#         return jsonify({"error": "User not found"}), 404

#     # Decrypt stored password
#     stored_encrypted_password = user_db[username]
#     # print(stored_encrypted_password)
#     # decrypted_password = fernet.decrypt(stored_encrypted_password).decode()

#     if password == stored_encrypted_password:
#         return jsonify({"message": "Verification successful","pid": 1000})
#     else:
#         return jsonify({"error": "Incorrect password"}), 401

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify
from cryptography.fernet import Fernet
from flask_cors import CORS
import uuid

app = Flask(__name__)
CORS(app)

# Generate a key (in production, store securely!)
key = Fernet.generate_key()
fernet = Fernet(key)

# In-memory "database"
# Store user data as a dictionary: { username: { encrypted_password, email, name, pid } }
user_db = {}

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    name = data.get('name')

    if not all([username, password, email, name]):
        return jsonify({"error": "All fields (username, password, email, name) are required"}), 400

    if username in user_db:
        return jsonify({"error": "User already exists"}), 409

    encrypted_password = fernet.encrypt(password.encode())
    pid = str(uuid.uuid4())  # Generate a unique patient ID

    # Store user info
    user_db[username] = {
        "password": encrypted_password,
        "email": email,
        "name": name,
        "pid": pid
    }

    return jsonify({"message": f"User {username} registered successfully", "pid": 1000}), 201


@app.route('/verify', methods=['POST'])
def verify():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if username not in user_db:
        return jsonify({"error": "User not found"}), 404

    stored_encrypted_password = user_db[username]["password"]
    decrypted_password = fernet.decrypt(stored_encrypted_password).decode()

    if password == decrypted_password:
        return jsonify({
            "message": "Verification successful",
            "pid": user_db[username]["pid"],
            "name": user_db[username]["name"],
            "email": user_db[username]["email"]
        }), 200
    else:
        return jsonify({"error": "Incorrect password"}), 401


if __name__ == '__main__':
    app.run(debug=True)

