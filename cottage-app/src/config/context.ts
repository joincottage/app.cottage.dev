import { createAppDataContext } from "@cottage-software-inc/client-library/lib/lib/helpers";
import { initialState } from "./state";

const AppDataContext = createAppDataContext<typeof initialState>(initialState);

export default AppDataContext;