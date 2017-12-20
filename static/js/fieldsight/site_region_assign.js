function assigntoken(csrf){
  csrf_token=csrf;
  
}
var Region =function (data, project){
  self = this;
  self.id = ko.observable();
  self.name = ko.observable();
  self.identifier = ko.observable();
  self.selected = ko.observable(false);
  for (var i in data){
    self[i] = ko.observable(data[i]);
      }
  self.url= ko.observable("/fieldsight/project/"+ project +"/regional-sites/"+self.id()+"/");
}



var Site = function(data){
  var self = this;
   
  self.id = ko.observable();
  self.type_label = ko.observable();
  self.name = ko.observable();
  self.identifier = ko.observable();
  self.type = ko.observable();
  self.region = ko.observable();
  self.selected = ko.observable(false);

  for (var i in data){
    self[i] = ko.observable(data[i]);
      }   
}



function RegionViewModel(next_url_region, next_url_site, project) {
  var self=this;
  self.allRegions = ko.observableArray();
  self.regions = ko.observableArray();
  self.next_page_region = ko.observable();
  self.prev_page_region = ko.observable();
  self.next_page_region = next_url_region;
  self.all_selected_regions = ko.observableArray();
  self.search_key_region = ko.observable();
  self.show_next_page_region = ko.observable(false);
  self.all_selected_regions([]);
  
function loadRegion(url){
    App.showProcessing();
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            // data: post_data,
            // async: true,
            success: function (response) {
                App.hideProcessing();
               var mappedData = ko.utils.arrayMap(response.results, function(item) {
                        datas = new Region(item, project);
                        return datas;
                    });
                self.allRegions.push.apply(self.allRegions, mappedData);
                self.regions.push.apply(self.regions, mappedData);
                self.next_page_region = response.next;
                if (self.next_page_region != null){ self.show_next_page_region(true); }
                self.prev_page_region = response.previous;
              },
            error: function (errorThrown) {
                App.hideProcessing();
                console.log(errorThrown);
            }
        });
  };

  self.loadMoreRegions = function(){
    loadRegion(self.show_next_page_region());
  }; 

  loadRegion(self.next_page_region);

  self.setRegionSelected = function(selected_region){


    if (self.all_selected_regions.indexOf(selected_region) < 0) {
      self.all_selected_regions([]);
      ko.utils.arrayForEach(self.regions(), function(region) {
      if(region.id() != selected_region.id()){ 
      

      self.all_selected_regions.push(selected_region);
      console.log(self.all_selected_regions()); 
      region.selected(false);
      
      }
      });


        
  }else{
    self.all_selected_regions.remove(selected_region);
    
  }
        console.log(self.all_selected_regions());
        return true;
  };


    
 

  self.setAllRegionUnSelected = function(region){
   
   ko.utils.arrayForEach(self.regions(), function(region) {

   region.selected(false);
   // console.log(regions.selected());
   // console.log(all_selected_users());
    });   
    self.all_selected_regions([]);
   
  };    
   

  self.search_key_region.subscribe(function (newValue) {

    if (!newValue) {
        self.regions(self.allRegions());
    } else {
      newValue = newValue.toLowerCase();
        filter_regions = ko.utils.arrayFilter(self.allRegions(), function(item) {
            return (ko.utils.stringStartsWith(item.name().toLowerCase(), newValue) || 
              ko.utils.stringStartsWith(item.identifier().toLowerCase(), newValue));
        });
        self.regions(filter_regions);
    }
    });


  self.allSites = ko.observableArray();
  self.sites = ko.observableArray([]);
  self.next_page_site = ko.observable();
  self.prev_page_site = ko.observable();
  self.next_page_site = next_url_site;
  self.all_selected_sites = ko.observableArray();
  self.search_key_site = ko.observable();
  self.show_next_page_site = ko.observable(false);
  self.all_selected_sites([]);
  function loadSites(url){
    App.showProcessing();
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            // data: post_data,
            // async: true,
            success: function (response) {
                App.hideProcessing();
               var mappedData = ko.utils.arrayMap(response.results, function(item) {
                        datas = new Site(item);
                        return datas;
                    });
                self.allSites.push.apply(self.allSites, mappedData);
                self.sites.push.apply(self.sites, mappedData);
                self.next_page_site = response.next;
                self.prev_page_site = response.previous;
                
                if (self.next_page_site != null){ self.show_next_page_site(true); }
                self.prev_page_site = response.next;
                
            },
            error: function (errorThrown) {
                App.hideProcessing();
                console.log(errorThrown);
            }
        });
  };

  self.loadMoreSites = function(){
    loadSites(self.next_page_site);
    console.log(self.sites())
  };

  loadSites(self.next_page_site);

  self.setSiteSelected = function(site){
   if (self.all_selected_sites.indexOf(site) < 0) {
    self.all_selected_sites.push(site);
        
  }else{
    self.all_selected_sites.remove(site);
    
  }
        console.log(self.all_selected_sites());
        return true;
  };

  self.setAllSiteUnSelected = function(site){
   // console.log(self.alluserid());
   ko.utils.arrayForEach(self.sites(), function(site) {

   site.selected(false);
   // console.log(site.selected());
   // console.log(all_selected_users());
    });   
    self.all_selected_sites([]);
   
  };    

  
  self.search_key_site.subscribe(function (newValue) {
    if (!newValue) {
        self.sites(self.allSites());
    } else {
      newValue = newValue.toLowerCase();
        filter_sites = ko.utils.arrayFilter(self.allSites(), function(item) {
            return (ko.utils.stringStartsWith(item.name().toLowerCase(), newValue) || 
              ko.utils.stringStartsWith(item.identifier().toLowerCase(), newValue));
        });
        self.sites(filter_sites);
    }
    });

  



  self.data = ko.observable();
  self.doAssign = function(){
    App.showProcessing();
    
    self.data({'region':[], 'sites':[]});
    
    if(self.all_selected_regions().length == 0 || self.all_selected_sites().length == 0){ alert("Please select atleast 1 site and 1 Region to assign to."); App.hideProcessing();return false;}
    // if(self.all_selected_sites().length == 0){ alert("Please select atleast 1 site and 1 Region to assign to."); App.hideProcessing();return false;}
    
    ko.utils.arrayMap(self.all_selected_sites(), function(item) {
                    console.log(item.id());
                    self.data().sites.push(item.id);
                    });
    

    
    ko.utils.arrayMap(self.all_selected_regions(), function(item) {
                    console.log(item.id());
                    self.data().region.push(item.id);
                    });

    var url = "";
    console.log(ko.toJS(self.data()))
    

    var success =  function (response) {
                App.hideProcessing();

                App.notifyUser(
                        'Sites Assigned.',
                        'success'
                    );

            };
                App.hideProcessing();
   
    var failure =  function (errorThrown) {
      var err_message = errorThrown.responseJSON[0];
                App.notifyUser(
                        err_message,
                        'error'
                    );

            };
          console.log(csrf_token);
       App.remotePost(url, ko.toJS(self.data()), success, failure);  
};


self.unAssign = function(){
    App.showProcessing();
    
    self.data({'region':[], 'sites':[]});
    
   
    if(self.all_selected_sites().length == 0){ alert("Please select atleast 1 site to Unassign from Region."); App.hideProcessing();return false;}
    // if(self.all_selected_sites().length == 0){ alert("Please select atleast 1 site and 1 Region to assign to."); App.hideProcessing();return false;}
    
    ko.utils.arrayMap(self.all_selected_sites(), function(item) {
                    console.log(item.id());
                    self.data().sites.push(item.id);
                    });
    


    var url = "";
    console.log(ko.toJS(self.data()))
    

    var success =  function (response) {
                App.hideProcessing();

                App.notifyUser(
                        'Sites UnAssigned.',
                        'success'
                    );

            };
                App.hideProcessing();
   
    var failure =  function (errorThrown) {
      var err_message = errorThrown.responseJSON[0];
                App.notifyUser(
                        err_message,
                        'error'
                    );

            };
          console.log(csrf_token);
       App.remotePost(url, ko.toJS(self.data()), success, failure);  
};

};
