var NormalQuestion = React.createClass({
    getInitialState: function () {
        return {'editing':false}
    },

    save: function () {
        this.props.updateQuestionText(
            this.refs.newText.value,
            this.refs.questionType.value,
            this.props.index,
            {
                project: this.refs.project && this.refs.project.value,
                project_field: this.refs.project && this.refs.project_field && this.refs.project_field.value,
            }
        );
        if (this.refs.questionType.value == 'mcq'){
            this.setState({type: 'mcq', options: []})
        }
        // console.log('save');
    },

    remove: function(){
        // console.log('Delete pressed.')
        this.props.deleteFromForm(this.props.index);
    },

    renderForm: function() {
        return(
            <div className="QuestionContainer form-row">
                <div className="form-group col-md-3">
                    <label for="input1" className="col-form-label">Input Label:</label>
                    <input type="text" ref="newText" className="form-control" onChange={this.save} placeholder="Attribute Label" defaultValue={this.props.question}></input>
                </div>
                <div className="form-group col-md-3">
                    <label for="input2" className="col-form-label">Input Type:</label>
                    <select className="form-control" ref="questionType" id="input2" onChange={this.save} defaultValue={this.props.question_type}>
                        <option value="Text">Text</option>
                        <option value="Number">Number</option>
                        <option value="Date">Date</option>
                        <option value="MCQ">MCQ</option>
                        <option value="Project">Reference Project</option>
                    </select>
                </div>

                {this.props.question_type === 'Project' && projects.length > 0 && (
                    <div className="form-group col-md-2">
                        <label className="col-form-label">Reference project: </label>
                        <select className="form-control" ref="project" onChange={this.save} defaultValue={this.props.project} required>
                            <option value="">Select a project</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                {this.props.question_type === 'Project' && projects.length > 0 && (
                    <div className="form-group col-md-2">
                        <label className="col-form-label">Reference field: </label>
                        {this.props.project && fields[this.props.project] && (
                            <select className="form-control" ref="project_field" onChange={this.save} defaultValue={this.props.project_field} required>
                                <option value="">Select a field</option>
                                {fields[this.props.project].map(field => (
                                    <option key={field.question_name} value={field.question_name}>{field.question_text}</option>
                                ))}
                            </select>
                        )}
                    </div>
                )}

                <div className="form-group col-md-2">
                    <label className="col-form-label"> &nbsp; </label>                     
                    <button className="btn btn-danger" type="button" id="removebutton" onClick={this.remove}><i className="la la-close"></i>Remove</button>
                </div>
            </div>

        );
    },
    render: function () {
        return this.renderForm();
    }
});

var Option = React.createClass({
    getInitialState: function () {
        return {editing: true}
    },

    edit:function(){
        this.setState({editing: true});
    },

    save: function () {
        this.props.updateOption(this.refs.newOptionText.value, this.props.index);
        // console.log('save');
    },

    remove:function(){
        // console.log('Delete pressed.' + this.props.index)
        this.props.deleteOption(this.props.index);
    },


    renderNormal:function(){
        // console.log("----"+this.props.option_text);
        return(
            <div className="QuestionContainer form-row">
                <div className="form-group col-md-3">
                    <label for="input1" className="col-form-label">Option {this.props.index + 1}:</label>
                    <input type="text" ref="newOptionText" className="form-control" onChange={this.save} defaultValue={this.props.option_text} placeholder= "Option Text"></input>
                </div>

                <div className="form-group col-md-2">
                    <label className="col-form-label"> &nbsp; </label>                     
                    <button className="btn btn-danger" type="button" id="removebutton" onClick={this.remove}><i className="la la-close"></i>Remove</button>
                </div>
            </div>

        );
    },
    render: function () {
        return this.renderNormal();
    }
});

var MCQQuestion = React.createClass({
    getInitialState: function () {
        return {options:this.props.options}
    },

    addOption:function () {
        // console.log(i);
        var arr =this.state.options;
        var new_option={"option_text":""};
        arr.push(new_option);
        this.setState({options: arr});
        // console.log(arr);
    },

    save: function () {
        this.props.updateMCQOptions(this.state.options, this.props.index);
        this.props.updateQuestionText(this.refs.newText.value, this.refs.questionType.value, this.props.index);
        // console.log('save');
    },

    updateOption: function(newTextoption, i){
        // console.log('Removing Question:' + i);
        var arr= this.state.options;
        arr[i].option_text = newTextoption;
        this.setState({options: arr});
        // console.log(this.state.options);
        this.props.updateMCQOptions(this.state.options, this.props.index);
    },

    deleteOption: function(i){
        // console.log('Removing Question:' + i);
        var arr= this.state.options;
        // console.log(i);
        // arr[i];
        // arr.splice(i, 1);
        arr[i].is_deleted=true;
        // console.log(this.state.options);
        // this.setState({options:[]});
        // this.setState({options:arr});
        this.setState({options:arr})
        // console.log(this.state.options);

        this.props.updateMCQOptions(this.state.options, this.props.index);
    },

    remove:function(){
        console.log('Delete pressed.')
        this.props.deleteFromForm(this.props.index);
    },


    eachOption: function (obj, j){
        // console.log(text);
        if(!obj.hasOwnProperty('is_deleted')){
            return(
                <Option key={j} index={j} option_text={obj.option_text} deleteOption={this.deleteOption} updateOption={this.updateOption}/>
            );
        }},

    renderForm:function(){
        // this.state.options = this.props.options;
        return(
            <div>
                <div className="QuestionContainer form-row">
                    <div className="form-group col-md-3">
                        <label for="input1" className="col-form-label">Input Label:</label>
                        <input type="text" ref="newText" className="form-control" onChange={this.save} placeholder="Attribute Label" defaultValue={this.props.question}></input>
                    </div>
                    <div className="form-group col-md-3">
                        <label for="input2" className="col-form-label">Input Type:</label>
                        <select className="form-control" ref="questionType" id="input2" onChange={this.save} defaultValue={this.props.question_type}>
                            <option value="Text">Text</option>
                            <option value="Number">Number</option>
                            <option value="Date">Date</option>
                            <option value="MCQ">MCQ</option>
                            <option value="Project">Reference Project</option>
                        </select>
                    </div>



                    <div className="form-group col-md-3">
                        <label className="col-form-label"> &nbsp; </label>                     

                        <button className="btn btn-danger" type="button" id="removebutton" onClick={this.remove}><i className="la la-close"></i>Remove</button>


                    </div>
                </div>
                {
                    // console.log(text.mcq_options);
                    // text.mcq_options.map(this.eachOption)
                    // text.mcq_options.forEach(function (item, j, mapObj){
                    //      return(
                    //         <Option key={j} index={j} question={item.question_text} question_type={item.question_type}  />
                    //         );
                    //      })
                    this.state.options.map(this.eachOption)

                }
                <button onClick={this.addOption} className="btn btn-primary"><i className="la la-plus"></i>Add New</button>

            </div>

        );
    },
    render: function () {
        return this.renderForm();

    }
});

var Form = React.createClass({
    getInitialState: function () {
        return {
            Questions: _json_question
        }
    },

    addQuestion: function (text) {
        var arr =this.state.Questions;

        var question = {
            "question_text": "",
            "question_type": "textual",
            "question_name": ""
        }
        arr.push(question);

        this.setState({Questions: arr});
    },

    save: function () {
        if(this.state.Questions.length < 1) {
            return alert("No Any Questions Found.");
        } 
        var json_convertible = this.state.Questions.filter(function(item) {
            // return item.is_deleted == false;

            if (!item.hasOwnProperty('is_deleted')){
                return item;
            }
            else if (item.hasOwnProperty('is_deleted') && item.is_deleted == false){
                delete item.is_deleted;
                // console.log(item);
                return item;
            }});
        for (var key in json_convertible) {
            json_convertible[key].question_name = json_convertible[key].question_text.replace(/\W/g,"_");
        }

        // console.log(json_convertible);
        var json_Question = JSON.stringify(json_convertible);


        document.getElementById('json_questions').value = json_Question;
        document.getElementById('theForm').submit();
    },

    removeQuestion: function(i){
        // console.log('Removing Question:' + i);
        var arr= this.state.Questions;
        arr[i].is_deleted=true;
        // var newArray = arr.filter(function (item) {
        //     if (!item.hasOwnProperty('is_deleted')){
        //    console.log(item);
        //         return item;
        //     }
        //     else if (item.hasOwnProperty('is_deleted') && item.is_deleted == false){
        //         delete item.is_deleted;
        //         console.log(item);
        //         return item;
        // }
        // });
        this.setState({Questions: arr});
    },

    updateQuestion: function (newtext, questionType, i, extra = {}) {
        var arr = this.state.Questions;
        if(arr[i].question_type == "MCQ" && questionType != "MCQ"){
            delete arr[i].mcq_options;
            // console.log(arr[i]);           
        }
        else{
            if(questionType == "MCQ"){
                arr[i].mcq_options=[];
            }
        }
        arr[i].question_text=newtext;
        arr[i].question_type=questionType;

        arr[i].project = extra.project;
        arr[i].project_field = extra.project_field;
        // var newArray = arr.filter(function (item) {
        //     if (!item.hasOwnProperty('is_deleted')){
        //         return item;
        //     }
        //     else if (item.hasOwnProperty('is_deleted') && item.is_deleted == false){
        //         delete item.is_deleted;
        //         console.log(item);
        //         return item;
        // }
        // });

        this.setState({Questions:arr});
    },

    updateMCQOptions: function (options, i){
        var arr = this.state.Questions;
        var newOptionsArray = options.filter(function (op) {
            if (!op.hasOwnProperty('is_deleted')){
                return op
            }

        });
        // console.log(newOptionsArray);
        arr[i].mcq_options=newOptionsArray;

        this.setState({Questions:arr});
    },

    // updateMCQQuestion: function (newtext, questionType, mcq_options, i) {
    //         // console.log('Updating Question');
    //         var arr = this.state.Questions;
    //         if(arr[i].question_type == "MCQ" && questionType != "MCQ"){
    //                  delete arr[i].mcq_options;
    //         }else{
    //             arr[i].question_text=newtext;
    //             arr[i].question_type=questionType;
    //             arr[i].mcq_options=mcq_options;
    //         }
    //         // if(questionType == "MCQ"){
    //         //         arr[i].mcq_options=[];
    //         //     }
    //         this.setState({Questions:arr});
    //         console.log(arr);
    //     },
    eachQuestion: function (question, i){
        if(!question.hasOwnProperty('is_deleted') || (question.hasOwnProperty('is_deleted') && question.is_deleted == false)){
            if (question.question_type=="MCQ" ) {
                return (
                    <MCQQuestion key={i} index={i} options={question.mcq_options} question={question.question_text} question_type={question.question_type}  updateQuestionText={this.updateQuestion} updateMCQOptions={this.updateMCQOptions} deleteFromForm={this.removeQuestion} />
                );
            }  else {
                return (
                    <NormalQuestion
                        key={i}
                        index={i}
                        question={question.question_text}
                        question_type={question.question_type}
                        project={question.project}
                        project_field={question.project_field}
                        updateQuestionText={this.updateQuestion}
                        deleteFromForm={this.removeQuestion}
                    />
                );
            }
        }
    },
    render: function () {
        return (
            <div>
                {this.state.Questions.map(this.eachQuestion)}
                <button onClick={this.addQuestion.bind(null, 'New Question')} className="btn btn-primary"><i className="la la-plus"></i>Add New</button>
                <button onClick={this.save.bind()} className="btn btn-success pull-right"><i className="la la-save"></i>Save Form</button>
            </div>
        );
    }
});


ReactDOM.render(<Form /> , document.getElementById('app')
);

