function notFound(id, array){
var notFOund  = true;
  ko.utils.arrayFilter(array, function(item) {
            if (item.user().id() == id){
              notFOund = false;
              return;
            }
        });

return notFOund;
}


var User = function(data){
  var self = this;

  self.id =  ko.observable();
  self.username =  ko.observable();
  self.first_name =  ko.observable();
  self.last_name =  ko.observable();
  self.email =  ko.observable();
  self.password =  ko.observable();
  self.cpassword =  ko.observable();
  self.profile_picture = ko.observable();


  for (var i in data){
    self[i] = ko.observable(data[i]);
      }

  self.full_name = ko.computed(function() {
        return self.first_name() + " " + this.last_name();
    }, self);
   
}

var NewUser = function(){
  var self = this;

  self.id =  ko.observable("");
  self.username =  ko.observable("");
  self.first_name =  ko.observable("");
  self.last_name =  ko.observable("");
  self.email =  ko.observable("");
  self.password =  ko.observable("");
  self.cpassword =  ko.observable("");
  self.error = ko.observable();


   
   self.valid = ko.computed(function() {
    if (!self.username()){
      self.error("Username Required.")
      return false;
    }
    self.error("");
    
    if (self.username().length <6){
      self.error("Username Must be at Least 6 Character long.")
      return false;
    }
    self.error("");
    if (!self.first_name()){
      self.error("First Name Required.")
      return false;
    }
    self.error("");
    
    if (!self.email()){
      self.error("Email Required.")
      return false;
    }
    self.error("");
    
    if (self.email().length <6){
      self.error("Email Incorrect.")
      return false;
    }
 
    
    self.error("");
     if (self.password().length <6){
      self.error("Password Must be at Least 6 Character long.")
      return false;
    }
    self.error("");
    if(self.password() != self.cpassword()){
      self.error("Pasword Miss Match");
      return false;
    }
    self.error("");
    return true;
    }, self);
}

var Role = function (data){
  var self = this;
  self.id = ko.observable();
  self.user = ko.observable();
  self.users = ko.observableArray();
  self.group_name = ko.observable();
  self.started_at = ko.observable();
  self.group = ko.observable();
  self.site = ko.observable();
  self.project = ko.observable();
  self.organization = ko.observable();



  for (var i in data){
    if(i == "user"){
      self.user(new User(data[i]));
     
    }else{
    self[i] = ko.observable(data[i]);
      }
    }
  
  self.rmrole = function(){
   vm.unAssignUserROle(self.id());
  };

  self.detail = function(){
    vm.showDetail(self);

  };

}


var SiteVM = function(level, pk){
  var self=this;
  self.group = ko.observable("Site Supervisor");

  self.search_key_supervisor = ko.observable();
  self.supervisors = ko.observableArray();
  self.allSupervisors = ko.observableArray();

  self.reviewers = ko.observableArray();
  self.allReviewers = ko.observableArray();
  
  self.available_supervisors = ko.observableArray(); 
  self.available_reviewers = ko.observableArray(); 
  // available ie users not in current list.
  self.search_key_supervisor = ko.observable();
  self.search_key_reviewer = ko.observable();

  self.setSelectedGroup = function(selected){
    self.group(selected);
    };


  self.add = function(){
    vm.addRole(self.group());  
  };
  
 

  self.loadSupervisor = function(){
    App.showProcessing();
        $.ajax({
            url: '/userrole/api/people/'+ String(level) + '/' + String(pk),
            method: 'GET',
            dataType: 'json',
            // data: post_data,
            // async: true,
            success: function (response) {
                self.supervisors([]);
                self.reviewers([]);
                App.hideProcessing();
                ko.utils.arrayMap(response, function(item) {
                  if (item.group == "Site Supervisor"){
                        self.supervisors.push( new Role(item));
                      }else if (item.group == "Reviewer"){
                        self.reviewers.push(new Role(item));
                      }
                    });
                  
                self.allSupervisors(self.supervisors());
                self.allReviewers(self.reviewers());


            },
            error: function (errorThrown) {
                App.hideProcessing();
                console.log(errorThrown);
            }
        });
  };

  self.search_key_supervisor.subscribe(function (newValue) {
    if (!newValue) {
        self.supervisors(self.allSupervisors());
    } else {
        filter_data = ko.utils.arrayFilter(self.allSupervisors(), function(item) {
            return ko.utils.stringStartsWith(item.user().first_name().toLowerCase(), newValue);
        });
        self.supervisors(filter_data);
    }
    });

  self.search_key_reviewer.subscribe(function (newValue) {
    if (!newValue) {
        self.reviewers(self.allReviewers());
    } else {
        filter_data = ko.utils.arrayFilter(self.allReviewers(), function(item) {
            return ko.utils.stringStartsWith(item.user().first_name().toLowerCase(), newValue);
        });
        self.reviewers(filter_data);
    }
    });

  self.loadSupervisor();

};

