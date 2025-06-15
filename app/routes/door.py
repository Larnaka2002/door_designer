from flask import Blueprint, render_template

door_bp = Blueprint("door", __name__)

@door_bp.route("/designer")
def designer():
    return render_template("door/designer.html")
