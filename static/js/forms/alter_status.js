var MyObject = function(){
var self=this;
};

var ChangeStatus = function(instance, status, message){
  var self = this;
  self.formStatus = ko.observable(status);
  self.message = ko.observable(message);
  self.instance = ko.observable(instance);
  self.historyList = ko.observableArray();
  self.modal_visibility = ko.observable(false);
  self.current_history = ko.observable();
  self.em_images = ko.observableArray();
  self.multiFileData = ko.observable({
    dataURLArray: ko.observableArray(),
  });

  self.onClear = function(fileData){
    if(confirm('Are you sure To clear files ?')){
      fileData.clear && fileData.clear();
    }        
    }

  self.getStatus= function(){
      var url = '/forms/instance/status/'+ String(self.instance());
    App.showProcessing();
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            // data: post_data,
            // async: true,
            success: function (response) {
                App.hideProcessing();
                self.formStatus(response.formStatus);
                var data = response.formStatus;
                
                switch( data)
                {
                   case '0':
                    $(".sub-header-bar").addClass("pending-bar");
                    $(".status-icon").find("span.pending").removeClass("hide").addClass("active");
                    $("button.pending").addClass("border-left");
                    break;

                  case '1':
                    $(".sub-header-bar").addClass("rejected-bar");
                    
                    $(".status-icon").find("span.rejected").removeClass("hide").addClass("active");
                    $("button.pending").addClass("border-left");
                    $("button.rejected").addClass("border-left");
                    break;

                  case '2':
                    $(".sub-header-bar").addClass("flagged-bar");
                    $(".status-icon").find("span.flagged").removeClass("hide").addClass("active");
                    $("button.pending").addClass("border-left");
                    $("button.flagged").addClass("border-left");
                    break;

                  case '3':
                    $(".sub-header-bar").addClass("approved-bar");
                    $(".status-icon").find("span.approved").removeClass("hide").addClass("active");
                    $("button.approved").addClass("border-left");
                    break;

                  default:

                }



            },
            error: function (errorThrown) {
              if (errorThrown){
                console.log(errorThrown);
              }
              // var err_msg = "Failed to get submission status";
              //   App.hideProcessing();
              //   App.notifyUser(
              //           err_msg,
              //           'error'
              //       );

            }
        });
  };
  

  self.saveStatus = function(new_status){
    var url = '/forms/instance/status/'+ String(self.instance());
    var changeStatus = new MyObject();
    changeStatus.status = new_status;
    changeStatus.message = self.message();

            var formdata = new FormData();
            formdata.append('status', new_status);
            formdata.append('message', self.message());
            for (var i = 0; i < self.multiFileData().fileArray().length; i++) {
              formdata.append('new_images_'+String(i), self.multiFileData().fileArray()[i]);
            }

            

    var success =  function (response) {
                App.hideProcessing();

                App.notifyUser(
                        'Status Saved',
                        'success'
                    );
                        location.reload();

            };
    var failure =  function (errorThrown) {
                App.hideProcessing();
                App.notifyUser(
                        'Failed to Change Status',
                        'error'
                    );

            };

    App.remoteMultipartPost(url, formdata, success, failure);                                                                                                                    
  
  };

    self.loadHistory= function(){
      var url = '/forms/api/instance/status-history/'+ String(self.instance());
    App.showProcessing();
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            // data: post_data,
            // async: true,
            success: function (response) {
                App.hideProcessing();
                self.historyList(response);

            },
            error: function (errorThrown) {
              var err_msg = errorThrown.responseJSON.error;
                App.hideProcessing();
                App.notifyUser(
                        err_msg,
                        'error'
                    );

            }
        });
  };

  self.history = function(){
    self.current_history(new MyObject());
    self.modal_visibility(true);
    self.loadHistory();
  };

  self.close = function(){
    self.modal_visibility(false);
  };

  self.getStatus();

}

function StatusViewModel(fxf, instance) {
  var self=this;
  self.wantstatus =  ko.observable(true);
  self.fxf = ko.observable(fxf);
  self.instance = ko.observable(instance);
  self.model = ko.observable(new ChangeStatus(instance, 0, ""));
  
  };
