import { AppState, initialState } from "./state";
import components from "./components";
import reducer from "./reducer";
import theme from "./theme";
import ClientAppConfig from "@cottage-software-inc/client-library/lib/lib/types/ClientAppConfig";
import AppDataContext from "./context";

export default {
  components,
  initialState,
  reducer,
  theme,
  appContext: AppDataContext,
  debug: {
    loggedInUserRecordId: "reck5328ZlEmTM9HC",
  },
} as ClientAppConfig<AppState>;
