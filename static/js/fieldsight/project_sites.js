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
  self.mapOne = ko.observable();

  self.save = function(){
    vm.site_modal_visibility(false);
  };
  for (var i in data){
    val = data[i] || "";
    clean_val = val == "undefined" ? "" :val;
    self[i] = ko.observable(val);
              }
  self.url= ko.observable("/fieldsight/site-dashboard/"+self.id()+"/");

  self.mapOne({'lat':ko.observable(self.latitude()),'lng':ko.observable(self.longitude())});


  // self.type(new SiteType({'id':self.type().id,'name':self.type().name}));
}



function SitesViewModel(project) {
  var self=this;
  self.project = project;
  self.allSites = ko.observableArray();
  self.sites = ko.observableArray();
  self.typeList = ko.observableArray();

  self.upload_file = ko.observable()

  self.modal_visibility = ko.observable(false);

  self.loadSites = function(){
    App.showProcessing();
        $.ajax({
            url: '/fieldsight/api/project-sites/'+self.project+'/',
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


  self.loadSites();

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

  self.bulkUpload = function(){
      self.modal_visibility(true);

  };


self.save_file_acync = function(){
    App.showProcessing();
    var url = '/fieldsight/api/bulk_upload_site/'+self.project+'/';

    var success =  function (response) {
    self.modal_visibility(false);
      self.loadSites();
                App.hideProcessing();
                
                App.notifyUser(
                        'Sites Bulk Upload Sucess',
                        'success'
                    );

            };
    var failure =  function (errorThrown) {
      var err_message = errorThrown.responseJSON.file;
                App.hideProcessing();
                App.notifyUser(
                        err_message,
                        'error'
                    );

            };

            var formdata = new FormData();
            formdata.append('file', self.upload_file());
    App.remoteMultipartPost(url, formdata, success, failure);                                                                                                                    
  
  };


self.save_site_async = function(){
    App.showProcessing();
    var url = '/fieldsight/api/async_save_site/';

    var success =  function (response) {
    self.site_add_visibility(false);
    self.current_site("");
      self.loadSites();
                App.hideProcessing();
                
                App.notifyUser(
                        'Site Creation Sucess',
                        'success'
                    );

            };
    var failure =  function (errorThrown) {
      var err_message = errorThrown.responseJSON.error;
                App.hideProcessing();
                App.notifyUser(
                        err_message,
                        'error'
                    );

            };

            var formdata = new FormData();
            formdata.append('id', self.current_site().id());
            formdata.append('logo', self.current_site().logo());
            formdata.append('identifier', self.current_site().identifier());
            formdata.append('name', self.current_site().name());
            formdata.append('address', self.current_site().address());
            formdata.append('phone', self.current_site().phone());
            formdata.append('is_active', self.current_site().is_active());
            formdata.append('public_desc', self.current_site().public_desc());
            formdata.append('additional_desc', self.current_site().additional_desc());
            formdata.append('type', self.current_site().type().id());
            formdata.append('project', self.project);
            formdata.append('Latitude', self.current_site().mapOne().lat());
            formdata.append('Longitude', self.current_site().mapOne().lng());
    App.remoteMultipartPost(url, formdata, success, failure);                                                                                                                    
  
  };


  self.save_upload = function(){
    // self.modal_visibility(false);
    self.save_file_acync();
  };
  
  self.search_key = ko.observable();

  self.site_add_visibility = ko.observable(false);
  self.current_site = ko.observable();

  self.addSite = function(){
    self.site_add_visibility(true);
    self.current_site(new Site({'type':self.typeList()[0], 'latitude':27.7172, 'longitude':85.3240, 'is_active':true}));
  };

  self.saveSite = function(){
    self.save_site_async();
    self.site_add_visibility(false);
  };

  self.clearSite = function(){
  self.site_add_visibility(false);
    self.current_site(undefined);
  };

  self.search_key.subscribe(function (newValue) {
    if (!newValue) {
        self.sites(self.allSites());
    } else {
      newValue = newValue.toLowerCase();
        filter_sites = ko.utils.arrayFilter(self.allSites(), function(item) {
            return (ko.utils.stringStartsWith(item.name().toLowerCase(), newValue) || 
              ko.utils.stringStartsWith(item.address().toLowerCase(), newValue));
        });
        self.sites(filter_sites);
    }
    });

};


