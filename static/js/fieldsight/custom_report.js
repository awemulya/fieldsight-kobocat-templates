function assigntoken(csrf){
  csrf_token=csrf;
  
}
var Images =function (data){
  self = this;
  self.fs_uuid = ko.observable();
  self._attachments = ko.observable();
  
  for (var i in data){
    self[i] = ko.observable(data[i]);
      }
}
function StageViewModel(url1, url2) {
 
  var self=this;
  self.generalforms = ko.observableArray();
  self.scheduledforms = ko.observableArray();
  self.stageforms = ko.observableArray();
  self.allformjson = ko.observableArray();
  self.stageForm = ko.observable();
  self.generalForm = ko.observable();
  self.scheduleForm = ko.observable();

  self.allImages = ko.observable();
  
  
  self.setSelected = function(item){
          console.log(item.selected());

          ko.utils.arrayForEach(item.forms, function(child) {
             
              child.selected((item.selected()));
              ko.utils.arrayForEach(child.forms, function(subchild) {
             
              subchild.selected((child.selected()));
             
             });
             
             });

          ko.utils.arrayForEach(self.allformjson(), function(item) {


                  select_status1 = false;

                    ko.utils.arrayForEach(item().forms, function(child) {
                        
                        if (child.selected() === true && item().xf_title != "Stage Forms"){
                              select_status1=true;
                        }

                            else{
                                select_status2 = false;
                                ko.utils.arrayForEach(child.forms, function(subchild) {
                                    if (subchild.selected() === true){
                                      select_status2 = true;        
                                      select_status1 = true;
                                    }                                             
                                });
                                child.selected(select_status2);    
                            }
                        item().selected(select_status1);    
                            
                                  
                    });           

             });

  return true;
          
     
    
  }; 

  self.data = ko.observable();
  self.generateReport = function(){
    App.showProcessing();
    var selectedFormids = [];
          ko.utils.arrayForEach(self.allformjson(), function(item) {
            
                if (item().selected() === true){
                    ko.utils.arrayForEach(item().forms, function(child) {

                        if (child.selected() === true){

                            if (item().xf_title != "Stage Forms"){

                                selectedFormids.push(child.id);
                            }
                            else{

                                ko.utils.arrayForEach(child.forms, function(subchild) {
                                    if (subchild.selected() === true){
                                      selectedFormids.push(subchild.id);        
                                    }                                             
                                });    
                            }
                        }          
                    });           
                }  
             });
    console.log(selectedFormids);
    
    self.data({'fs_ids':selectedFormids});
    

    var success =  function (response) {
                App.hideProcessing();

                App.notifyUser(
                        'Generating',
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
       // App.remotePost(url1, ko.toJS(self.data()), success, failure); 

      var xhr = new XMLHttpRequest();
      xhr.open("POST", url1, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(self.data())); 
};


  self.loadData = function(url1){
      // App.showProcessing();

          $.ajax({
              url: url1,
              method: 'GET',
              dataType: 'json',
              

              success: function (response) {
                 self.generalForm({'xf_title':'General Forms', 'level':'1', 'forms':[], 'selected': ko.observable(false) });
                 var mappedGeneralData = ko.utils.arrayMap(response.general, function(item) {
                            datas = {'id': item.id, 'xf_title': item.xf__title, 'level':'2', 'forms':[], 'selected': ko.observable(false)};
                            return datas;
                        });
                 self.generalForm().forms.push.apply(self.generalForm().forms, mappedGeneralData);

                 self.scheduleForm({'xf_title':'Schedule Forms', 'level':'1', 'forms':[], 'selected': ko.observable(false)});
                 var mappedScheduleData = ko.utils.arrayMap(response.schedule, function(item) {
                            datas = {'id': item.id, 'xf_title': item.xf__title, 'level':'2', 'forms':[], 'selected': ko.observable(false)};
                            return datas;
                        });
                 self.scheduleForm().forms.push.apply(self.scheduleForm().forms, mappedScheduleData);

                 self.stageForm({'xf_title':'Stage Forms', 'level':'1', 'forms':[], 'selected': ko.observable(false)});
                 var mappedStageData = ko.utils.arrayMap(response.stage, function(item) {
                        var sub_stages = ko.utils.arrayMap(item.sub_stages, function(subitem) {
                            sub_datas = {'id': subitem.stage_forms__id, 'xf_title': subitem.stage_forms__xf__title, 'forms':[], 'level':'3', 'selected': ko.observable(false)};
                            return sub_datas;
                        });
                        stage_data = {'id': item.id, 'xf_title': item.title, 'level':'2', 'forms':sub_stages, 'selected': ko.observable(false)};                      
                        return stage_data;
                    });
                 self.stageForm().forms.push.apply(self.stageForm().forms, mappedStageData);

                 self.allformjson.push(self.generalForm);
                 self.allformjson.push(self.scheduleForm);
                 self.allformjson.push(self.stageForm); 

                App.hideProcessing();
                },
              error: function (errorThrown) {
                  App.hideProcessing();
                  console.log(errorThrown);
              }
          });
    };

  

  

   self.loadImageData = function(url2){
       App.showProcessing();

          $.ajax({
              url: url2,
              method: 'GET',
              dataType: 'json',
              

              success: function (response) {
                console.log(response);
                var mappedData = ko.utils.arrayMap(response.images, function(item) {
                        datas = new Images(item);
                        return datas;
                    });
                self.allImages(mappedData);
                $('.scrollingSlider').slick({
                slidesToShow: 4,
                arrows: false,
                autoplay : true,
                infinite: false,
                responsive: [
                {
                  breakpoint: 768,
                  settings: {
                  arrows: false,
                  slidesToShow: 3
                  }
                },
                {
                  breakpoint: 480,
                  settings: {
                  arrows: false,
                  centerMode: true,
                  slidesToShow: 1
                  }
                }
                ]
              });
              $('.photo-item img').on('click',function(){
                var title = $(this).attr('img-title');
                var src = $(this).attr('src');
                var img = '<img src="' + src + '" class="img-responsive"/>';
                var html = '';
                html += img;
                $('#myModalLabel').modal();
                $('#myModalLabel').on('shown.bs.modal', function(){
                  $('#myModalLabel .modal-header .modal-title').html(title);
                  $('#myModalLabel .modal-body').html(html);
                })
                $('#myModalLabel').on('hidden.bs.modal', function(){
                  $('#myModalLabel .modal-header .modal-title').html('');
                  $('#myModalLabel .modal-body').html('');
                });
              });
                App.hideProcessing();
                self.loadData(url1);
                },
              error: function (errorThrown) {
                  App.hideProcessing();
                  console.log(errorThrown);
              }
          });
    };

  

  self.loadImageData(url2);
}



