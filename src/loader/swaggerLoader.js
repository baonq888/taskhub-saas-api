import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../core/swagger/swagger.js";

export default function swaggerLoader(app) {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            swaggerOptions: {
                filter: true,
                displayRequestDuration: true,
            },
        })
    );
}