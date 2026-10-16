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
                  required: ["doctorId", "startAt"],
                  properties: {
                    doctorId: {
                      type: "string",
                      format: "uuid",
                      example: "clw12345-...",
                    },
                    startAt: {
                      type: "string",
                      format: "date-time",
                      example: "2026-10-25T10:00:00Z",
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
      "/api/clinics": {
        get: {
          summary: "კლინიკების სიის წამოღება",
          tags: ["Clinics"],
          responses: {
            200: { description: "კლინიკების სია წარმატებით წამოიღო" },
          },
        },
      },
      "/api/doctors": {
        get: {
          summary:
            "ექიმების სიის წამოღება ფილტრებით (search, specialty, clinicId)",
          tags: ["Doctors"],
          parameters: [
            {
              name: "search",
              in: "query",
              required: false,
              schema: { type: "string" },
              description: "ძებნა სახელით ან გვარით",
            },
            {
              name: "specialty",
              in: "query",
              required: false,
              schema: { type: "string" },
              description: "სპეციალობით ფილტრაცია",
            },
            {
              name: "clinicId",
              in: "query",
              required: false,
              schema: { type: "string" },
              description: "კლინიკის ID-ით ფილტრაცია",
            },
          ],
          responses: {
            200: { description: "ექიმების სია წარმატებით წამოიღო" },
          },
        },
      },
      "/api/doctors/specialties": {
        get: {
          summary: "ექიმების სპეციალობების სიის წამოღება",
          tags: ["Doctors"],
          responses: {
            200: { description: "სპეციალობების სია წარმატებით წამოიღო" },
          },
        },
      },

      "/api/doctors/{id}/slots": {
        get: {
          summary: "ექიმის თავისუფალი დროის სლოტების წამოღება",
          tags: ["Doctors"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ექიმის უნიკალური ID",
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],
          responses: {
            200: {
              description: "თავისუფალი დროის სლოტები წარმატებით წამოიღო",
            },
            400: {
              description: "ექიმის ID არასწორია",
            },
            404: {
              description: "ექიმი ვერ მოიძებნა",
            },
          },
        },
      },
      "/api/appointments/{id}/cancel": {
        patch: {
          summary: "ვიზიტის გაუქმება",
          tags: ["Appointments"],
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ვიზიტის უნიკალური ID",
              schema: {
                type: "string",
                format: "uuid",
              },
            },
          ],
          responses: {
            200: {
              description: "ვიზიტი წარმატებით გაუქმდა",
            },
            400: {
              description: "არასწორი ID ან ვიზიტის გაუქმება შეუძლებელია",
            },
            401: {
              description: "მომხმარებელი არაავტორიზებულია",
            },
            404: {
              description: "ვიზიტი ვერ მოიძებნა",
            },
          },
        },
      },

      "/api/auth/register/doctor": {
        post: {
          summary: "ექიმის რეგისტრაცია",
          description:
            "ექიმის რეგისტრაცია სისტემაში პირადი მონაცემებით, ლიცენზიის ნომრითა და კლინიკის ID-ით.",
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
                    "phone",
                    "personalId",
                    "licenseNo",
                    "primarySpecialty",
                    "yearsOfPractice",
                    "emergencyPhone",
                    "city",
                    "clinicId",
                  ],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "doctor@example.com",
                    },
                    password: {
                      type: "string",
                      minLength: 6,
                      example: "password123",
                    },
                    firstName: {
                      type: "string",
                      minLength: 2,
                      example: "გიორგი",
                    },
                    lastName: {
                      type: "string",
                      minLength: 2,
                      example: "გიორგაძე",
                    },
                    phone: {
                      type: "string",
                      minLength: 6,
                      example: "599123456",
                    },
                    role: {
                      type: "string",
                      enum: ["DOCTOR"],
                      default: "DOCTOR",
                      example: "DOCTOR",
                    },
                    personalId: {
                      type: "string",
                      minLength: 1,
                      example: "01001011111",
                    },
                    licenseNo: {
                      type: "string",
                      minLength: 1,
                      example: "MED-123456",
                    },
                    primarySpecialty: {
                      type: "string",
                      minLength: 1,
                      example: "კარდიოლოგი",
                    },
                    yearsOfPractice: {
                      type: "number",
                      minimum: 0,
                      example: 8,
                    },
                    emergencyPhone: {
                      type: "string",
                      minLength: 1,
                      example: "599987654",
                    },
                    city: {
                      type: "string",
                      minLength: 1,
                      example: "თბილისი",
                    },
                    clinicId: {
                      type: "string",
                      format: "uuid",
                      example: "550e8400-e29b-41d4-a716-446655440000",
                      description: "არსებული კლინიკის უნიკალური ID",
                    },
                    gender: {
                      type: "string",
                      enum: ["MALE", "FEMALE"],
                      example: "MALE",
                    },
                    birthDate: {
                      type: "string",
                      format: "date",
                      example: "1990-05-15",
                    },
                    bio: {
                      type: "string",
                      example: "8 წლიანი გამოცდილების მქონე კარდიოლოგი.",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "ექიმი წარმატებით დარეგისტრირდა",
            },
            400: {
              description:
                "ვალიდაციის შეცდომა, გამოყენებული ელ.ფოსტა ან ლიცენზიის ნომერი, ან არარსებული კლინიკა",
            },
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
