import './App.css';
import IsoCtrl from './pages/isoCtrl/isoCtrl';
import { Switch, Route} from 'react-router-dom';
import { BrowserRouter as Router} from 'react-router-dom';
import Register from './pages/register/register';
import ChangePasswordPage from './pages/changePassword/changePassword';
import Equipments from './pages/equipments/equipments';
import Instrumentation from './pages/instrumentation/instrumentation';
import Civil from './pages/civil/civil';
import Electrical from './pages/electrical/electrical';
import Home from './pages/home/home'
import Piping from './pages/piping/piping';
import ProgressCurve from './pages/progressCurve/progressCurve';
import Navis from './pages/navis/navis';
import WelcomeLoginF from './pages/welcomeLoginF/welcomeLoginF';
import IsoCtrlF from './pages/isoCtrlF/isoCtrlF';
import CSPTracker from './pages/sptracker/sptracker';
import PITRequests from './pages/pitrequests/pitrequests';
import PitRequestView from './pages/pitRequestView/pitRequestView';
import PipingProduction from './pages/pipingProduction/pipingProduction'
import PipingProgress from './pages/pipingProgress/pipingProgress';
require('dotenv').config();

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
            <Route exact path={"/"+process.env.REACT_APP_PROJECT+"/"} component={WelcomeLoginF}></Route>
            <Route exact path={"/"+process.env.REACT_APP_PROJECT+"/isotracker"} component={IsoCtrlF}></Route>
            <Route exact path={"/"+process.env.REACT_APP_PROJECT+"/home"} component={Home}></Route>
            <Route exact path={"/"+process.env.REACT_APP_PROJECT+"/register"} component={Register}></Route>
            <Route exact path={"/"+process.env.REACT_APP_PROJECT+"/changepassword"} component={ChangePasswordPage}></Route>
            <Route exact path={"/"+process.env.REACT_APP_PROJECT+"/equipments"} component={Equipments}></Route>
            <Route exact path={"/"+process.env.REACT_APP_PROJECT+"/instrumentation"} component={Instrumentation}></Route>
            <Route exact path={"/"+process.env.REACT_APP_PROJECT+"/civil"} component={Civil}></Route>
            <Route exact path={"/"+process.env.REACT_APP_PROJECT+"/electrical"} component={Electrical}></Route>
            <Route exact path={"/"+process.env.REACT_APP_PROJECT+"/piping"} component={Piping}></Route>
            <Route exact path={"/"+process.env.REACT_APP_PROJECT+"/3dprogress"} component={ProgressCurve}></Route>
            <Route exact path={"/"+process.env.REACT_APP_PROJECT+"/navis"} component={Navis}></Route>
            <Route exact path={"/"+process.env.REACT_APP_PROJECT+"/csptracker"} component={CSPTracker}></Route>
            <Route exact path={"/"+process.env.REACT_APP_PROJECT+"/pitrequests"} component={PITRequests}></Route>
            <Route exact path={"/"+process.env.REACT_APP_PROJECT+"/pitrequestsview"} component={PitRequestView}></Route>
            <Route exact path={"/"+process.env.REACT_APP_PROJECT+"/pipingProduction"} component={PipingProduction}></Route>
            <Route exact path={"/"+process.env.REACT_APP_PROJECT+"/pipingProgress"} component={PipingProgress}></Route>
        </Switch>
      </Router>
  
    </div>
  );
}

export default App;
