import React, { Component } from 'react'
import './App.css';
import Form from './components/form'
import Control from './components/control'
import TaskForm from './components/taskForm'

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tasks : [],
            isDisplayForm : false,
            taskEditing : null,
            filter : {
                name : '',
                status : -1
            }
        }
    }

    componentWillMount = () => {
        if (localStorage && localStorage.getItem('tasks'))
        {
            var tasks = JSON.parse(localStorage.getItem('tasks'))
            this.setState({
                tasks : tasks
            })
        }
    }

    //componentWillMount khi refesh thì sẽ hàm sẽ tự động được gọi lại và chỉ gọi duy nhất 1 lần

    onGenerateData = () => {
        var tasks = [
            {
                id : 1,
                name : 'name 1',
                status : true
            },
            {
                id : 2,
                name : 'name 2',
                status : true
            },
            {
                id : 3,
                name : 'name 3',
                status : false
            },
        ]

        console.log(tasks)

        this.setState({
            tasks : tasks
        })

        // ở đây nếu sử dụng bình thường khi refesh sẽ làm mấy đi data lưu trong state nên cần lưu ở dạng local storage

        localStorage.setItem('tasks', JSON.stringify(tasks))

    }

    //ham random

    s4(){
        return Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1)
    }

    random(){
        return this.s4() + this.s4() + this.s4() + this.s4() + this.s4()
    }


    onShowForm = () => {
        this.setState({
            isDisplayForm : !this.state.isDisplayForm
        })
    }

    onCLoseForm = () => {
        this.setState({
            isDisplayForm : false
        })
    }

    // hàm onSubmitInApp để nhận data từ form để đổ dữ liệu ra app
    onSubmitInApp = (data) => {
        // phân biệt data là data thêm vào hay là data update
        var { tasks } = this.state
        if (data.id === '')
        {
            // nếu không bắt được id thì cấp cho nó 1 cái id rồi tiến hành thêm mới
            data.id = this.random()
            tasks.push(data)
        }
        else
        {
            // nếu bắt được id thì lấy ra task đó theo id rồi tiến hành cập nhật nó
            var index = this.findIndex(data.id)
            tasks[index] = data
        }
        
        this.setState({
            tasks : tasks,
            // xét taskEditing = null để khi cập nhập xong thì clear data, thêm mới sẽ không bị ghi data cũ cảu id lên
            taskEditing : null
        })
        localStorage.setItem('tasks', JSON.stringify(tasks))
        this.onCLoseForm()
    }

    onUpdateStatus = (id) =>{
        var { tasks } = this.state
        var index = this.findIndex(id)
        console.log(index)
        if (index !== -1)
        {
            tasks[index].status = !tasks[index].status
            this.setState({
                tasks : tasks
            })
            localStorage.setItem('tasks', JSON.stringify(tasks))
        }
    }

    onDeleteStatus  = (id) => {
        var { tasks } = this.state
        var index = this.findIndex(id)
        console.log(index)
        if (index !== -1)
        {
            tasks.splice(index, 1)
            this.setState({
                tasks : tasks
            })
            localStorage.setItem('tasks', JSON.stringify(tasks))
        }
        this.onCLoseForm()
    }

    onEditTask = (id) => {
        var { tasks } = this.state
        var index = this.findIndex(id)
        var taskEditing = tasks[index]
        // console.log(taskEditing)
        this.setState({
            taskEditing : taskEditing
        })
        this.onShowForm()
    }

    findIndex = (id) => {
        var { tasks } = this.state
        var result = -1
        tasks.forEach((task, index) => {
            if (task.id === id)
            {
                result = index
            }
        })
        return result
    }

    // nhận dữ liệu từ TaskForm đổ ra
    onFilter = (filterName, filterStatus) => {
        console.log(filterName + " - " + filterStatus)
        filterStatus = parseInt(filterStatus)
        this.setState({
            filter : {
                name : filterName.toLowerCase(),
                // ép kiểu về chữ thường để khi nhập chữ hoa hay chữ thưởng thì đều filter được
                status : filterStatus
            }
        })
    }

    render() {

        var { tasks, isDisplayForm, taskEditing, filter } = this.state

        // lọc data
        // filter theo tên
        if (filter !== null){
            if (filter.name !== null){
                var tasks = tasks.filter((task) => {
                    return task.name.toLowerCase().indexOf(filter.name) !== -1
                })
            }
            // filter theo status, ở trường hợp này thì status luôn có giá trị nên k cần check giá trị nữa
            tasks = tasks.filter((task) => {
                if (filter.status === -1){
                    return task
                }
                else{
                    return task.status === (filter.status === 1 ? true : false )
                }
            })
        }

        console.log(filter)

        // add đóng mở form
        // onSubmitInApp={ this.onSubmitInApp } để nhận data từ bên form sau khi thêm data
        var elements = isDisplayForm ? <Form onSubmitInApp={ this.onSubmitInApp } task = { taskEditing } /> : ''

        return (
            <div className="container">
                <div className="text-center">
                    <h1>Quản Lý Công Việc</h1>
                    <hr />
                </div>
                <div className="row">

                    {/* đóng ở form khi bấm thêm công việc */}
                    <div className={ isDisplayForm === true ? "col-xs-4 col-sm-4 col-md-4 col-lg-4" : "col-xs-8 col-sm-8 col-md-8 col-lg-8" }>

                                {/* form */}
                                { elements }

                    </div>
                    <div className={ isDisplayForm === true ? "col-xs-8 col-sm-8 col-md-8 col-lg-8" : "col-xs-12 col-sm-12 col-md-12 col-lg-12" }>
                        <button type="button" className="btn btn-primary" onClick = { this.onShowForm }>
                            <span className="fa fa-plus mr-5" />Thêm Công Việc
                        </button>

                        <button 
                            type="button" 
                            className="btn btn-danger"
                            onClick = { this.onGenerateData }
                        >
                            Generate data
                        </button>

                        {/* Search - Sort */}
                        <Control />

                        <div className="row mt-15">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">

                                {/* taskForm */}
                                <TaskForm tasks = { tasks }
                                        onUpdateStatus = { this.onUpdateStatus }
                                        onDeleteStatus = { this.onDeleteStatus }
                                        onEditTask = { this.onEditTask }
                                        onFilter = { this.onFilter }
                                />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;
