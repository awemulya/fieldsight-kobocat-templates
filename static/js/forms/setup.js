var FieldSightXF = function (data){
  self = this;
  self.id = ko.observable();
  self.xf = ko.observable();
  self.is_staged = ko.observable(false);
  self.type = ko.observable();
  self.is_scheduled = ko.observable(false);
  self.schedule = ko.observable();
  self.stage = ko.observable();
  self.form_status = ko.observable();
  self.fsform = ko.observable();
  self.is_deployed = ko.observable(false);

  self.save = function(){
    vm.site_modal_visibility(false);
  };
  
  for (var i in data){
    self[i] = ko.observable(data[i]);
              }
  self.url= ko.observable("/fieldsight/site-dashboard/"+self.id()+"/");

  self.mapOne = ko.observable({
        lat: ko.observable(27.714875814507074),
        lng: ko.observable(85.3243088722229)});
}

var GeneralVM = function(is_project, pk){
  var self = this;
  self.pk = pk;
  self.is_project = is_project;
  self.label = "General";
}


function SetUpViewModel(is_project, pk) {
  var self = this;
  self.is_project = (is_project === '0') ? false : true;
  self.pk = pk;
  self.currentVm = ko.observable("general");
  self.generalVm = ko.observable();
  self.schedulesVm = ko.observable();
  self.stagesVm = ko.observable();
  self.generalVm(new GeneralVM(is_project, pk));

  self.setSelectedVm = function(selected){
    self.currentVm(selected);
    };

  
  self.currentVm.subscribe(function (newValue) {
    if(newValue == "general" ) {
        
    } else if (newValue == "schedules") {
      self.schedulesVm(new GeneralVM(is_project, "schedules"));

    }else if (newValue == "stages") {
      self.stagesVm(new GeneralVM(is_project, "stages"));

    }
    });

};




