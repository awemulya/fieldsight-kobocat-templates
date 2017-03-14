var Site =function (data){
  self = this;
  self.id = ko.observable();
  self.identifier = ko.observable();
  self.name = ko.observable();
  self.type = ko.observable();
  self.address = ko.observable();
  self.phone = ko.observable();
  self.public_desc = ko.observable();
  self.additional_desc = ko.observable();
  self.project = ko.observable();
  self.logo = ko.observable();
  self.is_active = ko.observable();
  self.location = ko.observable();

  self.save = function(){
    vm.site_modal_visibility(false);
  };
  for (var i in data){
    self[i] = ko.observable(data[i]);
              }
  self.url= ko.observable("/fieldsight/site-dashboard/"+self.id()+"/");
}



function SitesViewModel(sites) {
  var self=this;
  var mappedData = ko.utils.arrayMap(sites, function(item) {
    item.fields.id = item.pk;
    return new Site(item.fields);
});
  self.search_key = ko.observable();

  self.sites = ko.observableArray(mappedData);
  self.site_modal_visibility = ko.observable(false);
  self.current_site = ko.observable();

  self.add_site = function(){
    self.current_site(new Site());
    self.site_modal_visibility(true);
  };

  self.search_key.subscribe(function (newValue) {
    if (!newValue) {
        self.sites(mappedData);
    } else {
        filter_sites = ko.utils.arrayFilter(mappedData, function(item) {
            return ko.utils.stringStartsWith(item.name().toLowerCase(), newValue);
        });
        self.sites(filter_sites);
    }
    var len = self.mappedData().length;
    for (var i = 0; i < len; i++) {
        self.golfers()[i].par(self.availableCourses()[self.site()].courseP);
    }
});

};


