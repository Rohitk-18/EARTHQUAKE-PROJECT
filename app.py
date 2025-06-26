from flask import Flask, render_template
import requests
from datetime import datetime
app = Flask(__name__)

@app.route('/')
def index():
    url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

    try:
        res = requests.get(url, timeout=10)
        res.raise_for_status()
        data = res.json()
    except requests.exceptions.RequestException as e:
        print("Error fetching data:", e)
        return render_template("index.html", data=[], max_quake=None)

    
    quakes = []
    for feature in data["features"]:
        quake = {
            "location": feature["properties"]["place"],
            "magnitude": feature["properties"]["mag"],
            "time": feature["properties"]["time"], 
            "latitude": feature["geometry"]["coordinates"][1],
            "longitude": feature["geometry"]["coordinates"][0]
        }
        quakes.append(quake)
    
    quakes.sort(key=lambda x: x["time"], reverse=True)

    max_quake = max(quakes, key=lambda x: x["magnitude"])
    for quake in quakes:
        quake["formatted_time"] = datetime.utcfromtimestamp(quake["time"] / 1000).strftime("%d/%m/%Y, %H:%M:%S")

    max_quake["formatted_time"] = datetime.utcfromtimestamp(max_quake["time"] / 1000).strftime("%d/%m/%Y, %H:%M:%S")
    print("==== Top 15 Quakes ====")
    for quake in quakes[:15]:
        print(quake)

    return render_template("index.html", data=quakes[0:15], max_quake=max_quake)

if __name__ == '__main__':
    app.run(debug=True)
