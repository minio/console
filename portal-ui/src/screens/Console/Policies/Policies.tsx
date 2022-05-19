// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import history from "../../../history";
import { Route, Router, Switch, withRouter } from "react-router-dom";

import NotFoundPage from "../../NotFoundPage";
import withSuspense from "../Common/Components/withSuspense";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";

const ListPolicies = withSuspense(React.lazy(() => import("./ListPolicies")));
const PolicyDetails = withSuspense(React.lazy(() => import("./PolicyDetails")));

const Policies = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route
          path={IAM_PAGES.POLICIES}
          exact={true}
          component={ListPolicies}
        />
        <Route
          path={`${IAM_PAGES.POLICIES}/:policyName+`}
          component={PolicyDetails}
        />
        <Route path="/" component={ListPolicies} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
};

export default withRouter(Policies);
