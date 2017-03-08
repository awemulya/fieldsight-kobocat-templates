$(document).ready(function() {
 vm = new SitesViewModel();
 ko.applyBindings(vm);
});

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
if(dd<10){dd='0'+dd}
if(mm<10){mm='0'+mm}
today = yyyy+'-'+mm+'-'+dd;
var lastdate = yyyy+'-'+mm+'-'+'01';



var Sites=function (data){
  console.log("called")

  var self=this;

  for (var i in data){
    self[i] = ko.observable(data[i]);
              }
  console.log(data);
  self.url= ko.observable("/fieldsight/fieldsight-dashboard/"+self.id+"/");
}


var Type=function (data){
  var self=this;
  for (var i in data){
    self[i] = data[i];
  }
}



function SitesViewModel() {
var self=this;
self.site_list = ko.observableArray(site_list);

self.table_vm = ko.observable();

self.sitelist = function(){

  if(self.sitenamesearch){

    var new_list = [];
    
    for (var i=0; i<self.sitelist().length; i++){
      
     
               new_list.push(self.sites_list()[i]);

    }

  }

 self.table_vm(new TableViewModel({rows: new_list}, Sites));

    return new_list;

}

self.sitelist();
if (self.sitenamesearch !=undefined){
self.sitenamesearch.subscribe(self.sitelist);
}
};