"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
import datetime
from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_cors import CORS, cross_origin
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from dotenv import load_dotenv
from api.models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

load_dotenv() # cargar las variables de entorno

app = Flask(__name__)


app.config['DEBUG'] = True # Permite ver los errores
app.config['ENV'] = 'development' # Activa el servidor en modo desarrollo
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASEURI') # Leemos la url de conexion a la base de datos
app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY')
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")


db.init_app(app)
Migrate(app, db) # db init, db migrate, db upgrade, db downgrade
jwt = JWTManager(app)
CORS(app)

@app.route('/')
def main():
    return jsonify({ "status": "Server Up"}), 200

@app.route('/api/login', methods=['POST'])
@cross_origin(origin='http://127.0.0.1:3001', supports_credentials=True)
def login():
    username = request.json.get("username") # None
    password = request.json.get("password") # None
    
    if not username:
        return jsonify({ "error": "Username es obligatorio"}), 400
    
    if not password:
        return jsonify({ "error": "Password es obligatorio"}), 400
    
    userFound = User.query.filter_by(username=username).first()
    
    if not userFound:
        return jsonify({ "error": "username/password son incorrectos!!"}), 401
    
    if not check_password_hash(userFound.password, password):
        return jsonify({ "error": "username/password son incorrectos!!"}), 401
    
    expires = datetime.timedelta(days=3)
    access_token = create_access_token(identity=userFound.id, expires_delta=expires)
    
    data = {
        "access_token": access_token,
        "user": userFound.serialize()
    }
    
    return  jsonify(data), 200
@app.route('/api/register', methods=['POST'])
def register():
    try:
        username = request.json.get("username")
        password = request.json.get("password")

        if not username or not password:
            return jsonify({ "error": "Username y password son obligatorios"}), 400

        # Verificar si el usuario ya existe
        user_found = User.query.filter_by(username=username).first()
        if user_found:
            return jsonify({ "error": "El nombre de usuario ya existe"}), 400

        # Crear un nuevo usuario
        new_user = User(username=username, password=generate_password_hash(password))
        db.session.add(new_user)
        db.session.commit()

        # Generar token de acceso para el nuevo usuario
        expires = datetime.timedelta(days=3)
        access_token = create_access_token(identity=new_user.id, expires_delta=expires)

        data = {
            "access_token": access_token,
            "user": new_user.serialize()
        }

        return jsonify(data), 200

    except Exception as e:
        print(f"Error en el registro: {str(e)}")
        return jsonify({ "error": "Error en el registro"}), 500
@app.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    
    id = get_jwt_identity()
    user = User.query.get(id)
    
    return jsonify({ "data": "Hola Mundo", "user": user.serialize() })


if __name__ == '__main__':
    app.run()