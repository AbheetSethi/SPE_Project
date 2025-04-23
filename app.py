from flask import Flask, request, jsonify
from flask_cors import CORS
from cryptography.fernet import Fernet
from pymongo import MongoClient
from datetime import datetime
import base64
import os

app = Flask(__name__)
CORS(app)

# Load environment variables from the .env file
# load_dotenv()

# Retrieve the key from the environment variable
# setx ENCRYPTION_KEY "bVck39AsLz8KNJY_UIT3uhZfRuFNDBRWv91lFEq4bF0="

key = os.getenv("ENCRYPTION_KEY")
print(key)

if not key:
    raise ValueError("ENCRYPTION_KEY environment variable not set")

fernet = Fernet(key)

def encrypt_data(data):
    return fernet.encrypt(data.encode())

def decrypt_data(encrypted_data):
    return fernet.decrypt(encrypted_data).decode()

# MongoDB setup
username = 'roshanyadav'
password = 'roshan123'
url = f"mongodb+srv://{username}:{password}@cluster0.fy8gboh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(url)

try:
    client.admin.command('ping')
    print("Connected to MongoDB")
except Exception as e:
    print("MongoDB connection failed:", e)
    raise

# {
#   "_id": "user_pid",
#   "seq": 1000
# }

db = client["Patient"]
counter_collection = db["counters"]
user_collection = db["Login"]
patient_collection = db["Patient_info"]
diagnosis_result_collection = db["Diagnosis_Result"]
request_collection = db["Request"]


# Initialize counters if not present
if counter_collection.count_documents({"_id": "user_pid"}) == 0:
    counter_collection.insert_one({"_id": "user_pid", "seq": 1000})
if counter_collection.count_documents({"_id": "patient_id"}) == 0:
    counter_collection.insert_one({"_id": "patient_id", "seq": 1000})

# Auto-increment functions
def get_next_user_pid():
    counter = counter_collection.find_one_and_update(
        {"_id": "user_pid"},
        {"$inc": {"seq": 1}},
        return_document=True
    )
    return str(counter["seq"])

# def get_next_patient_id():
#     counter = counter_collection.find_one_and_update(
#         {"_id": "patient_id"},
#         {"$inc": {"seq": 1}},
#         return_document=True
#     )
#     return f"P{counter['seq']}"

# User registration
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    name = data.get('name')

    if not all([username, password, email, name]):
        return jsonify({"error": "All fields (username, password, email, name) are required"}), 400

    # Check if user already exists in MongoDB
    existing_user = user_collection.find_one({"username": username})
    if existing_user:
        return jsonify({"error": "User already exists"}), 409

    # Encrypt the password
    # encrypted_password = fernet.encrypt(password.encode())
    encrypted_password = encrypt_data(password)

    # Get auto-incremented PID
    pid = get_next_user_pid()

    # Prepare document
    document = {
        "username": username,
        "password": encrypted_password,
        "email": email,
        "name": name,
        "pid": pid  # Store PID as int or string as you prefer
    }

    # Insert into MongoDB
    user_collection.insert_one(document)

    return jsonify({"message": f"User {username} registered successfully", "pid": pid}), 201

# User verification
@app.route('/verify', methods=['POST'])
def verify():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    # Fetch user from MongoDB
    user = user_collection.find_one({"username": username})

    if not user:
        return jsonify({"error": "Username not found"}), 404
    
    print(user["password"])

    try:
        # decrypted_password = fernet.decrypt(user["password"]).decode()
        decrypted_password = decrypt_data(user["password"])
    except Exception as e:
        return jsonify({"error": "Password decryption failed"}), 500

    if password == decrypted_password:
        return jsonify({
            "message": "Verification successful",
            "pid": user["pid"],
            "name": user["name"],
            "email": user["email"]
        }), 200
    else:
        return jsonify({"error": "Wrong password"}), 401