var ProjectVM = function(level, pk){
  var self=this;
  self.group = ko.observable("Project Manager");

  self.search_key = ko.observable();
  self.projectManagers = ko.observableArray();
  self.allProjectManagers = ko.observableArray();

  
  self.available_projectManagers = ko.observableArray(); 


  self.add = function(){
    vm.addRole(self.group());  
  };
  
 

  self.loadProjectManagers = function(){
    App.showProcessing();
        $.ajax({
            url: '/userrole/api/people/'+ String(level) + '/' + String(pk),
            method: 'GET',
            dataType: 'json',
            // data: post_data,
            // async: true,
            success: function (response) {
                self.projectManagers([]);
                App.hideProcessing();
               var mappedData = ko.utils.arrayMap(response, function(item) {
                        return new Role(item);
                    });
                self.allProjectManagers(mappedData);

                self.projectManagers(mappedData);

            },
            error: function (errorThrown) {
                App.hideProcessing();
                console.log(errorThrown);
            }
        });
  };

  self.search_key.subscribe(function (newValue) {
    if (!newValue) {
        self.projectManagers(self.allProjectManagers());
    } else {
        filter_data = ko.utils.arrayFilter(self.allProjectManagers(), function(item) {
            return ko.utils.stringStartsWith(item.user().first_name().toLowerCase(), newValue);
        });
        self.projectManagers(filter_data);
    }
    });

  
  self.loadProjectManagers();

};


