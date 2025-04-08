import swaggerJsDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as glob from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const apiPaths = glob.sync(path.join(__dirname, "../../modules/**/*/*.js"));

const swaggerSpec = swaggerJsDoc({
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "TaskHub API",
            version: "1.0.0",
            description: "API documentation for TaskHub"
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },
            schemas: {
                Tenant: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid"
                        },
                        name: {
                            type: "string"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                User: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid"
                        },
                        email: {
                            type: "string"
                        },
                        password: {
                            type: "string"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                Task: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid"
                        },
                        title: {
                            type: "string"
                        },
                        description: {
                            type: "string"
                        },
                        assignedTo: {
                            type: "array",
                            items: {
                                type: "string",
                                format: "uuid"
                            }
                        },
                        status: {
                            type: "string",
                            enum: ["TODO", "IN_PROGRESS", "DONE"]
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        },
                        deadline: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                Project: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid"
                        },
                        name: {
                            type: "string"
                        },
                        description: {
                            type: "string"
                        },
                        tenantId: {
                            type: "string",
                            format: "uuid"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                Board: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid"
                        },
                        name: {
                            type: "string"
                        },
                        projectId: {
                            type: "string",
                            format: "uuid"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                }
            }
        },
        security: [{ bearerAuth: [] }],
        servers: [{ url: "https://localhost:3000/api" }],
    },
    apis: apiPaths, });

export default swaggerSpec;