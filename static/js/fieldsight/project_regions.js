var Region =function (data, project){
  self = this;
  self.id = ko.observable();
  self.name = ko.observable();
  self.identifier = ko.observable();
  self.get_sites_count = ko.observable();
  
  for (var i in data){
    self[i] = ko.observable(data[i]);
      }
  self.url= ko.observable("/fieldsight/project/"+ project +"/regional-sites/"+self.id()+"/");
}



function RegionViewModel(project) {
  var self=this;
  self.allRegions = ko.observableArray();
  self.regions = ko.observableArray();
  
  
  self.loadRegion = function(){
    App.showProcessing();
        $.ajax({
            url: '/fieldsight/api/project-regions/'+project+'/',
            method: 'GET',
            dataType: 'json',
            // data: post_data,
            // async: true,
            success: function (response) {
                App.hideProcessing();
                response = response.filter(r => !r.parent);
                var mappedData = ko.utils.arrayMap(response, function(item) {
                    datas = new Region(item, project);
                    return datas;
                });
                self.allRegions(mappedData);
                self.regions(mappedData);
                },
            error: function (errorThrown) {
                App.hideProcessing();
                console.log(errorThrown);
            }
        });
  };


  self.loadRegion();

  self.clearRegion = function(){
  self.region_add_visibility(false);
    self.current_region(undefined);
  };
  self.search_key = ko.observable();
  self.search_key.subscribe(function (newValue) {
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
};
