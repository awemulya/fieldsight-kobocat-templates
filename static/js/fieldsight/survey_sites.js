  var SiteType = function(data) {
  	var self = this;
        this.id = ko.observable();
        this.name = ko.observable();
    
	
	for (var i in data){
       self[i] = ko.observable(data[i]);
              }

    };

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
  self.latitude = ko.observable();
  self.longitude = ko.observable();
  self.is_survey = ko.observable();

  self.save = function(){
    vm.site_modal_visibility(false);
  };
 
  for (var i in data){
    self[i] = ko.observable(data[i]);
  }

  self.mapOne = ko.observable({
        lat: ko.observable(self.latitude()),
        lng: ko.observable(self.longitude())});
};


function SitesViewModel(project) {
  var self=this;
  self.project = project;
  self.current_site = ko.observable();
  self.site_modal_visibility = ko.observable(false);
  self.allSites = ko.observableArray();
  self.sites = ko.observableArray();
  self.typeList =  ko.observableArray();
  
  self.detail_survey = function(site){
  	self.current_site(site);
  	self.site_modal_visibility(true);
  };

  self.close_detail = function(){
  	self.site_modal_visibility(false);
  };

  self.loadSites = function(){
    App.showProcessing();
        $.ajax({
            url: '/fieldsight/api/survey-sites-review/'+self.project+'/',
            method: 'GET',
            dataType: 'json',
            // data: post_data,
            // async: true,
            success: function (response) {
                App.hideProcessing();
               var mappedData = ko.utils.arrayMap(response, function(item) {
                        return new Site(item);
                    });
                self.allSites(mappedData);

                self.sites(mappedData);

            },
            error: function (errorThrown) {
                App.hideProcessing();
                console.log(errorThrown);
            }
        });
  };

  self.loadTypes = function(){
    App.showProcessing();
        $.ajax({
            url: '/fieldsight/api/project-types/',
            method: 'GET',
            dataType: 'json',
            // data: post_data,
            // async: true,
            success: function (response) {
                App.hideProcessing();
	               var mappedTypeData = ko.utils.arrayMap(response, function(item) {
                        return new SiteType(item);
                    });

                self.typeList(mappedTypeData);

            },
            error: function (errorThrown) {
                App.hideProcessing();
                console.log(errorThrown);
            }
        });
  };


  self.loadTypes();
  self.loadSites();
  
  self.search_key = ko.observable();

  self.site_modal_visibility = ko.observable(false);
  self.current_site = ko.observable();

  self.add_site = function(){
    self.current_site(new Site());
    self.site_modal_visibility(true);
  };

  self.search_key.subscribe(function (newValue) {
    if (!newValue) {
        self.sites(self.allSites());
    } else {
        filter_sites = ko.utils.arrayFilter(self.allSites(), function(item) {
            return ko.utils.stringStartsWith(item.name().toLowerCase(), newValue);
        });
        self.sites(filter_sites);
    }
    });

};


