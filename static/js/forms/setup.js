function formatDate(date) {
    var d = new Date(date || Date.now()),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

   return [year, month,day ].join('-');
 }

 function deployStatus(flag){
  return (flag == true) ? "Deployed" : "Not Deployed";
 }

 function formStatus(flag){
  if (flag == 0) return "Outstanding"
  if (flag == 1) return "Rejected"
  if (flag == 2) return "Flagged"
  if (flag == 3) return "Approved"

  }
 

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
    // vm.generalVm.general_form_modal_visibility(false);
    alert(self.xf());
  };
  
  for (var i in data){
    self[i] = ko.observable(data[i]);
              }
  self.url= ko.observable("/fieldsight/site-dashboard/"+self.id()+"/");

}

var GeneralVM = function(is_project, pk){
  var self = this;
  self.pk = pk;
  self.is_project = is_project;
  self.label = "General";
  self.forms = ko.observableArray();
  self.current_form = ko.observable();
  self.general_form_modal_visibility = ko.observable(false);

  self.add_form = function(){
    self.current_form(new FieldSightXF());
    self.general_form_modal_visibility(true);
  };

  self.getGeneralForms = function(){
    App.showProcessing();
        $.ajax({
            url: '/forms/api/general/' + String(self.is_project) + '/' + String(self.pk),
            method: 'GET',
            dataType: 'json',
            // data: post_data,
            // async: true,
            success: function (response) {
                App.hideProcessing();
                self.forms(response);

            },
            error: function (errorThrown) {
                App.hideProcessing();
                console.log(errorThrown);
            }
        });
  };

  self.getGeneralForms();
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




