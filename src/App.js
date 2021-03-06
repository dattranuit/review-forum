import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Thread from './components/ListThread';
import Post from './components/ListPost'
import NewThread from './components/NewThread'
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Fragment } from 'react';
function App() {
  return (
    <Fragment>
      <BrowserRouter>
      <Navbar />
        <Switch>
          <div className="container">
            <Route exact path="/forum/thread/:id" component={Post}></Route>
            <Route exact path="/forum/" component={Thread}></Route>
            <Route exact path="/forum/new-thread" component={NewThread}></Route>
            {/* <Redirect from="/" to="/forum/" /> */}
          </div>
        </Switch>
        {/* <Footer /> */}
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