# Upload data
@app.route('/upload_data/<pid>', methods=['POST'])
def upload_data(pid):
    try:
        # Get data from form (request.form)
        date = request.form.get('date')
        prediction = request.form.get('mlDiagnosis')
        doctor_diagnosis = request.form.get('doctorDiagnosis')
        status = request.form.get('status')
        comment = request.form.get('doctorComments')
        image = request.files.get('image')

        if not all([date, prediction, doctor_diagnosis, status, comment, image]):
            return jsonify({"error": "All fields are required"}), 400

        # Convert image to base64
        image_data = base64.b64encode(image.read()).decode("utf-8")

        # Build your data document
        document = {
            "patient_id": pid,
            "date": date,
            "mlDiagnosis": prediction,
            "doctorDiagnosis": doctor_diagnosis,
            "status": status,
            "doctorComments": comment,
            "imagePath": image_data
        }

        # Save to database
        diagnosis_result_collection.insert_one(document)

        # Return only the success message
        return jsonify({"message": "data uploaded successfully"}), 201

    except Exception as e:
        return jsonify({"error": f"Failed to upload data: {str(e)}"}), 500

# Data of given patient
@app.route('/get_data/<pid>', methods=['GET'])
def get_data(pid):
    try:
        # Query the database for all diagnosis records for the given patient ID
        results = diagnosis_result_collection.find({"patient_id": pid})

        # Convert the cursor to a list and remove '_id' from each result
        records = []
        for result in results:
            result.pop('_id', None)  # Remove '_id' field
            records.append({
                "patient_id": result.get("patient_id"),
                "date": result.get("date"),
                "status": result.get("status"),
                "mlDiagnosis": result.get("mlDiagnosis"),
                "doctorDiagnosis": result.get("doctorDiagnosis"),
                "doctorComments": result.get("doctorComments"),
                "imagePath": result.get("imagePath")
            })

        if records:
            response = {
                "data": records
            }
            return jsonify(response), 200
        else:
            return jsonify({"error": "No records found for this patient"}), 404

    except Exception as e:
        return jsonify({"error": f"Failed to retrieve data: {str(e)}"}), 500
    
# Data of all patient
@app.route('/get_patient_data', methods=['GET'])
def get_patient_data():
    try:
        # Query the database for all diagnosis records
        results = request_collection.find({})  # No patient_id filter

        # Convert the cursor to a list and remove '_id' from each result
        records = []
        for result in results:
            result.pop('_id', None)  # Remove '_id' field
            records.append({
                "patient_id": result.get("patient_id"),
                "date": result.get("date"),
                "status": result.get("status"),
                "mlDiagnosis": result.get("ml_diagnosis"),
                "imagePath": result.get("image")
            })

        if records:
            response = {
                "data": records
            }
            return jsonify(response), 200
        else:
            return jsonify({"error": "No records found"}), 404

    except Exception as e:
        return jsonify({"error": f"Failed to retrieve data: {str(e)}"}), 500

    

@app.route("/create-request", methods=["POST"])
def create_request():
    try:
        # For multipart/form-data (image + text)
        patient_id = request.form.get("patientId")
        comments = request.form.get("comments")
        image_file = request.files.get("image") 
        print(patient_id)

        # if not patient_id or not comments:
        #     return jsonify({"error": "Missing required fields"}), 400

        if not image_file:
            print("image not found")
            return jsonify({"error": "Image file is required"}), 400

        image_data = base64.b64encode(image_file.read()).decode("utf-8")

        date = datetime.now().strftime("%Y-%m-%d")

        # Store only patientId and comments in MongoDB
        new_entry = {
            "patient_id": patient_id,
            "date": date,
            "image": image_data,
            "patient_comments": comments,
            "ml_diagnosis": "Ekzama",
            # "ml_diagnosis": "Malign",
            "status": "Pending"
        }

        # Save to database
        request_collection.insert_one(new_entry)

        return jsonify({"message": "Request created successfully"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while creating the request"}), 500


# Run the app
if __name__ == '__main__':
    app.run(debug=True)
