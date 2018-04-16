

window.app = new Vue({
  el: '#peoples',
  template: `
    <div class="widget-info widget-scolling-large-list margin-top bg-white padding" data-mh="eq111">
        <div class="widget-head">
            <h4> People </h4>
            <a class="btn btn-xs btn-primary" :href="new_people_url"><i class="la la-plus"></i></a>

            <a class="btn btn-xs btn-primary" data-toggle="collapse" href="#searchProjectManager" aria-expanded="false" aria-controls="searchProjectManager"><i class="la la-search"></i></a>
        </div>
        <div class="widget-body">
            <div class="collapse margin-bottom" id="searchProjectManager">
			<form>
				<div class="input-group input-group-sm">
					<input type="text"  v-model="search_key" @change="searchChange()" class="form-control" placeholder="Search for..." aria-label="Search for...">
					<span class="input-group-btn">
						<button class="btn btn-primary" type="button"><i class="la la-search"></i>Search</button>
					</span>
				</div>
			</form>
		    </div>

		    <a href="#" class="project-item-wrap clearfix" v-for="u in peoples">
			<div class="project-logo">
				<img :src="u.image" alt="" width="50" height="50">
			</div>
			<div class="project-basic-info">
				<h4>{{u.name}}</h4>
				<p>{{ u.email }}</p>
                <p>{{ u.phone }}</p>
			</div>
		    </a>

        </div>

    </div> `,
  data: {
        peoples: [],
        new_people_url :'',
        search_key :'',
        loading: false,
        project_id: configure_settings.project_id,
  },

  methods:{
    loadDatas : function (){
    var self = this;

    var self = this;
    self.loading = true;
    if(self.search_key){
        var options = {'name':self.search_key};

    }else{
        var options = {};

    }

    function successCallback(response) {
        self.new_people_url = response.body.new_people_url;
        self.peoples = response.body.peoples;
        self.loading = false;
    }

    function errorCallback() {
        self.loading = false;
        console.log('failed');
    }
    self.$http.get('/fieldsight/api/project_peoples/'+self.project_id+'/', {
        params: options
    }).then(successCallback, errorCallback);

    },
    searchChange : function (){
        var self = this;
        self.loadDatas();

    },
  },
  created(){
    var self= this;
    self.loadDatas();
  },

})