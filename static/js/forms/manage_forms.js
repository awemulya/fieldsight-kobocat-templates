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

                    <div class="col-sm-12" v-show="(update_substage_mode=='true') && (substage_detail)">
                    <form class="form">
                        <div class="col-sm-12" v-show="error">
                        {{error}}
                        </div>
                          <div class="form-group">
                            <input v-model="substage_detail.name" class="form-control" placeholder="Sub Stage Name">
                          </div>
                          <div class="form-group">
                            <textarea v-model="substage_detail.description" placeholder="Description"></textarea>
                          </div>
                          <div class="form-group">
                            <input v-model="substage_detail.weight" placeholder="weight" type="integer" minimum="0"></input>
                          </div>
                          <div class="form-group">
                            <input v-model="substage_detail.tags" placeholder="tags"></input>
                          </div>
                          <div class="form-group" v-show="substage_detail.stage_forms">
                            {{substage_detail.stage_forms}}
                            <input v-model="sub_stage_form" placeholder="form"></input>
                          </div>
                          <div class="form-group" v-show="!substage_detail.stage_forms">
                            No Form Assigned Yet Choose One !!
                            <input v-model="sub_stage_form" placeholder="form"></input>
                          </div>
                            <a @click="save_sub_stage" class="btn btn-primary">Save</a> &nbsp;
                            <a @click="cancel_sub_stage" class="btn btn-warning">Cancel</a>
                    </form>
                    </div>

                    <div class="col-sm-12" v-if="substage_detail">
                    <h4> Sub Stage Detail </h4>
                    Name : {{substage_detail.name}}
                    Description : {{substage_detail.description}}
                    Responses : {{substage_detail.responses_count}}
                    Form Assigned : {{substage_detail.stage_forms.xf.title}}
                    Weight : {{substage_detail.weight}}
                    Tags :[t1, t2, t3]
                    <a @click="update_sub_stage" class="btn btn-primary">Update Sub Stage</a> &nbsp;
                    </div>

                    <div class="col-sm-12" v-if="current_stage">
                        <div class="panel"><a class="btn btn-info" @click="add_stage">Add Sub Stage</a></div>
                        <div class="col-sm-12" v-if="substages.length>0">
                            <h2>Stage Detail/ Substages</h2>
                            Stage :{{current_stage.name}} <br>
                            Description :{{current_stage.description}}

                            <div v-for="substage, sindex in substages">
                                <b>#
                                <span v-text='sindex+1'></span> </b>
                                <a @click="substageDetail(substage)">{{substage.name}}</a>
                            </div>
                        </div>
                        <div class="col-sm-12" v-if="substages.length==0">
                        There are no substages in {{current_stage.name}}
                        </div>
                    </div>

                    <div class="col-sm-12" >
                    <h1>Stages </h1>
                        <div v-for="stage, index in stages">
                            <b>#
                            <span v-text='index+1'></span> </b>
                            <a @click="stageDetail(stage)">{{stage.name}}</a>
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
        current_stage: '',
        substages: [],
        substage_detail: '',
        current_sub_stage: '',
        update_substage_mode: false,
        sub_stage_form: '',
  },
  methods:{
            update_sub_stage: function (){
                var self = this;
                self.update_substage_mode = true;
            },
            update_sub_done: function (){
                var self = this;
                self.update_substage_mode = false;
            },
            loadSubStageDetail: function (sub_stage_id) {
            var self = this;
            self.loading = true;
            var options = {};

            function successCallback(response) {
                self.substage_detail = response.body;
                self.loading = false;
            }

            function errorCallback() {
                self.loading = false;
                console.log('failed');
            }
            self.$http.get('/forms/api/sub-stage-detail/'+sub_stage_id+'/', {
                params: options
            }).then(successCallback, errorCallback);
        },
        loadSubStages: function (stage_id) {
            var self = this;
            self.loading = true;
            var options = {};

            function successCallback(response) {
                self.substages = response.body;
                self.loading = false;
            }

            function errorCallback() {
                self.loading = false;
                console.log('failed');
            }
            self.$http.get('/forms/api/sub-stage-list/'+stage_id+'/', {
                params: options
            }).then(successCallback, errorCallback);
        },
        loadStages: function () {
            var self = this;
            self.loading = true;
            var options = {};

            function successCallback(response) {
                self.stages = response.body;
                self.loading = false;
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
        save_sub_stage : function (){
            var self = this;
            self.error = "";
            self.update_substage_mode = false;
        },
        cancel_stage : function (){
            var self = this;
            self.show_ad_stage_form = false;
            self.stage_form_obj = {'name': '', 'description':'', 'id':''};
        },
        cancel_sub_stage : function (){
            var self = this;
            self.update_substage_mode = false;
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
        stageDetail : function (stage){
            var self = this;
            self.current_stage = stage;
        },

         substageDetail : function (stage){
            var self = this;
            self.current_sub_stage = stage;
        },
  },
  watch: {
    current_stage: function(newVal, oldVal) {
    var self = this;
    if (newVal){
      self.substages = [];
      self.substage_detail = '';
      self.loadSubStages(newVal.id);
      }

    },
    current_sub_stage: function(newVal, oldVal) {
    var self = this;
    if (newVal){
      self.substage_detail = '';
      self.loadSubStageDetail(newVal.id);
      }

    },
  },
  created(){
    var self= this;
    self.loadStages();
  },

})