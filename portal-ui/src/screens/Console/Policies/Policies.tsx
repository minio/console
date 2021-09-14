// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import history from "../../../history";
import { Route, Router, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { AppState } from "../../../store";
import { setMenuOpen } from "../../../actions";
import NotFoundPage from "../../NotFoundPage";

import ListPolicies from "./ListPolicies";
import PolicyDetails from "./PolicyDetails";

const mapState = (state: AppState) => ({
  open: state.system.sidebarOpen,
});

const connector = connect(mapState, { setMenuOpen });

const Users = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/policies/" exact={true} component={ListPolicies} />
        <Route path="/policies/*" component={PolicyDetails} />
        <Route path="/" component={ListPolicies} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
};

export default withRouter(connector(Users));
