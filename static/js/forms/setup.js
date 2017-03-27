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
 var Xform = function (data){
   var self = this;
   self.id = ko.observable();
   self.title = ko.observable();

    for (var i in data){
        self[i] = ko.observable(data[i]);
    }
 }

var FieldSightXF = function (data){
  var self = this;
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
  var self = this;
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
    vm.scheduleVm().saveSchedule();
    vm.scheduleVm().schedule_form_modal_visibility(false);
  };
  
  for (var i in data){
    self[i] = ko.observable(data[i]);
}
}  

var SubStage = function(data){
  var self = this;
  self.id = ko.observable();
  self.name = ko.observable();
  self.description = ko.observable();
  self.xf = ko.observable();
  self.form_name = ko.observable();
  self.order = ko.observable();
  self.editable = ko.observable(false);

     for (var i in data){
      self[i] = ko.observable(data[i]);
    }

self.form_name_display = function (){
  not_xf = self.xf() || true;
  if(not_xf == true){
    return "";
  }
  if (self.xf().length <1){
    return ""
  }
      var title = "";
      ko.utils.arrayForEach(vm.stagesVm().xforms(), function(item) {
                  if (item.id() == self.xf()) {
                      title = item.title();
                      return;
                  }
              });
    return title;
  };

  self.edit = function(){
    self.editable(true);
  }
  self.edit_done = function(){
    self.editable(false);
  }
}

var Stage = function(data){
  var self = this;
  self.id = ko.observable();
  self.name = ko.observable();
  self.description = ko.observable();
  self.order = ko.observable();
  self.date_created = ko.observable();
  self.date_modified = ko.observable();
  self.site = ko.observable();
  self.project = ko.observable();
  self.parent = ko.observableArray();
  self.showmeSubstages = ko.observable(false);
  self.newSubstage = ko.observable();
  self.addSubStageMode = ko.observable(false);
  self.stageChanged = ko.observable(false);
  self.show_substages = ko.observable(false);

  self.edit = function(){
    vm.stagesVm().editSage(self);

  };

self.setShowSubstages = function(){
    if (self.show_substages() == false){
      self.show_substages(true);
      self.stageChanged(true);
    }else{
      self.show_substages(false);
      self.stageChanged(false);
    }
    if (self.newSubstage() == undefined){
      self.add_sub_stage();
    }

} 


// self.show_substages.subscribe(function(newValue) {
//   if (newValue == true ){
//     if (self.newSubstage() == undefined){
//       self.add_sub_stage();
//     }
//   }
// });

  self.add_sub_stage = function(){
    var parentLength = self.parent().length || 0;
    self.newSubstage(new SubStage({'order':parentLength+1 || 1, 'name':"",'description':"", 'xf':""}));
    self.addSubStageMode(true);
  };

  self.save_sub_stage = function(){
    var parentLength = self.parent().length || 0;
    if(self.newSubstage().name().length >0){
      if(self.newSubstage().order() == parentLength+1){
        self.parent.push(self.newSubstage());
        self.newSubstage(new SubStage({'order':parentLength+2, 'name':"",'description':"",'xf':""}));
        self.stageChanged(true);
          
        }else{

          App.notifyUser('SubStage Order Must Be '+ (parentLength+1), 'error');

        }
      
    }else{

      App.notifyUser('SubStage Name Cannot be Empty', 'error');

    }
   

  };

  self.save = function (){
      if(vm.is_project == "1"){
        self.project(vm.pk);
      }else{
        self.site(vm.pk);
      }
    vm.stagesVm().saveStage(self);
    self.stageChanged(false);
    self.addSubStageMode(false);
  };

for (var i in data){
    if(i == "parent"){
      var sub_stages = ko.utils.arrayMap(data[i], function(item) {
            return new SubStage(item);
                    });
      self.parent(sub_stages);
     
    }else{
      self[i] = ko.observable(data[i]);
    }
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
    if (self.is_project == "1"){
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


self.saveSchedule = function(){
    var url = '/forms/api/schedule/';
    var schedule = new Schedule();
    if (self.is_project == "1"){
      schedule.project = self.pk;
    }else {
      schedule.site = self.pk;
    }
      schedule.xf = self.current_form().form();
      schedule.name = self.current_form().name();
      schedule.date_range_start = self.current_form().date_range_start().toISOString().slice(0,10);
      schedule.date_range_end= self.current_form().date_range_end().toISOString().slice(0,10);
      schedule.selected_days= self.current_form().selected_days();
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
          if (item.name){
            return ko.utils.stringStartsWith(item.name.toLowerCase(), newValue);
          }else{
            return true;
          }
        });
        self.forms(filter_forms);
    }
    });

  self.getForms();
}

