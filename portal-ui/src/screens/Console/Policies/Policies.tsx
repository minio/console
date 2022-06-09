// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import { Route, Routes } from "react-router-dom";

import NotFoundPage from "../../NotFoundPage";
import withSuspense from "../Common/Components/withSuspense";

const ListPolicies = withSuspense(React.lazy(() => import("./ListPolicies")));
const PolicyDetails = withSuspense(React.lazy(() => import("./PolicyDetails")));

const Policies = () => {
  return (
    <Routes>
      <Route path={"/"} element={<ListPolicies />} />
      <Route path={`:policyName`} element={<PolicyDetails />} />
      <Route element={<NotFoundPage />} />
    </Routes>
  );
};

export default Policies;
