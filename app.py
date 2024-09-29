from server import APP, db
import os
    
if __name__ == "__main__":
    if not os.path.exists(APP.config['DB_URL']):
        db.create_all()
    APP.run(debug=False, host='0.0.0.0', port=1000)