var StageVM = function(is_project, pk){

  var self = this;
  self.pk = pk;
  self.is_project = is_project;
  self.allStages = ko.observableArray();
  self.xforms = ko.observableArray();
  self.stages = ko.observableArray();
  self.current_stage = ko.observable();
  self.stage_form_visibility = ko.observable(false);
  self.search_key = ko.observable();
  self.addStageMode = ko.observable(true);
  self.stage_form_modal_visibility = ko.observable(false);

  self.getStages = function(){
    App.showProcessing();
        $.ajax({
            url: '/forms/api/stage/' + String(self.is_project) + '/' + String(self.pk),
            method: 'GET',
            dataType: 'json',
            // data: post_data,
            // async: true,
            success: function (response) {
                App.hideProcessing();
                  var mappedData = ko.utils.arrayMap(response, function(item) {
                      return new Stage(item);
                    });
                
                self.stages(mappedData);
                self.allStages(mappedData);

            },
            error: function (errorThrown) {
                App.hideProcessing();
                console.log(errorThrown);
            }
        });
  };
  
  self.getXforms = function(){
    App.showProcessing();
        $.ajax({
            url: '/forms/api/xf/' + String(self.is_project) + '/' + String(self.pk),
            method: 'GET',
            dataType: 'json',
            // data: post_data,
            // async: true,
            success: function (response) {
                App.hideProcessing();
                  var mappedData = ko.utils.arrayMap(response, function(item) {
                      return new Xform(item);
                    });
                
                self.xforms(mappedData);

            },
            error: function (errorThrown) {
                App.hideProcessing();
                console.log(errorThrown);
            }
        });
  };

self.add_stage = function(){
  self.addStageMode(false);
  self.current_stage(new Stage({'order':self.allStages().length+1 || 1,'parent':[]}));
  self.current_stage().setShowSubstages();
  self.stage_form_modal_visibility(true);
}

self.editSage = function(stage){
  self.current_stage(stage);
  self.current_stage().setShowSubstages();
  self.stage_form_modal_visibility(true);
}

self.saveStage = function(stage){
  var stageobj = new Stage();
  stageobj.id = stage.id();
  stageobj.name = stage.name();
  stageobj.description = stage.name();
  stageobj.order = stage.order();
  stageobj.site = stage.site();
  stageobj.project = stage.project();
  var parent = ko.utils.arrayMap(stage.parent(), function(item) {
                      sub_st = new SubStage();
                      sub_st.id = item.id();
                      sub_st.name = item.name();
                      sub_st.description = item.description();
                      sub_st.order = item.order();
                      sub_st.xf = item.xf();
                      return sub_st;
                    });
                

  stageobj.parent = parent;
 var url = '/forms/api/stage/' + String(vm.is_project) + '/' + String(vm.pk);
var success =  function (response) {
                App.hideProcessing();
                save_mode = true;
                 ko.utils.arrayForEach(self.allStages(), function(item) {
                  if (item.id() == response.id) {
                      save_mode =  false;
                      return;
                  }
              });
                  if(save_mode == true){
                    self.allStages().push(new Stage(response));
                    self.stages(self.allStages());
                    self.current_stage(new Stage({'order':self.allStages().length+1 || 1,'parent':[]}));
                    self.current_stage().setShowSubstages();
                    // self.addStageMode(true);


                  }

                App.notifyUser(
                        'Stage Form'+response.name +'Saved',
                        'success'
                    );
                self.stage_form_modal_visibility(false);

            };
    
var failure =  function (errorThrown) {
      var err_message = errorThrown.responseJSON.non_field_errors;
      if (err_message==undefined){
        err_message = "Invalid Data Check Form Data Correctly"
      }
                App.hideProcessing();
                App.notifyUser(
                        err_message,
                        'error'
                    );

            };

    App.remotePost(url, stageobj, success, failure);                                                                                                                    
  
  };



self.search_key.subscribe(function (newValue) {
    if (!newValue) {
        self.stages(self.allStages());
    } else {
        filter_stages = ko.utils.arrayFilter(self.allStages(), function(item) {
          if (item.name()){
            return ko.utils.stringStartsWith(item.name().toLowerCase(), newValue);
          }else{
            return true;
          }
        });
        self.stages(filter_stages);
    }
    });


  self.getXforms();
  self.getStages();
  // self.form_name_display = function (xf_id){
  //   if (xf_id() =="") return ""
  //   if (xf_id() == undefined) return ""
  //     alert(xf_id());
  //     var title = "";
  //     ko.utils.arrayForEach(self.xforms(), function(item) {
  //                 if (item.id() == xf_id) {
  //                     title = item.title();
  //                     return;
  //                 }
  //             });
  //   alert(title);
  //   return title;
  // }
 }


function SetUpViewModel(is_project, pk) {
  var self = this;
  self.is_project = is_project;
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
        self.stagesVm(new StageVM(is_project, pk));
      }

    }
    });

};




