var ChangeStatus = function(data){

  for (var i in data){
    self[i] = ko.observable(data[i]);
              }
}

function StatusViewModel(fxf, instance) {
  var self=this;
  self.wantstatus =  ko.observable(true);
  self.formStatus = ko.observable();
  self.message = ko.observable();
  self.fxf = ko.observable(fxf);
  self.instance = ko.observable(instance);

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
    var changeStatus = new ChangeStatus();
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

	self.getStatus();

  };
