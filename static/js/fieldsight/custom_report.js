function assigntoken(csrf){
  csrf_token=csrf;
  
}
function StageViewModel() {
  var self=this;
  self.generalforms = ko.observableArray();
  self.scheduledforms = ko.observableArray();
  self.stageforms = ko.observableArray();
  self.allformjson = ko.observableArray();
  self.stageForm = ko.observable();
  self.generalForm = ko.observable();
  self.scheduleForm = ko.observable();
  



  self.loadData = function(){
      // App.showProcessing();

          $.ajax({
              url: "http://kc.naxa.com.np/fieldsight/site/report/custom-responses/360/",
              method: 'GET',
              dataType: 'json',
              

              success: function (response) {
                 self.generalForm({'xf_title':'General Forms', 'level':'1', 'forms':[]});
                 var mappedGeneralData = ko.utils.arrayMap(response.general, function(item) {
                            datas = {'id': item.id, 'xf_title': item.xf__title, 'level':'2', 'forms':[]};
                            return datas;
                        });
                 self.generalForm().forms.push.apply(self.generalForm().forms, mappedGeneralData);

                 self.scheduleForm({'xf_title':'Schedule Forms', 'level':'1', 'forms':[]});
                 var mappedScheduleData = ko.utils.arrayMap(response.general, function(item) {
                            datas = {'id': item.id, 'xf_title': item.xf__title, 'level':'2', 'forms':[]};
                            return datas;
                        });
                 self.scheduleForm().forms.push.apply(self.scheduleForm().forms, mappedScheduleData);

                 self.stageForm({'xf_title':'Stage Forms', 'level':'1', 'forms':[]});
                 var mappedStageData = ko.utils.arrayMap(response.stage, function(item) {
                        var sub_stages = ko.utils.arrayMap(item.sub_stages, function(subitem) {
                            sub_datas = {'id': subitem.stage_forms__id, 'xf_title': subitem.stage_forms__xf__title, 'level':'3'};
                            return sub_datas;
                        });
                        stage_data = {'id': item.id, 'xf_title': item.title, 'level':'2', 'forms':sub_stages};                      
                        return stage_data;
                    });
                 self.stageForm().forms.push.apply(self.stageForm().forms, mappedStageData);

                 self.allformjson().push(self.generalForm());
                 self.allformjson().push(self.scheduleForm());
                 self.allformjson().push(self.stageForm());                 
                 console.log(JSON.stringify(self.allformjson()));


                App.hideProcessing();
                },
              error: function (errorThrown) {
                  App.hideProcessing();
                  console.log(errorThrown);
              }
          });
    };

  

  self.loadData(url);
}

