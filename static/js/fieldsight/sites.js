var Sites =function (data){
  var self = this;
  var id = ko.observable();
}



function SitesViewModel() {
  var self=this;
  self.site_list = ko.observableArray();
  self.site_modal_visibility = ko.observable(false);

  self.add_site = function(){
    alert("called");
    self.site_modal_visibility(true);
  };

};

