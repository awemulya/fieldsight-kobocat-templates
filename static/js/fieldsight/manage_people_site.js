var User = function(data){
  var self = this;

  self.id =  ko.observable();
  self.username =  ko.observable();
  self.first_name =  ko.observable();
  self.last_name =  ko.observable();
  self.email =  ko.observable();
  self.password =  ko.observable();


  for (var i in data){
    self[i] = ko.observable(data[i]);
      }

  self.full_name = ko.computed(function() {
        return self.first_name() + " " + this.last_name();
    }, self);

}

var Role = function (data){
  self = this;
  self.id = ko.observable();
  self.user = ko.observable();
  self.profile_picture = ko.observable();
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
  self.group = ko.observable("supervisor");

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


function ManagePeopleViewModel(pk, level) {
  var self=this;
  self.pk = pk;
  self.level = level;
  self.add_people_form_visibility = ko.observable(false);
  self.detail_people_form_visibility = ko.observable(false);
  self.user = ko.observable();
  self.role = ko.observable();
  
  self.currentVm = ko.observable();
  
  self.siteVm = ko.observable();
  self.projectVm = ko.observable();
  self.organizationVm = ko.observable();

  self.addRole = function(){
    self.add_people_form_visibility(true);

  };

  self.showDetail = function(role){
    self.role(role);
    self.detail_people_form_visibility(true);

  };


if (self.level == "0"){
  self.currentVm("site");
  self.siteVm(new SiteVM(level, pk));
}  

};


