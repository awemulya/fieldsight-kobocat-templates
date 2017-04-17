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
  

  self.saveStatus = function(){
    var url = '/forms/instance/status/'+ String(self.instance());
    var changeStatus = new MyObject();
    changeStatus.status = self.formStatus();
    changeStatus.message = self.message();

    var success =  function (response) {
                App.hideProcessing();

                App.notifyUser(
                        'Status Saved',
                        'success'
                    );

            };
    var failure =  function (errorThrown) {
                App.hideProcessing();
                App.notifyUser(
                        'Failed to Change Status',
                        'error'
                    );

            };

    App.remotePost(url, changeStatus, success, failure);                                                                                                                    
  
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
