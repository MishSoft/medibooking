import swaggerJsdoc from "swagger-jsdoc";
import { Express } from "express";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MediBooking API Documentation",
      version: "1.0.0",
      description:
        "ბექენდის არქიტექტურა აწყობილია Express.js, TypeScript, Prisma და Zod-ით.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    paths: {
      "/api/auth/login": {
        post: {
          summary: "მომხმარებლის ავტორიზაცია",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["identifier", "password"],
                  properties: {
                    identifier: {
                      type: "string",
                      example: "patient@example.com",
                      description: "ელ.ფოსტა ან ექიმის ლიცენზიის ნომერი",
                    },
                    password: {
                      type: "string",
                      example: "password123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "წარმატებული ავტორიზაცია (აბრუნებს token-ს)",
            },
            400: {
              description: "არასწორი მონაცემები",
            },
          },
        },
      },
      "/api/auth/register/patient": {
        post: {
          summary: "პაციენტის რეგისტრაცია",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "email",
                    "password",
                    "firstName",
                    "lastName",
                    "personalId",
                  ],
                  properties: {
                    email: { type: "string", example: "patient@example.com" },
                    password: { type: "string", example: "password123" },
                    firstName: { type: "string", example: "გიორგი" },
                    lastName: { type: "string", example: "გიორგაძე" },
                    phone: { type: "string", example: "599123456" },
                    personalId: { type: "string", example: "01001011111" },
                    address: { type: "string", example: "ჭავჭავაძის 12" },
                    city: { type: "string", example: "თბილისი" },
                    gender: { type: "string", example: "MALE" },
                    birthDate: { type: "string", example: "1995-05-15" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "პაციენტი წარმატებით დარეგისტრირდა" },
            400: { description: "ცდომილება ვალიდაციაში" },
          },
        },
      },
      "/api/auth/register/clinic": {
        post: {
          summary: "კლინიკის ადმინისტრატორის რეგისტრაცია",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "email",
                    "password",
                    "name",
                    "taxId",
                    "address",
                    "city",
                  ],
                  properties: {
                    email: { type: "string", example: "clinic@example.com" },
                    password: { type: "string", example: "password123" },
                    firstName: { type: "string", example: "დავით" },
                    lastName: { type: "string", example: "მაისურაძე" },
                    name: { type: "string", example: "მედიქალ ცენტრი" },
                    legalName: {
                      type: "string",
                      example: "შპს მედიქალ ცენტრი",
                    },
                    taxId: { type: "string", example: "204123456" },
                    address: { type: "string", example: "ვაჟა-ფშაველას 25" },
                    city: { type: "string", example: "თბილისი" },
                    postalCode: { type: "string", example: "0179" },
                    receptionPhone: { type: "string", example: "0322112233" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "კლინიკა წარმატებით დარეგისტრირდა" },
          },
        },
      },
      "/api/auth/logout": {
        post: {
          summary: "მომხმარებლის სისტემიდან გამოსვლა",
          tags: ["Auth"],
          security: [
            {
              BearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "წარმატებით გამოვიდა სისტემიდან",
            },
            401: {
              description: "არაავტორიზებული (ტოკენი აკლია ან ვადა გაუვიდა)",
            },
          },
        },
      },
      "/api/appointments": {
        post: {
          summary: "ვიზიტის დაჯავშნა (პაციენტი)",
          tags: ["Appointments"],
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["doctorId", "startsAt"],
                  properties: {
                    doctorId: {
                      type: "string",
                      format: "uuid",
                      example: "clw12345-..."
                    },
                    startsAt: {
                      type: "string",
                      format: "date-time",
                      example: "2026-10-25T10:00:00Z"
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "ვიზიტი წარმატებით დაჯავშნა" },
            400: { description: "ვალიდაციის შეცდომა ან დრო დაკავებულია" },
            401: { description: "არაავტორიზებული" },
          },
        },
      },
      "/api/patient/appointments": {
        get: {
          summary: "პაციენტის ვიზიტების ისტორია",
          tags: ["Patient Dashboard"],
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: "ვიზიტების სია წარმატებით წამოიღო" },
            401: { description: "არაავტორიზებული" },
          },
        },
      },
      "/api/patient/prescriptions": {
        get: {
          summary: "პაციენტის რეცეპტების სია",
          tags: ["Patient Dashboard"],
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: "რეცეპტების სია წარმატებით წამოიღო" },
            401: { description: "არაავტორიზებული" },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📄 Swagger docs available at http://localhost:5000/api-docs");
};