function ManagePeopleViewModel(pk, level, organization) {
  var self=this;
  self.pk = pk;
  self.organization = organization;
  self.level = level;
  self.users = ko.observableArray();
  self.available_users = ko.observableArray();
  self.selected_users = ko.observableArray();
  self.add_people_form_visibility = ko.observable(false);
  self.add_user_form_visibility = ko.observable(false);
  
  self.detail_people_form_visibility = ko.observable(false);

  self.user = ko.observable();
  self.role = ko.observable();
  self.new_role = ko.observable();
  self.new_user = ko.observable();
  
  self.currentVm = ko.observable();
  
  self.siteVm = ko.observable();
  self.projectVm = ko.observable();
  self.organizationVm = ko.observable();

  self.addRole = function(group){
    self.selected_users([]);
    var mapped_available_users = [];

    if(group == "Site Supervisor"){
      if(self.siteVm().allSupervisors().length <1){
        self.available_users(self.users());

      }else{


      mapped_available_users = ko.utils.arrayFilter(self.users(), function(item) {
            return notFound(item.id(), self.siteVm().allSupervisors());
        });
      self.available_users(mapped_available_users);

    }
  }else if(group == "Reviewer"){
      if(self.siteVm().allReviewers().length <1){
        self.available_users(self.users());

      }else{

      mapped_available_users = ko.utils.arrayFilter(self.users(), function(item) {
            return notFound(item.id(), self.siteVm().allReviewers());
        });
      self.available_users(mapped_available_users);

      }

     }else if(group == "Project Manager"){
      if(self.projectVm().allProjectManagers().length <1){
        self.available_users(self.users());

      }else{

      mapped_available_users = ko.utils.arrayFilter(self.users(), function(item) {
            return notFound(item.id(), self.projectVm().allProjectManagers());
        });
      self.available_users(mapped_available_users);

      }

     }
    
    

    self.new_role(new Role({'group':group, 'user':{}}));
    self.add_people_form_visibility(true);
    if(self.available_users().length<1){
      self.addUser();

    }

  };

  self.cancelAssign = function(){
    self.add_people_form_visibility(false);
    };

  self.cancelUser = function(){
    self.add_user_form_visibility(false);
    };


self.setSelected = function(user){
 if (self.selected_users.indexOf(user) < 0) {
  self.selected_users.push(user);
  self.available_users.remove(user);
}else{

  self.selected_users.remove(user);
  self.available_users.push(user);
}
};

self.unAssignUserROle = function(role_id){

    var url = '/userrole/api/people/deactivate/';

    

    var success =  function (response) {
      var level = response.role_name;
      if (level == "Site Supervisor"){

         var rm_roles = ko.utils.arrayFilter(self.siteVm().allSupervisors(), function(item) {
            return item.id() != response.role;
        });
        self.siteVm().supervisors(rm_roles);                   
        self.siteVm().allSupervisors(rm_roles);                   
        
        
      }else if (level == "Reviewer"){

         var rm_roles = ko.utils.arrayFilter(self.siteVm().allReviewers(), function(item) {
            return item.id() != response.role;
        });
        self.siteVm().reviewers(rm_roles);                   
        self.siteVm().allReviewers(rm_roles);                   
        
        
      }else if (level == "Project Manager"){

       var rm_roles = ko.utils.arrayFilter(self.projectVm().allProjectManagers(), function(item) {
            return item.id() != response.role;
        });
        self.projectVm().projectManagers(rm_roles);                   
        self.projectVm().allProjectManagers(rm_roles);                   
        
        
      }
      var message = response.msg;
                App.hideProcessing();
               
                App.notifyUser(
                        message,
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

    App.remotePost(url, {'id':role_id,'level':self.level,'dashboard_pk':self.pk}, success, failure);  

};

  self.doAssign = function(){
    
    ko.utils.arrayMap(self.selected_users(), function(item) {
                    self.new_role().users.push(item.id());
                    });
       App.showProcessing();
    
    var url = '/userrole/api/people/'+ String(level) + '/' + String(pk);

    

    var success =  function (response) {
                App.hideProcessing();
                if ((self.new_role().group() =='Site Supervisor') || self.new_role().group() =='Reviewer' ){
                  vm.siteVm().loadSupervisor();

                }else if(self.new_role().group() =='Project Manager'){
                  vm.projectVm().loadProjectManagers();
                }

                App.notifyUser(
                        'People Assigned Sucess',
                        'success'
                    );

            };
    var failure =  function (errorThrown) {
      var err_message = errorThrown.responseJSON[0];
                App.hideProcessing();
                App.notifyUser(
                        err_message,
                        'error'
                    );

            };

    App.remotePost(url, ko.toJS(self.new_role()), success, failure);  
    self.selected_users([]);                                                                                                                  
  
    self.add_people_form_visibility(false);
    };

  self.addUser = function(){
    self.new_user(new NewUser());
    self.add_user_form_visibility(true);

  };

  self.saveUser = function(){
    self.saveUserData();
   };

  self.showDetail = function(role){
    self.role(role);

    self.detail_people_form_visibility(true);

  };


if (self.level == "0"){
  self.currentVm("site");
  self.siteVm(new SiteVM(level, pk));
}else if (self.level == "1"){
  self.currentVm("project");
  self.projectVm(new ProjectVM(level, pk));

}  

  self.loadUsers = function(){
    App.showProcessing();
        $.ajax({
            url: '/users/list/'+ String(self.organization)+'/',
            method: 'GET',
            dataType: 'json',
            // data: post_data,
            // async: true,
            success: function (response) {
                
                App.hideProcessing();
                var mappedData = ko.utils.arrayMap(response, function(item) {
                      return new User(item);
                    });                  
                self.users(mappedData);


            },
            error: function (errorThrown) {
                App.hideProcessing();
                console.log(errorThrown);
            }
        });
  };

    self.saveUserData = function(){
    App.showProcessing();
    var url = '/users/list/'+ String(self.organization)+'/';
    

    var success =  function (response) {
                App.hideProcessing();
                self.users.push(new User(response));
                self.selected_users.push(new User(response));
                self.add_user_form_visibility(false);

                App.notifyUser(
                        'User '+response.username +'Created',
                        'success'
                    );

            };
    var failure =  function (errorThrown) {
      var err_message = errorThrown.responseJSON[0];
                App.hideProcessing();
                App.notifyUser(
                        err_message,
                        'error'
                    );

            };

    App.remotePost(url, ko.toJS(self.new_user()), success, failure);                                                                                                                    
  
  };

  self.loadUsers();

};


