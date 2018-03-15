Vue.use(VueMultiselect);
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

                    <div class="col-sm-12" v-show="update_stage_mode">
                    <form class="form">
                        <div class="col-sm-12" v-show="error">
                        {{error}}
                        </div>
                          <div class="form-group">
                            <input v-model="stage_form_obj_edit.name" class="form-control" placeholder="Stage Name">
                          </div>
                          <div class="form-group">
                            <textarea v-model="stage_form_obj_edit.description" placeholder="Description"></textarea>
                          </div>
                            <a @click="do_update_stage" class="btn btn-primary">Save</a> &nbsp;
                            <a @click="update_stage_done" class="btn btn-warning">Cancel</a>
                    </form>
                    </div>

                    <div class="col-sm-12" v-show="show_ad_substage_form">
                    <form class="form">

                      <div class="form-group">
                          Name <span class="error" v-show="error"> {{error}} </span>
                            <input v-model="substage_form_obj.name" class="form-control" placeholder="Sub Stage Name">
                          </div>
                          <div class="form-group">
                          Description
                            <textarea v-model="substage_form_obj.description" placeholder="Description"></textarea>
                          </div>
                          <div class="form-group">
                          Weight
                            <input v-model="substage_form_obj.weight" placeholder="weight" type="number" minimum="0"></input>
                          </div>
                          <div class="col-lg-12 col-sm-12 form-group">
                          <label>Show Form when Site Type is :</label>
                        <vselect :options="tags" label="name" :value="[]" v-model="substage_form_obj.selected_tags" :allow-empty="true" :loading="loading"
                         :select-label="''" :show-labels="false" :internal-search="true"  :placeholder="'Select Tags'" :multiple=true track-by="id" :hide-selected="true">
                        <template slot="noResult">NO tags Available</template>
                        <template slot="afterList" slot-scope="props"><div v-show="forms.length==0" class="wrapper-sm bg-danger">
                        No Tags</div></template>
                        </vselect>
                        </div>

                          <div class="col-lg-12 col-sm-12 form-group">
                            <label>Form:</label>
                            <vselect :options="forms" label="title" :value="''" v-model="substage_form_obj.xf" :allow-empty="true" :loading="loading"
                             :select-label="''" :show-labels="false" :internal-search="true"  :placeholder="'Select Form'" :multiple=false track-by="id" :hide-selected="true">
                            <template slot="noResult">Forms Available</template>
                            <template slot="afterList" slot-scope="props"><div v-show="forms.length==0" class="wrapper-sm bg-danger">
                            No Forms</div></template>
                            </vselect>
                          </div>

                            <a @click="save_sub_stage" class="btn btn-primary">Save</a> &nbsp;
                            <a @click="cancel_sub_stage" class="btn btn-warning">Cancel</a>
                    </form>
                    </div>

                    <div class="col-sm-12" v-show="update_substage_mode && substage_detail">
                    <form class="form">
                        <div class="col-sm-12" v-show="error">
                        {{error}}
                        </div>
                          <div class="form-group">
                          Name:
                            <input v-model="substage_detail.name" class="form-control" placeholder="Sub Stage Name">
                          </div>
                          <div class="form-group">
                          Description
                            <textarea v-model="substage_detail.description" placeholder="Description"></textarea>
                          </div>
                          <div class="form-group">
                          Weight
                            <input v-model="substage_detail.weight" placeholder="weight" type="number" minimum="0" step="1"></input>
                          </div>
                          <div class="col-lg-12 col-sm-12 form-group">
                          <label>Show Form when Site Type is :</label>
                        <vselect :options="tags" label="name" :value="[]" v-model="substage_detail.selected_tags" :allow-empty="true" :loading="loading"
                         :select-label="''" :show-labels="false" :internal-search="true"  :placeholder="'Select Tags'" :multiple=true track-by="id" :hide-selected="true">
                        <template slot="noResult">NO tags Available</template>
                        <template slot="afterList" slot-scope="props"><div v-show="forms.length==0" class="wrapper-sm bg-danger">
                        No Tags</div></template>
                        </vselect>
                        </div>

                          <div class="form-group" v-show="!substage_detail.stage_forms && !form">
                            No Form Assigned Yet Choose One !!
                          </div>

                          <div class="col-lg-12 col-sm-12 form-group">
                            <label>Form:</label>
                            <vselect :options="forms" label="title" :value="''" v-model="form" :allow-empty="true" :loading="loading"
                             :select-label="''" :show-labels="false" :internal-search="true"  :placeholder="'Select Form'" :multiple=false track-by="id" :hide-selected="true">
                            <template slot="noResult">Forms Available</template>
                            <template slot="afterList" slot-scope="props"><div v-show="forms.length==0" class="wrapper-sm bg-danger">
                            No Forms</div></template>
                            </vselect>
                        </div>

                            <a @click="do_update_sub_stage" class="btn btn-primary">Update</a> &nbsp;
                            <a @click="cancel_sub_stage" class="btn btn-warning">Cancel</a>
                    </form>
                    </div>

                    <div class="col-sm-12" v-if="substage_detail && !update_substage_mode">
                    <h4> Sub Stage Detail </h4>

                    Name : {{substage_detail.name}} <br>
                    Description : {{substage_detail.description}} <br>
                    Responses : {{substage_detail.responses_count}} <br>

                    Form Assigned : {{form_name}} <br>
                    Weight : {{substage_detail.weight}} <br>
                    Tags :[t1, t2, t3] <br>
                    <a @click="update_sub_stage" class="btn btn-primary">Update Sub Stage</a> &nbsp;
                    </div>

                    <div class="col-sm-12" v-if="current_stage">
                        <div class="panel" v-show="!substage_detail && !show_ad_substage_form">
                        <a class="btn btn-info" @click="add_substage">Add Sub Stage</a></div>
                        <div class="col-sm-12">
                            <h2>Stage Detail </h2>
                            <a @click="update_stage" class="btn btn-primary">Update Stage</a> <br>
                            Stage :{{current_stage.name}} <br>
                            Description :{{current_stage.description}}

                            <div v-for="substage, sindex in substages">
                                <b>#
                                <span v-text='sindex+1'></span> </b>
                                <a @click="substageDetail(substage)">{{substage.name}}</a>
                            </div>
                            <div class="col-sm-12" v-if="substages.length==0 && !show_ad_substage_form">
                        There are no substages in {{current_stage.name}}
                        </div>
                        </div>

                    </div>

                    <div class="col-sm-12" >
                    <h1>Stages </h1>
                        <div v-for="stage, index in stages">
                            <b>#
                            <span v-text='index+1'></span> </b>
                            <a @click="stageDetail(stage)">{{stage.name}}</a>
                        </div>
                        <div class="col-sm-12" v-if="stages.length==0">
                        There are no Stages ..
                        </div>
                    </div>

                    <div class="col-sm-12" >
                    <h1>Sort Stages </h1>
                         <div id="main">

                            <div class="drag">
                                <draggable :list="stages" class="dragArea">
                                    <div v-for="stage in stages" class="dragable-stage">{{stage.name}}</div>
                                 </draggable>
                             </div>
                         </div>

                    </div>

                </div>
            </div>
        </div> `,
    components: {'vselect': VueMultiselect.default,},
  data: {
        stages: [],
        loading: false,
        is_project: configure_settings.is_project,
        pk: configure_settings.id,
        error: '',
        show_ad_stage_form: false,
        show_ad_substage_form: false,
        stage_form_obj: {'name': '', 'description':'', 'id':''},
        substage_form_obj: {'name': '', 'description':'', 'weight':0, tags:[],'xf':''},
        current_stage: '',
        substages: [],
        substage_detail: '',
        current_sub_stage: '',
        update_substage_mode: false,
        update_stage_mode: false,
        sub_stage_form: '',
        forms: [],
        tags: [{'id': 1, 'name':'Tag 1'}, {'id': 2, 'name':'Tag 2'}, {'id': 3, 'name':'Tag 3'}],
        form: '',
        selected_tags: [],
        stage_form_obj_edit: '',
  },
  methods:{
        saveNewSubStage: function () {
        var self = this;
        let csrf = $('[name = "csrfmiddlewaretoken"]').val();
        let options = {headers: {'X-CSRFToken':csrf}};
        self.substage_form_obj.order = self.substages.length;
        function successCallback (response){
        console.log(response.body);

        self.error = "";
            new PNotify({
          title: 'Sub Stage Saved',
          text: 'Sub Stage '+ response.body.name + ' Saved'
        });
        self.substages.push(response.body);
            self.show_ad_substage_form = false;

        }

        function errorCallback (response){
        console.log(response);
          new PNotify({
          title: 'failed',
          text: 'Failed to Save Sub Stage',
          type: 'error'
        });
            if(response.body.error){
            console.log(response.body.error)
              self.error = response.bodyText;
            }else{
                self.error = "Form Contains Invalid Inputs";

            }
        }
       self.$http.post('/forms/api/sub-stage-detail-create/'+self.current_stage.id+'/', self.substage_form_obj, options)
        .then(successCallback, errorCallback);


    },
            update_sub_stage: function (){
                var self = this;
                console.log("update subupdate_sub_stagestage");
                self.update_substage_mode = true;
            },
            update_stage: function (){
                var self = this;
                self.error = "";
                console.log("update stage");
                self.stage_form_obj_edit = {'name':self.current_stage.name, 'id': self.current_stage.id, 'description':
                                            self.current_stage.description}
                self.update_stage_mode = true;
            },
            update_sub_done: function (){
                var self = this;
                self.update_substage_mode = false;
            },
            update_stage_done: function (){
                var self = this;
                self.error = "";
                self.update_stage_mode = false;
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
        loadKoboForms: function () {
            var self = this;
            self.loading = true;
            var options = {};

            function successCallback(response) {
                self.forms = response.body;
                self.loading = false;
            }

            function errorCallback() {
                self.loading = false;
                console.log('failed');
            }
            self.$http.get('/forms/api/xforms/', {
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

        add_substage : function (){
            var self = this;
            self.error = "";

            self.substage_form_obj = {'name': '', 'description':'', 'id':'', 'weight':0, 'tags':[], 'xf':''};
            self.show_ad_substage_form = true;
        },
        save_sub_stage : function (){
            var self = this;
            self.error = "";
            if(self.substage_form_obj.name.length >0){
                self.saveNewSubStage();
            }else{
            self.error = "Sub Stage Name Required";
            new PNotify({
          title: 'Required ',
          text: 'Sub Stage Name Required.',
          type: 'error'
        });

            }
        },
        do_update_sub_stage : function (){
            var self = this;
            self.error = "";
            self.saveExistingSubStage();

        },
        do_update_stage : function (){
            var self = this;
            self.error = "";
            self.saveExistingStage();

        },
        cancel_stage : function (){
            var self = this;
            self.show_ad_stage_form = false;
            self.stage_form_obj = {'name': '', 'description':'', 'id':''};
        },
        cancel_sub_stage : function (){
            var self = this;
            self.update_substage_mode = false;
            self.show_ad_substage_form = false;
            self.substage_form_obj = {'name': '', 'description':'', 'id':'', 'weight':0, 'tags':[], 'xf':''};;
            self.current_sub_stage = '';
            self.substage_detail = '';
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
    saveExistingSubStage: function () {
        var self = this;
        let csrf = $('[name = "csrfmiddlewaretoken"]').val();
        let options = {headers: {'X-CSRFToken':csrf}};
        self.substage_detail.xf = self.form;
        function successCallback (response){

        self.error = "";
            new PNotify({
          title: 'Sub Stage Updated',
          text: 'Sub Stage '+ response.body.name + ' Updated'
        });
        var index = self.substages.findIndex(x => x.id==response.body.id);


        Vue.set(self.substages, index, response.body);

        self.update_substage_mode = false;
        self.show_ad_substage_form = false;
        self.substage_form_obj = {'name': '', 'description':'', 'id':'', 'weight':0, 'tags':[], 'xf':''};;
        self.current_sub_stage = response.body;
        self.substage_detail = response.body;
        }

        function errorCallback (response){
          new PNotify({
          title: 'failed',
          text: 'Failed to Update sub Stage',
          type: 'error'
        });
            if(response.body.error){
            console.log(response.body.error)
              self.error = response.body.error;
            }else{
                self.error = "Incorrect Form Data !.";

            }
        }
       self.$http.put('/forms/api/sub-stage-detail/'+self.substage_detail.id+'/', self.substage_detail, options).then(successCallback, errorCallback);


    },
    saveExistingStage: function () {
        var self = this;
        let csrf = $('[name = "csrfmiddlewaretoken"]').val();
        let options = {headers: {'X-CSRFToken':csrf}};

        function successCallback (response){

        self.error = "";
            new PNotify({
          title: 'Stage Updated',
          text: 'Stage '+ response.body.name + ' Updated'
        });
        var index = self.stages.findIndex(x => x.id==response.body.id);


        Vue.set(self.stages, index, response.body);

        self.update_stage_mode = false;
        self.stage_form_obj_edit = '';
        self.current_stage = response.body;
        }

        function errorCallback (response){
          new PNotify({
          title: 'failed',
          text: 'Failed to Update Stage',
          type: 'error'
        });
            if(response.body.error){
            console.log(response.body.error)
              self.error = response.body.error;
            }else{
                self.error = "Incorrect Form Data !.";

            }
        }
       self.$http.put('/forms/api/configure-stage-update/'+self.stage_form_obj_edit.id+'/', self.stage_form_obj_edit, options).then(successCallback, errorCallback);


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
    substage_detail: function(newVal, oldVal) {
    var self = this;
    if (newVal){
        if(newVal.stage_forms){
            self.form = {'id':newVal.stage_forms.xf.id, 'title':newVal.stage_forms.xf.title};
       }else{
       self.form = '';
      }}else{
      self.form = '';
      }

    },
  },
    computed: {
    form_name: function() {
        var self = this;
        if(self.substage_detail.stage_forms){
            return self.substage_detail.stage_forms.xf.title;
            }
        return "No Form Assigned Yet";
    },
    },
  created(){
    var self= this;
    self.loadStages();
    self.loadKoboForms();
  },

})