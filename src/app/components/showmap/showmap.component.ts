import { Component, OnInit, AfterViewInit } from "@angular/core";
import { interval } from "rxjs";
//MAP BOX API
const mapboxgl = require("mapbox-gl");
const MapboxGeocoder = require("@mapbox/mapbox-gl-geocoder");

@Component({
  selector: "app-showmap",
  templateUrl: "./showmap.component.html",
  styleUrls: ["./showmap.component.scss"]
})
export class ShowmapComponent implements OnInit {
  map;
  geolocate;
  currentCoords = [];

  constructor() {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2VydmljZWZpbmRlci13ZWIiLCJhIjoiY2s2dXBoaHVoMGJhczNsbzNnbTh1Mjk1YyJ9.AjVFCfErae5fBJTT0o9OIw";
  }

  ngOnInit() {
    this.buildMap();
    this.locateUser();
    this.OnMapLoad();

    // check if user has location
    let checkTimer = interval(1000).subscribe(ct => {
      if (this.currentCoords.length > 0) {
        this.drawCircle();
        checkTimer.unsubscribe();
      }
    });
  }

  buildMap() {
    const tagumCoords = [125.8093, 7.4472];

    //build map
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: tagumCoords,
      zoom: 15
    });

    //set geocoder
    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    });

    document.getElementById("geocoder").appendChild(geocoder.onAdd(this.map));

    //set marker
    var marker = new mapboxgl.Marker().setLngLat(tagumCoords).addTo(this.map);
  }

  locateUser() {
    // geolocate
    this.geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showAccuracyRadius: true
    });

    this.map.addControl(this.geolocate, "bottom-right");
  }

  OnMapLoad() {
    // //draw circle
    // const draw = new MapboxDraw({

    // })

    this.map.on("load", e => {
      //redraw
      document.getElementById("overlay").hidden = true;
      this.map.resize();

      //locate user
      this.geolocate.trigger();
    });

    this.geolocate.on("geolocate", g => {
      this.currentCoords[0] = g.coords.longitude;
      this.currentCoords[1] = g.coords.latitude;
    });
  }

  drawCircle() {
    console.log(this.currentCoords);
    this.map.addSource("markers", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: this.currentCoords
            }
          }
        ]
      }
    });
    this.map.addLayer({
      id: "circles1",
      source: "markers",
      type: "circle",
      paint: {
        "circle-radius": 50,
        "circle-color": "#007cbf",
        "circle-opacity": 0.5,
        "circle-stroke-width": 0
      }
    });
  }
}
