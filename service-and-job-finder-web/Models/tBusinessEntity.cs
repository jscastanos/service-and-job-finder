//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace service_and_job_finder_web.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class tBusinessEntity
    {
        public int recNo { get; set; }
        public string EntityId { get; set; }
        public string UserId { get; set; }
        public string BusinessEntityName { get; set; }
        public string BusinessEntityAddress { get; set; }
        public string About { get; set; }
        public string ContactNo { get; set; }
        public Nullable<double> Latitude { get; set; }
        public Nullable<double> Longitude { get; set; }
        public byte[] ProfileImg { get; set; }
        public Nullable<System.DateTime> DateCreated { get; set; }
        public Nullable<System.DateTime> DateUpdated { get; set; }
        public int Status { get; set; }
    }
}
