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
  return (flag == true) ? "Undeploy" : "Deploy";
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

    // if(!self.id()){
    //   self.id(vm.stagesVm().xforms()[0].id());
    //   self.title(vm.stagesVm().xforms()[0].title());
    // }
     self.label = ko.computed(function() {
        var title = "";
        ko.utils.arrayForEach(vm.stagesVm().gxforms(), function(gxg) {
            if(gxg.id() == self.id()){

              title =  gxg.title();
            }
        });
        return title;
        console.log(self.title());
    }, self);

    //   self.label = ko.computed(function() {

    //     var selectemItem = ko.utils.arrayFirst(vm.stagesVm().gxforms(), function(gxform) {
    //       return gxform.id() == self.id()
    //     }
    // }, self);

   }

var GXform = function (data){
   var self = this;
   self.id = ko.observable();
   self.title = ko.observable();

    for (var i in data){
        self[i] = ko.observable(data[i]);
    }

   }




  var FSXform = function (data){
    
   var self = this;
   self.id = ko.observable();
   self.xf = ko.observable();

    for (var i in data){
        self[i] = ko.observable(data[i]);
    }
    if(!self.xf()){
      self.xf(vm.stagesVm().xforms()[0]);
      // self.xf(new Xform({'id':'', 'title':''}));
    }else{
    self.xf(new Xform({'id':self.xf().id, 'title':self.xf().title}));
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
  self.date_created = ko.observable();

  self.save = function(){
    vm.generalVm().saveGeneralForm(self.xf())
    vm.generalVm().general_form_modal_visibility(false);
  };
 

  for (var i in data){
    self[i] = ko.observable(data[i]);
              }
  self.url= ko.observable("/fieldsight/site-dashboard/"+self.id()+"/");

self.deploy = function(){

      if(vm.is_project =="1" && self.is_deployed() ==true){
      alert("You Cannot Undeploy Project level Forms. Preform Undeploy from Sites")
      return false;
    }else{

    vm.generalVm().deploy(self.id(), self.is_deployed());
    
    if(self.is_deployed() == true){
      self.is_deployed(false);
    }else{
      self.is_deployed(true);
    }
  }
};

self.deploy_to_remaining = function(){
    if(self.is_deployed() == false){
      alert("You Cannot Deploy To Remaining; Form is Not Deployed");
      return false;
    }else{

    vm.generalVm().deploy_to_remaining(self.id(), self.is_deployed());
  }
};

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

self.deploy = function(){

      if(vm.is_project =="1" && self.is_deployed() ==true){
      alert("You Cannot Undeploy Project level Forms. Preform Undeploy from Sites")
      return false;
    }else{

    vm.scheduleVm().deploy(self.id(), self.is_deployed());
    
    if(self.is_deployed() == true){
      self.is_deployed(false);
    }else{
      self.is_deployed(true);
    }
  }
  };
}  

var SubStage = function(data){
  var self = this;
  self.id = ko.observable();
  self.name = ko.observable();
  self.description = ko.observable();
  self.order = ko.observable();
  self.stage_forms = ko.observable();

  self.editable = ko.observable(false);

   for (var i in data){
      self[i] = ko.observable(data[i]);
    }
  if(self.stage_forms()){

  self.stage_forms(new FSXform({'id':self.stage_forms().id ,'xf':self.stage_forms().xf}));
    
  }

  self.edit = function(){
    self.editable(true);
  }
  self.edit_done = function(){
    self.editable(false);
  }
}

var SimpleStage = function(data){
  var self = this;
  self.id = ko.observable();

  for (var i in data){
    self[i] = ko.observable(data[i]);
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
      self.addSubStageMode(true);
    }else{
      self.show_substages(false);
      self.stageChanged(false);
    }
    if (self.newSubstage() == undefined){
      self.add_sub_stage();
    }

}

self.mainStageClicked = function(){
    if (self.show_substages() == false){
      self.show_substages(true);
      self.stageChanged(true)
    }else{
      self.show_substages(false);
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
    self.newSubstage(new SubStage({'order':parentLength+1 || 1, 'name':"",'description':"", 'stage_forms':{}}));
    self.addSubStageMode(true);
  };

  self.save_sub_stage = function(){
    var parentLength = self.parent().length || 0;
    if(self.newSubstage().name().length >0){
        self.parent.push(self.newSubstage());
        console.log("called");
        self.newSubstage(new SubStage({'order':parentLength+2, 'name':"",'description':"",'stage_forms':{}}));
        self.addSubStageMode(true);
        console.log("called again");
        self.stageChanged(true);
      
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
                var mappedData = ko.utils.arrayMap(response, function(item) {
                  var date_created = item.date_created.slice(0,10);
                  item.date_created = date_created;
                        return new FieldSightXF(item);
                    });
                self.forms(mappedData);

                self.allGForms(mappedData);

            },
            error: function (errorThrown) {
                App.hideProcessing();
                console.log(errorThrown);
            }
        });
  };


  self.saveGeneralForm = function(xf){
    App.showProcessing();
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
                var date_created = response.date_created.slice(0,10);
                response.date_created = date_created;
                self.allGForms().unshift(new FieldSightXF(response));
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

self.deploy = function (df_id, is_deployed){
    var fsxf = new FieldSightXF();
    fsxf.id = df_id;
    fsxf.is_deployed = is_deployed;
    App.showProcessing();
    var url = '/forms/deploy-general/'+ String(vm.is_project) + '/' + String(vm.pk);
    
    var success =  function (response) {
                App.hideProcessing();

                App.notifyUser(
                        'Sucessfully Saved',
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
    if(vm.is_project =="1" && is_deployed == true){
      alert("You Cannot Undeploy Project level Forms. Preform Undeploy from Sites")
      return false;
    }else{

    App.remotePost(url, fsxf, success, failure);                                                                                                                    
      
    }

  
  };
self.deploy_to_remaining = function (df_id, is_deployed){
    var fsxf = new FieldSightXF();
    fsxf.id = df_id;
    fsxf.is_deployed = is_deployed;
    App.showProcessing();
    var url = '/forms/deploy-general-remaining/'+ String(vm.is_project) + '/' + String(vm.pk);
    
    var success =  function (response) {
                App.hideProcessing();

                App.notifyUser(
                        'Sucessfully Deployed To Remaining Sites',
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
 

    App.remotePost(url, fsxf, success, failure);                                                                                                                    
  
  };


  self.getGeneralForms();

    self.search_key.subscribe(function (newValue) {
    if (!newValue) {
        self.forms(self.allGForms());
    } else {
        filter_forms = ko.utils.arrayFilter(self.allGForms(), function(item) {
            return ko.utils.stringStartsWith(item.name().toLowerCase(), newValue);
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
  self.is_deployed = ko.observable(false);
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

self.deploy = function (df_id, is_deployed){
    var s = new Schedule();
    s.id = df_id;
    s.is_deployed = is_deployed;
    App.showProcessing();
    var url = '/forms/deploy-survey/'+ String(vm.is_project) + '/' + String(vm.pk);
    
    var success =  function (response) {
                App.hideProcessing();

                App.notifyUser(
                        'Sucessfully Saved',
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
    if(vm.is_project =="1" && is_deployed ==true){
      alert("You Cannot Undeploy Project level Forms. Preform Undeploy from Sites")
      return false;
    }else{

    App.remotePost(url, s, success, failure);                                                                                                                    
      
    }

  
  };


self.saveSchedule = function(){
  App.showProcessing();
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
                var date_st = response.date_range_start.slice(0,10);
                var date_end = response.date_range_end.slice(0,10);
                response.date_range_start = date_st;
                response.date_range_end = date_end;
                self.allForms().unshift(new Schedule(response));
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
                 var mappedData = ko.utils.arrayMap(response, function(item) {
                  var date_st = item.date_range_start.slice(0,10);
                var date_end = item.date_range_end.slice(0,10);
                item.date_range_start = date_st;
                item.date_range_end = date_end;
                      return new Schedule(item);
                    });
                self.forms(mappedData);
                self.allForms(mappedData);

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
            return ko.utils.stringStartsWith(item.name().toLowerCase(), newValue);
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
  self.gxforms = ko.observableArray();
  self.stages = ko.observableArray();
  self.current_stage = ko.observable();
  self.stage_form_visibility = ko.observable(false);
  // self.search_key = ko.observable();
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

self.getGlobalXforms = function(){
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
                      return new GXform(item);
                    });
                
                self.gxforms(mappedData);

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

self.deployStages = function (){
  App.showProcessing();
    var url = '/forms/set-deploy-stages/'+ String(vm.is_project) + '/' + String(vm.pk);
    
    var success =  function (response) {
                App.hideProcessing();

                App.notifyUser(
                        'Stages Deployed',
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

    App.remotePost(url, {}, success, failure);                                                                                                                    
  
  };

self.editSage = function(stage){
  self.current_stage(stage);
  self.current_stage().setShowSubstages();
  self.stage_form_modal_visibility(true);
  // self.addSubStageMode(true);

}

self.saveStage = function(stage){
  App.showProcessing();
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
                          sub_st.stage_forms = {"xf": {"title": item.stage_forms().xf().label(),
                                                  "id": item.stage_forms().xf().id()},
                                                 "id": item.stage_forms().id() };
                          return sub_st;

                    });
                

  stageobj.parent = parent;
 var url = '/forms/api/stage/' + String(vm.is_project) + '/' + String(vm.pk);
var success =  function (response) {
                App.hideProcessing();
                stage.show_substages(false);
                stage.stageChanged(false);
                
                if(stage.id()){
                  console.log("edit");
                  responseStage = new Stage(response);
                  stage.parent(responseStage.parent());
                  stage.name(responseStage.name());
                  stage.description(responseStage.description());
                  stage.order(responseStage.order());
                  stage.date_modified(responseStage.date_modified());
                  stage.site(responseStage.site());
                  stage.project(responseStage.project());
                }else{

                  console.log("new stage saved");
                   self.allStages().push(new Stage(response));
                    self.stages(self.allStages());
                    self.current_stage(new Stage({'order':self.allStages().length+1 || 1,'parent':[]}));
                    self.current_stage().setShowSubstages();
                    self.addStageMode(true);

                }



              //    ko.utils.arrayForEach(self.allStages(), function(item) {
              //     if (item.id() == response.id) {
              //         save_mode =  false;
              //         return;
              //     }
              // }); 
              //     if(save_mode == true){
              //       self.allStages().push(new Stage(response));
              //       self.stages(self.allStages());
              //       self.current_stage(new Stage({'order':self.allStages().length+1 || 1,'parent':[]}));
              //       self.current_stage().setShowSubstages();
              //       // self.addStageMode(true);

              //     }

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

self.saveStagesOrder = function(){
App.showProcessing();
  var object_rearrange = new SimpleStage();
  var stagesWithOrder = ko.utils.arrayMap(self.stages(), function(item) {
                      var st = new SimpleStage();
                      st.id = item.id();
                      return st;
                    });
  object_rearrange.orders = stagesWithOrder;
                

 var url = '/forms/api/stage-rearrange/' + String(vm.is_project) + '/' + String(vm.pk);
var success =  function (response) {
                App.hideProcessing();

                App.notifyUser(
                        'Stage  rearranged ',
                        'success'
                    );

            };
    
var failure =  function (errorThrown) {
      var err_message = errorThrown.responseJSON.error;
      if (err_message==undefined){
        err_message = "Failed to rearrange Stages";
      }
                App.hideProcessing();
                App.notifyUser(
                        err_message,
                        'error'
                    );

            };

    App.remotePost(url, object_rearrange, success, failure);                                                                                                                    
  
  };

self.orderChanged = function(){
  self.saveStagesOrder();
};

// self.search_key.subscribe(function (newValue) {
//     if (!newValue) {
//         self.stages(self.allStages());
//     } else {
//         filter_stages = ko.utils.arrayFilter(self.allStages(), function(item) {
//           if (item.name()){
//             return ko.utils.stringStartsWith(item.name().toLowerCase(), newValue);
//           }else{
//             return true;
//           }
//         });
//         self.stages(filter_stages);
//     }
//     });
  
  self.getGlobalXforms();
  // setTimeout(myFunction, 1000);
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




