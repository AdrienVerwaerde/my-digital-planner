export const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'My Digital Planner API',
        version: '1.0.0',
        description: 'API documentation for My Digital Planner.',
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local server',
        },
    ],
    tags: [
        { name: 'User', description: 'User operations' },
        { name: 'Events', description: 'User events and types' },
        { name: 'Locations', description: 'Locations' },
        { name: 'Availability', description: 'User availability' },
        { name: 'Suggestions', description: 'Event suggestions' },
        { name: 'Admin Events', description: 'Admin event management' },
        { name: 'Admin Locations', description: 'Admin location management' },
        { name: 'Admin Users', description: 'Admin user management' },
    ],
    paths: {
        // --- USER RELATED ---
        '/api/register': {
            post: {
                tags: ['User'],
                summary: 'Register a new user account',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' },
                                    name: { type: 'string' },
                                    surname: { type: 'string' },
                                },
                                required: ['email', 'password', 'name', 'surname'],
                            },
                        },
                    },
                },
                responses: { '200': { description: 'Registered' } },
            },
        },
        '/api/users': {
            post: {
                tags: ['User'],
                summary: 'Create a new user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    surname: { type: 'string' },
                                    email: { type: 'string' },
                                    password: { type: 'string' },
                                    role: { type: 'string' },
                                },
                                required: ['name', 'surname', 'email', 'password'],
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'User created' },
                },
            },
        },
        '/api/me': {
            get: {
                tags: ['User'],
                summary: 'Get current user information',
                responses: { '200': { description: 'Success' } },
            },
        },

        // --- EVENTS ---
        '/api/user-events': {
            get: {
                tags: ['Events'],
                summary: 'Get events for current user',
                responses: { '200': { description: 'Success' } },
            },
            post: {
                tags: ['Events'],
                summary: 'Create a user event',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    activity: { type: 'string' },
                                    date: { type: 'string', format: 'date-time' },
                                    locationId: { type: 'string' },
                                    eventTypeId: { type: 'string' },
                                },
                                required: ['activity', 'date', 'locationId'],
                            },
                        },
                    },
                },
                responses: { '200': { description: 'Event created' } },
            },
        },
        '/api/event-types': {
            get: {
                tags: ['Events'],
                summary: 'Get available event types',
                responses: { '200': { description: 'Success' } },
            },
        },

        // --- LOCATIONS ---
        '/api/locations': {
            get: {
                tags: ['Locations'],
                summary: 'Get all locations',
                responses: { '200': { description: 'Success' } },
            },
        },

        // --- AVAILABILITY ---
        '/api/availability': {
            post: {
                tags: ['Availability'],
                summary: 'Set availability for the current user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    date: { type: 'string', format: 'date-time' },
                                    isAvailable: { type: 'boolean' },
                                },
                                required: ['date', 'isAvailable'],
                            },
                        },
                    },
                },
                responses: { '200': { description: 'Availability updated' } },
            },
        },

        // --- SUGGESTIONS ---
        '/api/event-suggestions': {
            post: {
                tags: ['Suggestions'],
                summary: 'Send an event suggestion',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    location: { type: 'string' },
                                    hour: { type: 'string', format: 'date-time' },
                                    message: { type: 'string' },
                                },
                                required: ['name', 'location', 'hour'],
                            },
                        },
                    },
                },
                responses: { '200': { description: 'Suggestion saved' } },
            },
        },

        // --- ADMIN EVENTS ---
        '/api/admin/events': {
            get: {
                tags: ['Admin Events'],
                summary: 'Get all events (admin)',
                responses: { '200': { description: 'Success' } },
            },
            post: {
                tags: ['Admin Events'],
                summary: 'Create event (admin)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    activity: { type: 'string' },
                                    locationIds: {
                                        type: 'array',
                                        items: { type: 'string' },
                                    },
                                    type: { type: 'string' },
                                    proposable: { type: 'boolean' },
                                },
                                required: ['activity', 'locationIds'],
                            },
                        },
                    },
                },
                responses: { '200': { description: 'Event created' } },
            },
        },

        // --- ADMIN LOCATIONS ---
        '/api/admin/locations': {
            get: {
                tags: ['Admin Locations'],
                summary: 'Get locations (admin)',
                responses: { '200': { description: 'Success' } },
            },
            post: {
                tags: ['Admin Locations'],
                summary: 'Create location (admin)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    address: { type: 'string' },
                                    link: { type: 'string' },
                                },
                                required: ['name'],
                            },
                        },
                    },
                },
                responses: { '200': { description: 'Location created' } },
            },
        },

        // --- ADMIN USERS ---
        '/api/admin/users': {
            get: {
                tags: ['Admin Users'],
                summary: 'Get users (admin)',
                responses: { '200': { description: 'Success' } },
            },
            post: {
                tags: ['Admin Users'],
                summary: 'Create user (admin)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    email: { type: 'string' },
                                    role: { type: 'string' },
                                },
                                required: ['name', 'email'],
                            },
                        },
                    },
                },
                responses: { '200': { description: 'User created' } },
            },
        },
    },
};
