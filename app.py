from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/")
def health_check():
    """
    Simple endpoint to represent this Reading Assessment project.
    In the React app, all the main logic lives on the frontend and Supabase,
    so here we just return a status message.
    """
    return jsonify(
        {
            "status": "ok",
            "message": "Reading Assessment Dashboard backend placeholder",
            "details": "React frontend talks directly to Supabase; this Flask app just exposes a health endpoint.",
        }
    )


if __name__ == "__main__":
    # Run on the requested port 6967, accessible from anywhere
    app.run(host="0.0.0.0", port=6967)


