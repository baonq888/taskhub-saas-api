import expressLoader from "./expressLoader.js";
import swaggerLoader from "./swaggerLoader.js";
import routeLoader from "./routeLoader.js";
import consumerLoader from "./consumerLoader.js";
import {registerAutomationListeners} from "../modules/automation/automationListeners.js";

export default async function initLoaders(app) {
    expressLoader(app);
    swaggerLoader(app);
    routeLoader(app);
    await consumerLoader();
    await registerAutomationListeners();

}