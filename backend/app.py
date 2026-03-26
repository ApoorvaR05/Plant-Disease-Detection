import os
import sqlite3
import uuid
import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from model_utils import predict_disease, generate_mock_heatmap
import io

app = Flask(__name__)
CORS(app)

DB_FILE = "app.db"
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def init_db():
    conn = sqlite3.connect(DB_FILE, timeout=15)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE,
                    password TEXT,
                    token TEXT
                 )''')
    c.execute('''CREATE TABLE IF NOT EXISTS history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    image_path TEXT,
                    plant TEXT,
                    disease_name TEXT,
                    cause TEXT,
                    effect TEXT,
                    prevention TEXT,
                    confidence REAL,
                    timestamp TEXT
                 )''')
    conn.commit()
    conn.close()

init_db()

def get_user_from_token():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ')[1]
    conn = sqlite3.connect(DB_FILE, timeout=15)
    c = conn.cursor()
    c.execute("SELECT id, email FROM users WHERE token = ?", (token,))
    user = c.fetchone()
    conn.close()
    return user

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    hashed = generate_password_hash(password)
    try:
        conn = sqlite3.connect(DB_FILE, timeout=15)
        c = conn.cursor()
        c.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, hashed))
        conn.commit()
        conn.close()
        return jsonify({"message": "User created successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already exists"}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    conn = sqlite3.connect(DB_FILE, timeout=15)
    c = conn.cursor()
    c.execute("SELECT id, password FROM users WHERE email = ?", (email,))
    user = c.fetchone()
    if user and check_password_hash(user[1], password):
        token = str(uuid.uuid4())
        c.execute("UPDATE users SET token = ? WHERE id = ?", (token, user[0]))
        conn.commit()
        conn.close()
        return jsonify({"token": token, "email": email}), 200
    conn.close()
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/predict', methods=['POST'])
def predict():
    user = get_user_from_token()
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    try:
        file_bytes = file.read()
        
        # Save image for future heatmap request
        filename = f"{uuid.uuid4().hex}_{file.filename}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        with open(filepath, 'wb') as f:
            f.write(file_bytes)
            
        result = predict_disease(file_bytes)
        
        if "error" in result:
            # Delete the orphaned saved image since we are not storing this prediction
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({"error": result["error"]}), 400
        
        # Save to DB if logged in
        history_id = None
        if user:
            conn = sqlite3.connect(DB_FILE, timeout=15)
            c = conn.cursor()
            c.execute("""INSERT INTO history 
                         (user_id, image_path, plant, disease_name, cause, effect, prevention, confidence, timestamp)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                      (user[0], filepath, result['plant'], result['disease'], 
                       result.get('cause', ''), result.get('effect', ''), result.get('prevention', ''),
                       result['confidence'], datetime.datetime.now().isoformat()))
            conn.commit()
            history_id = c.lastrowid
            conn.close()
            
        result['history_id'] = history_id
        return jsonify(result), 200
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/history', methods=['GET'])
def get_history():
    user = get_user_from_token()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    conn = sqlite3.connect(DB_FILE, timeout=15)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM history WHERE user_id = ? ORDER BY timestamp DESC", (user[0],))
    rows = c.fetchall()
    conn.close()
    
    history_list = []
    for row in rows:
        history_list.append({
            "id": row["id"],
            "plant": row["plant"],
            "disease": row["disease_name"],
            "cause": row["cause"],
            "effect": row["effect"],
            "prevention": row["prevention"],
            "confidence": row["confidence"],
            "timestamp": row["timestamp"],
            "image_url": f"/image/{row['id']}"
        })
    return jsonify(history_list), 200

@app.route('/image/<int:history_id>', methods=['GET'])
def get_image(history_id):
    conn = sqlite3.connect(DB_FILE, timeout=15)
    c = conn.cursor()
    c.execute("SELECT image_path FROM history WHERE id = ?", (history_id,))
    row = c.fetchone()
    conn.close()
    if not row or not os.path.exists(row[0]):
        return jsonify({"error": "Image not found"}), 404
    return send_file(row[0], mimetype='image/jpeg')

@app.route('/heatmap/<int:history_id>', methods=['GET'])
def get_heatmap(history_id):
    conn = sqlite3.connect(DB_FILE, timeout=15)
    c = conn.cursor()
    c.execute("SELECT image_path FROM history WHERE id = ?", (history_id,))
    row = c.fetchone()
    conn.close()
    if not row or not os.path.exists(row[0]):
        return jsonify({"error": "Image not found"}), 404
        
    with open(row[0], 'rb') as f:
        image_bytes = f.read()
        
    heatmap_base64 = generate_mock_heatmap(image_bytes)
    return jsonify({"heatmap": heatmap_base64}), 200

@app.route('/', methods=['GET'])
def index():
    return jsonify({"status": "running", "message": "Backend API is active."}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)
