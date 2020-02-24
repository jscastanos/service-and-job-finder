import { Component, OnInit, AfterViewInit } from "@angular/core";
import { interval } from "rxjs";
import { GeoDataService } from "src/app/services/geo-data.service";
import { NavController } from "@ionic/angular";
import { get, set } from "../../services/storage.service";

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
  localGeoData;
  currentServices = {
    title: null,
    description: null,
    id: null
  };

  //api
  geodata;

  constructor(private nav: NavController, private geoService: GeoDataService) {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2VydmljZWZpbmRlci13ZWIiLCJhIjoiY2s2dXBoaHVoMGJhczNsbzNnbTh1Mjk1YyJ9.AjVFCfErae5fBJTT0o9OIw";
  }

  ngOnInit() {
    this.buildMap();
    this.locateUser();
    this.OnMapLoad();

    // check if user has location then draw a circle
    let checkTimer = interval(1000).subscribe(ct => {
      if (this.currentCoords.length > 0) {
        this.drawCircle();
        checkTimer.unsubscribe();

        this.loadGeoData();
      }
    });
  }

  async loadGeoData() {
    this.geodata = await this.geoService
      .GetLocalGeoData(this.currentCoords[1], this.currentCoords[0])
      .subscribe(res => {
        this.localGeoData = res;

        //setup markers
        this.drawMarkers();

        //add text layer
        this.map.addSource("places", {
          type: "geojson",
          data: res
        });

        this.map.addLayer({
          id: "name-place",
          type: "symbol",
          source: "places",
          layout: {
            "text-field": ["get", "title"],
            "text-variable-anchor": ["top", "bottom", "left", "right"],
            "text-justify": "auto"
          }
        });

        function forwardGeocoder(query) {
          var matchingFeatures = [];
          for (var i = 0; i < res["features"].length; i++) {
            var feature = res["features"][i];
            if (
              feature.properties.title
                .toLowerCase()
                .search(query.toLowerCase()) !== -1
            ) {
              feature["place_name"] = feature.properties.title;
              feature["center"] = feature.geometry.coordinates;
              matchingFeatures.push(feature);
            }
          }
          return matchingFeatures;
        }

        //set geocoder
        var geocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
          placeholder: "Search for services",
          localGeocoderOnly: true,
          localGeocoder: forwardGeocoder,
          marker: false
        });

        document
          .getElementById("geocoder")
          .appendChild(geocoder.onAdd(this.map));
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
  }

  locateUser() {
    // geolocate
    this.geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showAccuracyRadius: true,
      fitBounds: {
        maxZoom: 15
      }
    });

    this.map.addControl(this.geolocate, "bottom-right");
  }

  OnMapLoad() {
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

      set("LngLat", this.currentCoords);
    });
  }

  drawCircle() {
    const metersToPixelsAtMaxZoom = (meters, latitude) =>
      meters / 0.075 / Math.cos((latitude * Math.PI) / 180);

    this.map.addSource("circle_radius", {
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
      id: "within",
      source: "circle_radius",
      type: "circle",
      paint: {
        "circle-radius": {
          stops: [
            [0, 0],
            [20, metersToPixelsAtMaxZoom(3000, this.currentCoords[1])]
          ],
          base: 2
        },
        "circle-color": "#007cbf",
        "circle-opacity": 0.5,
        "circle-stroke-width": 0
      }
    });
  }

  drawMarkers() {
    let marker;
    //set marker
    this.localGeoData["features"].forEach(e => {
      marker = new mapboxgl.Marker()
        .setLngLat(e.geometry.coordinates)
        .addTo(this.map);

      marker.getElement().addEventListener("click", () => {
        this.currentServices = {
          title: e.properties.title,
          description: e.properties.description,
          id: e.properties.id
        };
      });
    });
  }

  navigate() {
    this.nav.navigateForward("/service-profile?id=" + this.currentServices.id);
    this.closeDetails();
  }

  closeDetails() {
    this.currentServices = {
      title: null,
      description: null,
      id: null
    };
  }
}
