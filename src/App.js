import React, { Component } from 'react'
import './App.css';
import Form from './components/form'
import Control from './components/control'
import TaskForm from './components/taskForm'

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tasks : []
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

    render() {

        var { tasks } = this.state

        return (
            <div className="container">
                <div className="text-center">
                    <h1>Quản Lý Công Việc</h1>
                    <hr />
                </div>
                <div className="row">
                    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <div className="panel panel-warning">
                            <div className="panel-heading">
                                <h3 className="panel-title">Thêm Công Việc</h3>
                            </div>
                            <div className="panel-body">
                                {/* form */}

                                <Form />

                            </div>
                        </div>
                    </div>
                    <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                        <button type="button" className="btn btn-primary">
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
                                <TaskForm tasks = { tasks } />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;
