window.app = new Vue({
  el: '#app',
  template: `
        <div>
            <div class="panel panel-default">
                 <div class="panel-heading"><a class="btn btn-info" @click="add_stage">Add Stage</a></div>
                <div class="panel-body">
                    <div class="col-sm-12" v-show="show_ad_stage_form">
                    <form class="form">
                        <div class="col-sm-12" v-show="error">
                        {{error}}
                        </div>
                          <div class="form-group">
                            <input v-model="stage_form_obj.name" class="form-control" placeholder="Stage Name">
                          </div>
                          <div class="form-group">
                            <textarea v-model="stage_form_obj.description" placeholder="Description"></textarea>
                          </div>
                            <a @click="save_stage" class="btn btn-primary">Save</a> &nbsp;
                            <a @click="cancel_stage" class="btn btn-warning">Cancel</a>
                    </form>
                    </div>

                    <div class="col-sm-12" v-show="!show_ad_stage_form">
                        <div v-for="stage, index in stages">
                            <b># <span v-text='index+1'></span>
                            <span v-text='stage.name'></span></b><br>
                        </div>
                    </div>

                </div>
            </div>
        </div> `,
  data: {
    stages: [],
    loading: false,
    is_project: configure_settings.is_project,
    pk: configure_settings.id,
    error: '',
    show_ad_stage_form: false,
    stage_form_obj: {'name': '', 'description':'', 'id':''},
  },
  methods:{
            loadStages: function () {
            console.log("load stages");
            var self = this;
            self.loading = true;
            var options = {};

            function successCallback(response) {
                self.stages = response.body;
                self.loading = false;
                console.log(self.stages);
            }

            function errorCallback() {
                self.loading = false;
                console.log('failed');
            }
            self.$http.get('/forms/api/stage-list/'+self.is_project+'/'+self.pk+'/', {
                params: options
            }).then(successCallback, errorCallback);
        },

        add_stage : function (){
            var self = this;
            self.error = "";
            self.stage_form_obj = {'name': '', 'description':'', 'id':''};
            self.show_ad_stage_form = true;
        },
        cancel_stage : function (){
            var self = this;
            self.show_ad_stage_form = false;
            self.stage_form_obj = {'name': '', 'description':'', 'id':''};
        },

      saveNewStage: function () {
        var self = this;
        let csrf = $('[name = "csrfmiddlewaretoken"]').val();
        let options = {headers: {'X-CSRFToken':csrf}};
        self.stage_form_obj.order = self.stages.length;
        function successCallback (response){

        self.error = "";
            new PNotify({
          title: 'Stage Saved',
          text: 'Stage '+ response.body.name + ' Saved'
        });
        self.stages.push(response.body);
        self.show_ad_stage_form = false;
        }

        function errorCallback (response){
        console.log(response.body);
          new PNotify({
          title: 'failed',
          text: 'Failed to Save Stage',
          type: 'error'
        });
            if(response.body.error){
            console.log(response.body.error)
              self.error = 'Failed to Save Stage';
            }else{
                self.error = "Stage Name Required !.";

            }
        }
       self.$http.post('/forms/api/stage-list/'+self.is_project+'/'+self.pk+'/', self.stage_form_obj, options).then(successCallback, errorCallback);


    },
        save_stage : function (){
            var self = this;
            if(!self.stage_form_obj.name){
            self.error = "Stage Name required";
            return;
            }
            self.error = "";
            if(!self.stage_form_obj.id){
                self.saveNewStage();
              }else{
              console.log("Update stage ");
    //            self.editStage(show_ad_stage_form);
              }
//          self.error = '';
//            self.show_ad_stage_form = false;
        },
  },
  created(){
    var self= this;
    console.log("hello");
    self.loadStages();
  },

})