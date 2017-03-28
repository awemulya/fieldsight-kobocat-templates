var People = function (data){
  self = this;
  self.id = ko.observable();
  self.name = ko.observable();
  self.is_supervisor = ko.observable(true);

  self.save = function(){
    vm.people_form_visibility(false);
  };
  for (var i in data){
    self[i] = ko.observable(data[i]);
              }
}

var SVM = function(){
var self = this;
};

var GVM = function(){
var self = this;
};

function ManagePeopleViewModel(pk) {
  var self=this;
  self.pk = pk;
  
  self.search_key_reviewer = ko.observable();
  self.search_key_supervisor = ko.observable();
  self.people_form_visibility = ko.observable(false);

  self.reviewers = ko.observableArray();
  self.allReviewers = ko.observableArray();
  self.supervisors = ko.observableArray();
  self.allSupervisors = ko.observableArray();
  self.available_reviewers = ko.observableArray();
  self.available_supervisors = ko.observableArray();

  self.add_people = function(){
    self.current_people(new People());
    self.people_form_visibility(true);
  };

  self.search_key_reviewer.subscribe(function (newValue) {
    if (!newValue) {
        self.reviewers(self.allReviewers());
    } else {
        filter_data = ko.utils.arrayFilter(self.allReviewers(), function(item) {
            return ko.utils.stringStartsWith(item.name().toLowerCase(), newValue);
        });
        self.reviewers(filter_data);
    }
    });




  self.currentVm = ko.observable("supervisor");
  self.supervisorVm = ko.observable();
  self.reviewerVm = ko.observable();

  self.supervisorVm(new SVM());

  self.setSelectedVm = function(selected){
    self.currentVm(selected);
    };

  
  self.currentVm.subscribe(function (newValue) {
    if(newValue == "supervisor" ) {
      if (ko.utils.unwrapObservable(self.supervisorVm()) == null){
        self.supervisorVm(new SVM());
      }
        
    } else if (newValue == "reviewer") {
      if (ko.utils.unwrapObservable(self.reviewerVm()) == null){
        self.reviewerVm(new RVM());
      }

    }
    });

};


