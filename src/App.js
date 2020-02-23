import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import AssignmentView from './components/AssignmentView'
import ClassView from './components/ClassView'
import Login from './components/Login'
import TeacherClassView from './components/TeacherClassView';
import TeacherAssignmentView from './components/TeacherAssignmentView';
import AddAssignment from './components/AddAssignment';
import NewUser from './components/NewUser';
function App() {

  return (
    <div className="App">
    <Router>
    <div>
      <Switch>
        <Route exact path="/">
          <Login/>
        </Route>
        <Route path="/class/:id">
          <ClassView/>
        </Route>
        <Route path="/admin/class/:id">
          <TeacherClassView/>
        </Route>
        <Route path="/signup" component={NewUser}/>
        <Route path="/admin/addAssignment/:classId" component={AddAssignment}/>
        <Route path="/assignment/:id" component={AssignmentView}/>
        <Route path="/admin/assignment/:id" component={TeacherAssignmentView}/>
      </Switch>
    </div>
    </Router>
    </div>
  );
}

export default App;
