Vue.use(VueMultiselect);
window.app = new Vue({
  el: '#app',
  template: `
    <div class="row">
        <div class="col-md-4">
            <div class="widget-info bg-white padding" >
                <div class="widget-head">
                    <h4>Stages</h4>
                </div>
                <div class="widget-body">
                    <ul class="stage-list"  v-if="stages.length>0">
                        <li v-for="stage, index in stages"><span>{{index+1}}.</span> <a @click="stageDetail(stage)">{{stage.name}}</a></li>
                    </ul>
                    <ul class="stage-list" v-if="stages.length==0">
                        <li><span>There are no Stages.. Please Add Stages</span></li>
                    </ul>

                    <a href="javascript:void(0)"  title="" class="btn btn-sm btn-primary margin-top" @click="add_stage"><i class="la la-plus"></i> New Stage</a>

                    <div class="margin-top" v-show="show_ad_stage_form">
                        <form class="padding-top" >
                            <div class="error" v-show="error">
                                {{error}}
                            </div>
                            <div class="form-group">
                                <label for="inputStageName">Name</label>
                                <input type="text" class="form-control" id="inputStageName" v-model="stage_form_obj.name">
                            </div>
                            <div class="form-group">
                                <label for="inputStageDescription">Description</label>
                                <textarea class="form-control" id="inputStageDescription" rows="3"
                                    v-model="stage_form_obj.description"></textarea>
                            </div>
                            <div class="form-group">
                                <a @click="save_stage" title=""  class="btn btn-sm btn-primary"><i class="la la-save"></i> Save</a>
                                <a @click="cancel_stage" class="btn btn-sm btn-warning"><i class="la la-cancel"></i>Cancel</a>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </div>
        <div class="col-md-4">

            <div class="widget-info bg-white padding" v-if="current_stage">
                <div class="widget-head">
                    <h4>{{current_stage.name}}</h4>
                </div>
                <div class="widget-body">
                    <p>{{current_stage.description}}</p>
                    <a @click="update_stage" class="btn btn-sm btn-primary" v-show="!show_ad_substage_form">Update Stage</a>
                </div>
                <div class="widget-head margin-top padding-left" v-show="!show_ad_substage_form">
                    <h4 v-show="substages.length>0">Sub Stages</h4>
                    <h4 v-show="substages.length==0">No SubStages In this Stage</h4>
                </div>
                <div class="widget-body overflow-auto">
                    <ul class="stage-list padding-left" >
                        <li class="active" v-for="substage, sindex in substages"><span>{{sindex+1}}.</span>
                         <a @click="substageDetail(substage)">{{substage.name}}</a></li>
                    </ul>

                    <a  @click="add_substage" class="btn btn-sm btn-primary margin-top" v-show="!substage_detail && !show_ad_substage_form">
                    <i class="la la-plus"></i> New Sub Stage</a>

                    <div class="margin-top" v-show="show_ad_substage_form">
                        <form class="padding-top">
                            <div class="form-group">
                                <label for="inputSubStageName">Name <span class="error" v-show="add_sub_error"> {{add_sub_error}} </span></label>
                                <input type="text" v-model="substage_form_obj.name" class="form-control" id="inputSubStageName">
                            </div>
                            <div class="form-group">
                                <label for="inputSubStageDescription">Description</label>
                                <textarea class="form-control" v-model="substage_form_obj.description" id="inputSubStageDescription" rows="3"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="inputSubStageForm">Form</label>
                                <vselect :options="forms" label="title" :value="''" v-model="substage_form_obj.xf" :allow-empty="true" :loading="loading"
                                 :select-label="''" :show-labels="false" :internal-search="true"  :placeholder="'Select Form'" :multiple=false track-by="id" :hide-selected="true">
                                <template slot="noResult">Forms Available</template>
                                <template slot="afterList" slot-scope="props"><div v-show="forms.length==0" class="wrapper-sm bg-danger">
                                No Forms</div></template>
                            </vselect>
                            </div>
                            <div class="form-group">
                                <label for="inputSubStageWeight">Weight</label>
                                <input type="number" min="0" max="100" v-model="substage_form_obj.weight" class="form-control" id="inputSubStageWeight">
                            </div>
                            <div class="form-group">
                                <label for="inputSubStageTags">Tags</label>
                                <vselect :options="tags" label="name" :value="[]" v-model="substage_form_obj.selected_tags" :allow-empty="true" :loading="loading"
                                     :select-label="''" :show-labels="false" :internal-search="true"  :placeholder="'Select Tags'" :multiple=true track-by="id" :hide-selected="true">
                                    <template slot="noResult">NO tags Available</template>
                                    <template slot="afterList" slot-scope="props"><div v-show="forms.length==0" class="wrapper-sm bg-danger">
                                    No Tags</div></template>
                                </vselect>

                            </div>
                            <div class="form-group">
                                <a @click="save_sub_stage" class="btn btn-sm btn-primary"><i class="la la-save"></i> Save</a>
                                <a @click="cancel_sub_stage" class="btn btn-sm btn-warning"><i class="la la-close"></i> Cancel</a>
                            </div>

                        </form>
                    </div>


                </div>
            </div>
            <div class="margin-top" v-show="update_stage_mode">
                <form class="padding-top">
                    <div class="error" v-show="update_error">
                    {{update_error}}
                    </div>
                      <div class="form-group">
                      <label for="inputStageName">Stage Name</label>
                        <input v-model="stage_form_obj_edit.name" class="form-control" placeholder="Stage Name">
                      </div>
                      <div class="form-group">
                       <label for="inputStageDescription">Description</label>
                        <textarea v-model="stage_form_obj_edit.description" class="form-control" placeholder="Description" rows="3"></textarea>
                      </div>
                      <div class="form-group">
                        <a @click="do_update_stage" class="btn btn-sm btn-primary"><i class="la la-save"></i> Save</a> &nbsp;
                        <a @click="update_stage_done" class="btn btn-sm btn-warning"><i class="la la-cancel"></i>Cancel</a>
                        </div>
                </form>
            </div>
        </div>
        <div class="col-md-4">
            <div class="widget-info bg-white padding" v-show="substage_detail && !update_substage_mode">
                <div class="widget-head">
                    <h4>1. {{substage_detail.name}}</h4>
                </div>
                <div class="widget-body">
                    <p>{{substage_detail.description}}</p>
                    Responses : {{substage_detail.responses_count}} <br>
                    Form Assigned : {{form_name}} <br>
                    Weight : {{substage_detail.weight}} <br>
                    Tags :[t1, t2, t3] <br>
                    <a @click="update_sub_stage" class="btn btn-primary">Update Sub Stage</a>
                </div>
            </div>
            <div class="margin-top" v-show="update_substage_mode && substage_detail">
                        <form class="padding-top">
                            <div class="form-group">
                                <label for="inputSubStageName">Name <span class="error" v-show="add_sub_error"> {{add_sub_error}} </span></label>
                                <input type="text" v-model="substage_detail.name" class="form-control" id="inputSubStageName">
                            </div>
                            <div class="form-group">
                                <label for="inputSubStageDescription">Description</label>
                                <textarea class="form-control" v-model="substage_detail.description" id="inputSubStageDescription" rows="3"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="inputSubStageForm">Form</label>
                                <vselect :options="forms" label="title" :value="''" v-model="form" :allow-empty="true" :loading="loading"
                             :select-label="''" :show-labels="false" :internal-search="true"  :placeholder="'Select Form'" :multiple=false track-by="id" :hide-selected="true">
                            <template slot="noResult">Forms Available</template>
                            <template slot="afterList" slot-scope="props"><div v-show="forms.length==0" class="wrapper-sm bg-danger">
                            No Forms</div></template>
                            </vselect>
                            </div>
                            <div class="form-group">
                                <label for="inputSubStageWeight">Weight</label>
                                <input type="number" min="0" max="100" v-model="substage_detail.weight" class="form-control" id="inputSubStageWeight">
                            </div>
                            <div class="form-group">
                                <label for="inputSubStageTags">Tags</label>
                                <vselect :options="tags" label="name" :value="[]" v-model="substage_detail.selected_tags" :allow-empty="true" :loading="loading"
                                     :select-label="''" :show-labels="false" :internal-search="true"  :placeholder="'Select Tags'" :multiple=true track-by="id" :hide-selected="true">
                                    <template slot="noResult">NO tags Available</template>
                                    <template slot="afterList" slot-scope="props"><div v-show="forms.length==0" class="wrapper-sm bg-danger">
                                    No Tags</div></template>
                                </vselect>

                            </div>
                            <div class="form-group">
                                <a @click="do_update_sub_stage" class="btn btn-sm btn-primary"><i class="la la-save"></i> Save</a>
                                <a @click="cancel_sub_stage" class="btn btn-sm btn-warning"><i class="la la-close"></i> Cancel</a>
                            </div>

                        </form>
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
        update_error: '',
        add_sub_error: '',
        update_sub_error: '',
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
                self.update_error = "";
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
                self.update_error = "";
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

        self.update_error = "";
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
              self.update_error = response.body.error;
            }else{
                self.update_error = "Incorrect Form Data !.";

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