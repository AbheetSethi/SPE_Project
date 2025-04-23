from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from cryptography.fernet import Fernet
from bson.objectid import ObjectId
from datetime import datetime
import base64
import os

app = Flask(__name__)
CORS(app)

# ========== CONFIGURATION ==========
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", "bVck39AsLz8KNJY_UIT3uhZfRuFNDBRWv91lFEq4bF0=")
fernet = Fernet(ENCRYPTION_KEY.encode())

# MongoDB Configuration
client = MongoClient("mongodb+srv://roshanyadav:roshan123@cluster0.fy8gboh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["Patient"]

# Collections
user_collection = db["Login"]
request_collection = db["Request"]
diagnosis_result_collection = db["Diagnosis_Result"]
counter_collection = db["counters"]

# Initialize counters
if counter_collection.count_documents({"_id": "user_pid"}) == 0:
    counter_collection.insert_one({"_id": "user_pid", "seq": 1000})

# ========== HELPER FUNCTIONS ==========
def get_next_user_pid():
    counter = counter_collection.find_one_and_update(
        {"_id": "user_pid"},
        {"$inc": {"seq": 1}},
        return_document=True
    )
    return str(counter["seq"])

def encrypt_data(data):
    return fernet.encrypt(data.encode())

def decrypt_data(encrypted_data):
    return fernet.decrypt(encrypted_data).decode()

# ========== PATIENT ENDPOINTS ==========
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    name = data.get('name')

    if not all([username, password, email, name]):
        return jsonify({"error": "All fields are required"}), 400

    if user_collection.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 409

    encrypted_password = encrypt_data(password)
    pid = get_next_user_pid()

    user_collection.insert_one({
        "username": username,
        "password": encrypted_password,
        "email": email,
        "name": name,
        "pid": pid
    })

    return jsonify({"message": f"User {username} registered", "pid": pid}), 201

@app.route('/verify', methods=['POST'])
def verify():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = user_collection.find_one({"username": username})
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        if password != decrypt_data(user["password"]):
            return jsonify({"error": "Invalid password"}), 401
    except Exception:
        return jsonify({"error": "Decryption failed"}), 500

    return jsonify({
        "message": "Login successful",
        "pid": user["pid"],
        "name": user["name"],
        "email": user["email"]
    }), 200

@app.route('/create-request', methods=['POST'])
def create_request():
    try:
        patient_id = request.form.get("patientId")
        comments = request.form.get("comments")
        image_file = request.files.get("image")

        if not image_file:
            return jsonify({"error": "Image required"}), 400

        image_data = base64.b64encode(image_file.read()).decode("utf-8")
        
        request_collection.insert_one({
            "patient_id": patient_id,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "image": image_data,
            "patient_comments": comments,
            "ml_diagnosis": "Pending Analysis",
            "status": "Pending"
        })

        return jsonify({"message": "Request created"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# @app.route('/get_data/<pid>', methods=['GET'])
# def get_data(pid):
#     try:
#         records = list(diagnosis_result_collection.find({"patient_id": pid}))
#         return jsonify({
#             "data": [{
#                 "date": r.get("date"),
#                 "status": r.get("status"),
#                 "mlDiagnosis": r.get("mlDiagnosis"),
#                 "doctorDiagnosis": r.get("doctorDiagnosis"),
#                 "doctorComments": r.get("doctorComments"),
#                 "imagePath": r.get("imagePath")
#             } for r in records]
#         }), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

@app.route('/get_data/<pid>', methods=['GET'])
def get_data(pid):
    try:
        records = list(request_collection.find({"patient_id": pid}))
        return jsonify({
            "data": [{
                "date": r.get("date"),
                "status": r.get("status"),
                "mlDiagnosis": r.get("mlDiagnosis"),
                "doctorDiagnosis": r.get("doctorDiagnosis"),
                "doctorComments": r.get("doctorComments"),
                "imagePath": r.get("imagePath")
            } for r in records]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# ========== DOCTOR ENDPOINTS ==========
@app.route('/doctor-verify', methods=['POST'])
def doctor_verify():
    data = request.get_json()
    if data.get('username') == "abheet" and data.get('password') == "abheet123":
        print("succeess")
        return jsonify({"message": "Doctor authenticated", "role": "doctor"}), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/get-pending-requests', methods=['GET'])
def get_pending_requests():
    try:
        requests = list(request_collection.find({"status": "Pending"}))
        return jsonify({
            "data": [{
                "appointment_id": str(r["_id"]),
                "patientId": r.get("patient_id"),
                "date": r.get("date"),
                "imagePath": r.get("image"),
                "comments": r.get("patient_comments"),
                "mlDiagnosis": r.get("ml_diagnosis")
            } for r in requests]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/update-diagnosis', methods=['POST'])
def update_diagnosis():
    try:
        data = request.json
        request_collection.update_one(
            {"_id": ObjectId(data['appointment_id'])},
            {"$set": {
                "status": "Reviewed",
                "comments": r.get("patient_comments"),
                "doctorDiagnosis": data['doctorDiagnosis'],
                "doctorComments": data.get('doctorComments', "No comments")
            }}
        )
        return jsonify({"message": "Diagnosis updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ========== RUN SERVER ==========
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
