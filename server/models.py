from server import db

class PushSubscription(db.Model):
    __tablename__ = "PushSubscription"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    subscription_json = db.Column(db.Text, nullable=False)


class RegisteredDevice(db.Model):
    __tablename__ = "RegisteredDevice"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    token = db.Column(db.Text, nullable=False)
    device = db.Column(db.Text, nullable=False)