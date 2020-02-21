//MAP BOX API
import { Component, OnInit, AfterViewInit } from "@angular/core";
const mapboxgl = require("mapbox-gl");

//GEOLOCATION
import { Plugins } from "@capacitor/core";
const { Geolocation } = Plugins;

@Component({
  selector: "app-showmap",
  templateUrl: "./showmap.component.html",
  styleUrls: ["./showmap.component.scss"]
})
export class ShowmapComponent implements OnInit {
  map;
  currentCoords;

  watchCoords = [];

  constructor() {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2VydmljZWZpbmRlci13ZWIiLCJhIjoiY2s2dXBoaHVoMGJhczNsbzNnbTh1Mjk1YyJ9.AjVFCfErae5fBJTT0o9OIw";
  }

  ngOnInit() {
    this.buildMap();
  }

  buildMap() {
    //get user location
    this.getUserLocation().then(() => {
      const tagumCoords = [125.8093, 7.4472]; //LngLat
      const userCoords = [];

      // check kung naa ba sa tagum basin nalapas HAHA
      userCoords[0] =
        this.currentCoords.coords.longitude < tagumCoords[0]
          ? tagumCoords[0]
          : this.currentCoords.coords.longitude;

      userCoords[1] =
        this.currentCoords.coords.latitude > tagumCoords[1]
          ? tagumCoords[1]
          : this.currentCoords.coords.latitude;

      //build map
      this.map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: userCoords,
        zoom: 15
      });

      //set marker
      var marker = new mapboxgl.Marker().setLngLat(userCoords).addTo(this.map);

      //redraw
      this.map.on("load", e => {
        document.getElementById("overlay").hidden = true;
        this.map.resize();
      });
    });

    this.watchLocation();
  }

  async getUserLocation() {
    this.currentCoords = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true
    });
    console.log(this.currentCoords);
  }

  watchLocation() {
    const wait = Geolocation.watchPosition({}, (position, err) => {
      this.watchCoords[0] = position.coords.longitude;
      this.watchCoords[1] = position.coords.latitude;
    });
  }
}
