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
  self = this;
  self.id = ko.observable();
  self.user = ko.observable();
  self.group_name = ko.observable();
  self.started_at = ko.observable();
  self.group = ko.observable();
  self.site = ko.observable();
  self.project = ko.observable();
  self.organization = ko.observable();


  self.remove = function(){

  };
  self.detail = function(){
    vm.showDetail(self);

  };


  for (var i in data){
    if(i == "user"){
      self.user(new User(data[i]));
     
    }else{
    self[i] = ko.observable(data[i]);
      }
    }
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
  
  self.remove = function(){

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
    var mapped_available_users = [];

    if(group == "Site Supervisor"){
      if(self.siteVm().supervisors().length <1){
        self.available_users(self.users());

      }else{


      mapped_available_users = ko.utils.arrayFilter(self.users(), function(item) {
            return notFound(item.id(), self.siteVm().supervisors());
        });
      self.available_users(mapped_available_users);

    }

    }
    
    

    self.new_role(new Role({'group':group, 'user':{}}));
    self.add_people_form_visibility(true);

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

  self.doAssign = function(){
    alert("saved");
    self.add_people_form_visibility(false);
    };

  self.addUser = function(){
    self.new_user(new NewUser());
    self.add_user_form_visibility(true);

  };

  self.saveUser = function(){
    
    // check valid

    // save user and add to available users
    self.add_user_form_visibility(false);

  };

  self.showDetail = function(role){
    self.role(role);

    self.detail_people_form_visibility(true);

  };


if (self.level == "0"){
  self.currentVm("site");
  self.siteVm(new SiteVM(level, pk));
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

  self.loadUsers();

};


