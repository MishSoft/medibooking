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
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📄 Swagger docs available at http://localhost:5000/api-docs");
};
