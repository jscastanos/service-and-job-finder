using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using service_and_job_finder_web.Models;

namespace service_and_job_finder_web.API
{
    public class GeocodeDataController : ApiController
    {
        AppWorkEntities db = new AppWorkEntities();


        public class BusinessEntityToPartialGeoData
        {
            public int recNo { get; set; }
            public string EntityId { get; set; }
            public string BusinessEntityName { get; set; }
            public string BusinessEntityAddress { get; set; }
            public double? Longitude { get; set; }
            public double? Latitude { get; set; }
            public double PointsFromOrigin { get; set; }
        }


        public class GeoJSON
        {
            public List<GeoData> features { get; set; }
            public string type { get; set; }
        }

        public class GeoData
        {
            public string type { get; set; }
            public GeoDataProperties properties { get; set; }
            public GeoDataGeometry geometry { get; set; }
        }

        public class GeoDataProperties
        {
            public int recNo { get; set; }
            public string id { get; set; }
            public string title { get; set; }
            public string description { get; set; }
        }

        public class GeoDataGeometry
        {
            public double?[] coordinates { get; set; }
            public string type { get; set; }
            public double PointsToOrigin { get; set; }
        }



        [Route("api/geocode/geojson")]
        public IHttpActionResult GetGeoJSON(double latFrom, double longFrom)
        {
            //get data
            var data = db.tBusinessEntities.Where(b => b.Status == 3).ToList();

            var partialData = new List<BusinessEntityToPartialGeoData>();

            //compute for PointToOrigin
            foreach (var d in data)
            {
                BusinessEntityToPartialGeoData betpg = new BusinessEntityToPartialGeoData();
                betpg.recNo = d.recNo;
                betpg.EntityId = d.EntityId;
                betpg.BusinessEntityName = d.BusinessEntityName;
                betpg.BusinessEntityAddress = d.BusinessEntityAddress;

                if (d.Latitude != null && d.Longitude != null)
                {
                    betpg.Latitude = d.Latitude;
                    betpg.Longitude = d.Longitude;
                    betpg.PointsFromOrigin = HaversineFormula(latFrom, longFrom, d.Latitude ?? 0, d.Longitude ?? 0);
                }

                partialData.Add(betpg);
            }

            var sortedData = partialData.OrderBy(o => o.PointsFromOrigin);

            ////generate GeoJSON
            GeoJSON geoJson = new GeoJSON();

            List<GeoData> list = new List<GeoData>();

            foreach (var d in sortedData)
            {
                GeoData geodata = new GeoData();

                geodata.type = "Feature";

                GeoDataProperties gdprop = new GeoDataProperties();
                gdprop.recNo = d.recNo;
                gdprop.id = d.EntityId;
                gdprop.title = d.BusinessEntityName;
                gdprop.description = d.BusinessEntityAddress;

                geodata.properties = gdprop;

                if (d.Latitude != null && d.Longitude != null)
                {
                    GeoDataGeometry gdgeometry = new GeoDataGeometry();

                    double?[] coords = { d.Longitude, d.Latitude };

                    gdgeometry.coordinates = coords;
                    gdgeometry.type = "Point";
                    gdgeometry.PointsToOrigin = d.PointsFromOrigin;

                    geodata.geometry = gdgeometry;
                }

                list.Add(geodata);
            }

            geoJson.features = list;
            geoJson.type = "FeatureCollection";

            return Json(geoJson);
        }

        public static double HaversineFormula(double latFrom, double longFrom, double latTo, double longTo)
        {
            const double EquatorialRaiduesOfEarth = 6371D;
            const double DegressToRadians = (Math.PI / 180D);

            var deltalat = (latTo - latFrom) * DegressToRadians;
            var deltalong = (longTo - longFrom) * DegressToRadians;

            var a = Math.Pow(
                Math.Sin(deltalat / 2D), 2D) +
                Math.Cos(latFrom * DegressToRadians) *
                Math.Cos(latTo * DegressToRadians) *
                Math.Pow(Math.Sin(deltalong / 2D), 2D);

            var c = 2D * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1D - a));

            var d = EquatorialRaiduesOfEarth * c;
            return d;

        }


    }
}
