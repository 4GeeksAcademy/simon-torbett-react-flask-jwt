"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    user = User.query.filter_by(username=username).first()
    if not user: return jsonify({ "status": "fail", "message": "username/password incorrect!"}), 401
    if not check_password_hash(user.password, password): return jsonify({ "status": "fail", "message": "username/password incorrect!"}), 401

    expires = datetime.timedelta(minutes=3)
    acccess_token = create_access_token(identity=user.id, expires_delta=expires)

    data = {
        "status": "success",
        "message": "Login successfully!",
        "access_token": acccess_token,
        "user": user.serialize()
    }

    return jsonify(data), 200
    


@api.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')

    user = User()
    user.username = username
    user.password = generate_password_hash(password)
    user.save()

    return jsonify({ "status": "success", "message": "Register successfully. Please login!"}), 200


@api.route('/users', methods=['GET'])
def all_users():
    users = User.query.all()
    users = list(map(lambda user: user.serialize(), users))
    return jsonify(users), 200


@api.route('/users/<int:user_id>/follow/<int:id>', methods=['GET'])
def follow_users(user_id, id):
    
    user = User.query.get(user_id)
    
    follow = Follower()
    follow.followed_id = id

    user.follows.append(follow)
    user.update()

    return jsonify({ "msg": "usuario seguido con exito"}), 200

@api.route('/users/<int:user_id>/role/<int:id>/add', methods=['GET'])
def add_role_users(user_id, id):
    
    user = User.query.get(user_id)
    
    role = Role.query.get(id)

    user.roles.append(role)
    user.update()

    return jsonify({ "msg": "Role asignado con exito"}), 200

@api.route('/users/<int:user_id>/role/<int:id>/remove', methods=['GET'])
def remove_role_users(user_id, id):
    
    user = User.query.get(user_id)
    
    role = Role.query.get(id)

    user.roles.remove(role)
    user.update()

    return jsonify({ "msg": "Role asignado con exito"}), 200



@api.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    id = get_jwt_identity()
    user = User.query.get(id)
    return jsonify(user.serialize()), 200