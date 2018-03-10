window.app = new Vue({
  el: '#app',
  template: `
            <div>
            <div v-for="stage, index in stages">
                <b># <span v-text='index+1'></span>
                <span v-text='stage.name'></span></b><br>
                    <div v-for="sstage, sindex in stage.parent">
                    <b>&nbsp; &nbsp; &nbsp;# <span v-text='index+1'></span> .<span v-text='sindex+1'></span>
                    <span v-text='sstage.name'></span>&nbsp; &nbsp; &nbsp; Form(<span v-text='sstage.stage_forms.xf.title'></span>)
                    Weight( ??)
                    </b>

                    </div>

            </div>
             </div> `,
  data: {
    stages: [],
    loading: false,
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
            self.$http.get('/forms/api/stage/1/1', {
                params: options
            }).then(successCallback, errorCallback);
        },
  },
  created(){
    var self= this;
    console.log("hello");
    self.loadStages();
  },

})