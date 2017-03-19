var today = new Date().toISOString().slice(0,10);

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
    vm.generalVm().saveGeneralForm(self.xf())
    vm.generalVm().general_form_modal_visibility(false);
  };
  
  for (var i in data){
    self[i] = ko.observable(data[i]);
              }
  self.url= ko.observable("/fieldsight/site-dashboard/"+self.id()+"/");

}

var Schedule = function (data){
  self = this;
  self.id = ko.observable();
  self.name = ko.observable();
  self.form = ko.observable();
  self.date_range_start = ko.observable(new Date())
  self.date_range_end = ko.observable(new Date())
  self.selected_days = ko.observableArray();
  self.form_status = ko.observable();
  self.is_deployed = ko.observable(false);
  self.site = ko.observable();
  self.project = ko.observable();

  self.save = function(){
    vm.scheduleVm().saveSchedule(self);
    vm.generalVm().general_form_modal_visibility(false);
  };
  
  for (var i in data){
    self[i] = ko.observable(data[i]);
}

}  


var GeneralVM = function(is_project, pk){
  var self = this;
  self.pk = pk;
  self.is_project = is_project;
  self.label = "General";
  self.allGForms = ko.observableArray();
  self.forms = ko.observableArray();
  self.current_form = ko.observable();
  self.general_form_modal_visibility = ko.observable(false);
  self.search_key = ko.observable();

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
                self.allGForms(response);

            },
            error: function (errorThrown) {
                App.hideProcessing();
                console.log(errorThrown);
            }
        });
  };


  self.saveGeneralForm = function(xf){
    var url = '/forms/api/fxf/';
    var fxf = new FieldSightXF();
    fxf.xf = xf;
    if (self.is_project == true){
      fxf.project = self.pk;
    }else {
      fxf.site = self.pk;
    }

    var success =  function (response) {
                App.hideProcessing();
                self.allGForms().unshift(response);
                self.forms(self.allGForms());

                App.notifyUser(
                        'General Form'+response.name +'Created',
                        'success'
                    );

            };
    var failure =  function (errorThrown) {
      var err_message = errorThrown.responseJSON.non_field_errors;
                App.hideProcessing();
                App.notifyUser(
                        err_message,
                        'error'
                    );

            };

    App.remotePost(url, fxf, success, failure);                                                                                                                    
  
  };

  self.getGeneralForms();

    self.search_key.subscribe(function (newValue) {
    if (!newValue) {
        self.forms(self.allGForms());
    } else {
        filter_forms = ko.utils.arrayFilter(self.allGForms(), function(item) {
            return ko.utils.stringStartsWith(item.name.toLowerCase(), newValue);
        });
        self.forms(filter_forms);
    }
    });
}
var ScheduleVM = function(is_project, pk){
  var self = this;
  self.pk = pk;
  self.is_project = is_project;
  self.label = "Schedules";
  self.allForms = ko.observableArray();
  self.forms = ko.observableArray();
  self.current_form = ko.observable();
  self.schedule_form_modal_visibility = ko.observable(false);
  self.search_key = ko.observable();
  self.days = ko.observableArray();


  self.getDays = function(){
    App.showProcessing();
        $.ajax({
            url: '/forms/api/days/',
            method: 'GET',
            dataType: 'json',
            // data: post_data,
            // async: true,
            success: function (response) {
                App.hideProcessing();
                self.days(response);

            },
            error: function (errorThrown) {
                App.hideProcessing();
                console.log(errorThrown);
            }
        });
  };


    self.saveSchedule = function(schedule){
    var url = '/forms/api/schedule/';
    if (self.is_project == true){
      schedule.project = self.pk;
    }else {
      schedule.site = self.pk;
    }

    var success =  function (response) {
                App.hideProcessing();
                self.allForms().unshift(response);
                self.forms(self.allForms());

                App.notifyUser(
                        'Schedule Form'+response.name +'Created',
                        'success'
                    );

            };
    var failure =  function (errorThrown) {
      var err_message = errorThrown.responseJSON.non_field_errors;
                App.hideProcessing();
                App.notifyUser(
                        err_message,
                        'error'
                    );

            };

    App.remotePost(url, schedule, success, failure);                                                                                                                    
  
  };

  self.getForms = function(){
    App.showProcessing();
        $.ajax({
            url: '/forms/api/schedules/' + String(self.is_project) + '/' + String(self.pk),
            method: 'GET',
            dataType: 'json',
            // data: post_data,
            // async: true,
            success: function (response) {
                App.hideProcessing();
                self.forms(response);
                self.allForms(response);

            },
            error: function (errorThrown) {
                App.hideProcessing();
                console.log(errorThrown);
            }
        });
  };

  self.add_form = function(){
    self.getDays();
    self.current_form(new Schedule());
    self.schedule_form_modal_visibility(true);
  };



self.search_key.subscribe(function (newValue) {
    if (!newValue) {
        self.forms(self.allForms());
    } else {
        filter_forms = ko.utils.arrayFilter(self.allForms(), function(item) {
            return ko.utils.stringStartsWith(item.name.toLowerCase(), newValue);
        });
        self.forms(filter_forms);
    }
    });

  self.getForms();
}


function SetUpViewModel(is_project, pk) {
  var self = this;
  self.is_project = (is_project === '0') ? false : true;
  self.pk = pk;
  self.currentVm = ko.observable("general");
  self.generalVm = ko.observable();
  self.scheduleVm = ko.observable();
  self.stagesVm = ko.observable();
  self.generalVm(new GeneralVM(is_project, pk));

  self.setSelectedVm = function(selected){
    self.currentVm(selected);
    };

  
  self.currentVm.subscribe(function (newValue) {
    if(newValue == "general" ) {
      if (ko.utils.unwrapObservable(self.generalVm()) == null){
        self.generalVm(new GeneralVM(is_project, pk));
      }
        
    } else if (newValue == "schedules") {
      if (ko.utils.unwrapObservable(self.scheduleVm()) == null){
        self.scheduleVm(new ScheduleVM(is_project, pk));
      }

    }else if (newValue == "stages") {
     if (ko.utils.unwrapObservable(self.stagesVm()) == null){
        self.stagesVm(new GeneralVM(is_project, pk));
      }

    }
    });

};




