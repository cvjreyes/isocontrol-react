import {
  Switch,
  Route,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";
import Register from "./pages/register/register";
import ChangePasswordPage from "./pages/changePassword/changePassword";
import Equipments from "./pages/equipments/equipments";
import Instrumentation from "./pages/instrumentation/instrumentation";
import Civil from "./pages/civil/civil";
import Electrical from "./pages/electrical/electrical";
import Home from "./pages/home/home";
import Piping from "./pages/piping/piping";
import ProgressCurve from "./pages/progressCurve/progressCurve";
import Navis from "./pages/navis/navis";
import WelcomeLoginF from "./pages/welcomeLoginF/welcomeLoginF";
import IsoCtrlF from "./pages/isoCtrlF/isoCtrlF";
import CSPTracker from "./pages/sptracker/sptracker";
import PITRequests from "./pages/pitrequests/pitrequests";
import PitRequestView from "./pages/pitRequestView/pitRequestView";
import PipingProduction from "./pages/pipingProduction/pipingProduction";
import PipingProgress from "./pages/pipingProgress/pipingProgress";
require("dotenv").config();

const CryptoJS = require("crypto-js");
const SecureStorage = require("secure-web-storage");
var SECRET_KEY = "sanud2ha8shd72h";

var secureStorage = new SecureStorage(localStorage, {
  hash: function hash(key) {
    key = CryptoJS.SHA256(key, SECRET_KEY);
    return key.toString();
  },
  encrypt: function encrypt(data) {
    data = CryptoJS.AES.encrypt(data, SECRET_KEY);
    data = data.toString();
    return data;
  },
  decrypt: function decrypt(data) {
    data = CryptoJS.AES.decrypt(data, SECRET_KEY);
    data = data.toString(CryptoJS.enc.Utf8);
    return data;
  },
});

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route
            exact
            path={"/" + process.env.REACT_APP_PROJECT + "/"}
            component={WelcomeLoginF}
          ></Route>
          <Route
            exact
            path={"/" + process.env.REACT_APP_PROJECT + "/isotracker"}
            component={IsoCtrlF}
          ></Route>
          <Route
            exact
            path={"/" + process.env.REACT_APP_PROJECT + "/home"}
            component={Home}
          ></Route>
          <Route
            exact
            path={"/" + process.env.REACT_APP_PROJECT + "/register"}
            component={Register}
          ></Route>
          <Route
            exact
            path={"/" + process.env.REACT_APP_PROJECT + "/changepassword"}
            component={ChangePasswordPage}
          ></Route>
          <Route
            exact
            path={"/" + process.env.REACT_APP_PROJECT + "/equipments"}
            component={Equipments}
          ></Route>
          <Route
            exact
            path={"/" + process.env.REACT_APP_PROJECT + "/instrumentation"}
            component={Instrumentation}
          ></Route>
          <Route
            exact
            path={"/" + process.env.REACT_APP_PROJECT + "/civil"}
            component={Civil}
          ></Route>
          <Route
            exact
            path={"/" + process.env.REACT_APP_PROJECT + "/electrical"}
            component={Electrical}
          ></Route>
          <Route
            exact
            path={"/" + process.env.REACT_APP_PROJECT + "/piping"}
            render={() => <Piping secureStorage={secureStorage} />}
          ></Route>
          <Route
            exact
            path={"/" + process.env.REACT_APP_PROJECT + "/3dprogress"}
            component={ProgressCurve}
          ></Route>
          <Route
            exact
            path={"/" + process.env.REACT_APP_PROJECT + "/navis"}
            component={Navis}
          ></Route>
          <Route
            exact
            path={"/" + process.env.REACT_APP_PROJECT + "/csptracker"}
            component={CSPTracker}
          ></Route>
          <Route
            exact
            path={"/" + process.env.REACT_APP_PROJECT + "/pitrequests"}
            component={PITRequests}
          ></Route>
          <Route
            exact
            path={"/" + process.env.REACT_APP_PROJECT + "/pitrequestsview"}
            component={PitRequestView}
          ></Route>
          <Route
            exact
            path={"/" + process.env.REACT_APP_PROJECT + "/pipingProduction"}
            component={PipingProduction}
          ></Route>
          <Route
            exact
            path={"/" + process.env.REACT_APP_PROJECT + "/pipingProgress"}
            component={PipingProgress}
          ></Route>
          <Redirect
            exact
            from="/"
            to={`${process.env.REACT_APP_PROJECT}/home`}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
