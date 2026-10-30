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
                  required: ["identifier", "password", "role"],
                  properties: {
                    identifier: {
                      type: "string",
                      example: "patient@example.com",
                      description:
                        "ელ.ფოსტა (ყველა როლი); პაციენტი — პირადი ნომერი; ექიმი — პირადი ნომერი ან ლიცენზიის ნომერი",
                    },
                    password: {
                      type: "string",
                      example: "password123",
                    },
                    role: {
                      type: "string",
                      enum: ["PATIENT", "DOCTOR", "CLINIC_ADMIN"],
                      example: "PATIENT",
                      description:
                        "ავტორიზაციის ფორმის როლი; შესვლა მხოლოდ ამ როლის ანგარიშით არის შესაძლებელი",
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
              description: "ვალიდაციის შეცდომა (მაგ. role აკლია ან არასწორია)",
            },
            401: {
              description:
                "არასწორი ელ.ფოსტა/ID ან პაროლი, ან ანგარიში სხვა როლს ეკუთვნის",
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
          description:
            "თითოეული კლინიკა შეიცავს doctorCount-ს (ექიმების რაოდენობა). ექიმები გრაფიკის გარეშეც ითვლება; ექიმების გარეშე კლინიკას doctorCount: 0 აქვს.",
          responses: {
            200: {
              description: "კლინიკების სია წარმატებით წამოიღო",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string", example: "c1" },
                            name: { type: "string", example: "City Clinic" },
                            address: { type: "string", example: "12 Main St" },
                            doctorCount: { type: "integer", example: 9 },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/clinics/{clinicId}/specialties": {
        get: {
          summary: "კლინიკის სპეციალობების სია ექიმების რაოდენობით",
          description:
            "აბრუნებს კლინიკის სპეციალობებს (primarySpecialty) და თითოეულში ექიმების რაოდენობას, ანბანის მიხედვით. მხოლოდ ის სპეციალობები, სადაც მინიმუმ ერთი ექიმია. ექიმების გარეშე კლინიკა აბრუნებს data: []. ექიმების სიისთვის გამოიყენეთ GET /api/doctors?clinicId=&specialty=&search=.",
          tags: ["Clinics"],
          parameters: [
            {
              name: "clinicId",
              in: "path",
              required: true,
              description: "კლინიკის ID (იგივე, რაც GET /api/clinics-იდან)",
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "სპეციალობების სია წარმატებით წამოიღო",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            specialty: {
                              type: "string",
                              example: "Cardiology",
                            },
                            doctorCount: { type: "integer", example: 4 },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: "კლინიკა ვერ მოიძებნა (success: false, message)",
            },
            500: { description: "სერვერის შიდა შეცდომა" },
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
          description:
            "თავისუფალი დროის სლოტების ნახვა ხელმისაწვდომია პაციენტებისა და ავტორიზებული კლინიკის ადმინისტრატორებისთვის (CLINIC_ADMIN).",
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
      "/api/appointments/{id}/status": {
        patch: {
          summary: "ვიზიტის დასრულება ან გამოუცხადებლად მონიშვნა (ექიმი)",
          description:
            "ექიმი ასრულებს დაგეგმილ ვიზიტს (COMPLETED) ან მონიშნავს მას, როგორც გამოუცხადებელს (NO_SHOW). NO_SHOW შესაძლებელია მხოლოდ ვიზიტის დაწყების დროის შემდეგ და დიაგნოზს არ იღებს.",
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
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: {
                      type: "string",
                      enum: ["COMPLETED", "NO_SHOW"],
                    },
                    notes: {
                      type: "string",
                      description: "ვიზიტის შენიშვნები (არასავალდებულო)",
                    },
                    diagnosis: {
                      type: "string",
                      description:
                        "დიაგნოზი (არასავალდებულო, მხოლოდ COMPLETED-ისთვის)",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description:
                "ვიზიტი დასრულდა ან მოინიშნა გამოუცხადებლად",
            },
            400: {
              description: "არასწორი ID, სტატუსი, შენიშვნები ან დიაგნოზი",
            },
            401: {
              description: "მომხმარებელი არაავტორიზებულია",
            },
            403: {
              description: "მხოლოდ ექიმს შეუძლია ვიზიტის განახლება",
            },
            404: {
              description: "ვიზიტი ვერ მოიძებნა",
            },
            409: {
              description:
                "ვიზიტი არ არის დაგეგმილი, ან NO_SHOW მოთხოვნილია დაწყების დრომდე",
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

      "/api/clinic/doctors": {
        get: {
          summary: "კლინიკის ექიმების სია",
          tags: ["Clinic Dashboard"],
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: "ექიმების სია წარმატებით დაბრუნდა",
            },
            401: { description: "არაავტორიზებული" },
            403: { description: "წვდომა აკრძალულია" },
            404: { description: "კლინიკა ვერ მოიძებნა" },
            500: { description: "სერვერის შიდა შეცდომა" },
          },
        },
      },

      "/api/clinic/doctors/{id}/schedule": {
        put: {
          summary: "კლინიკის ექიმის სამუშაო გრაფიკის განახლება",
          tags: ["Clinic Dashboard"],
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ექიმის უნიკალური ID",
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "workingDays",
                    "startTime",
                    "endTime",
                    "slotMinutes",
                  ],
                  properties: {
                    workingDays: {
                      type: "array",
                      items: {
                        type: "integer",
                        minimum: 1,
                        maximum: 7,
                      },
                      example: [1, 2, 3, 4, 5],
                      description: "სამუშაო დღეები, 1-დან 7-მდე",
                    },
                    startTime: {
                      type: "string",
                      example: "09:00",
                    },
                    endTime: {
                      type: "string",
                      example: "17:00",
                    },
                    slotMinutes: {
                      type: "integer",
                      example: 30,
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "სამუშაო გრაფიკი განახლდა" },
            400: { description: "გრაფიკის ვალიდაციის შეცდომა" },
            401: { description: "არაავტორიზებული" },
            403: { description: "წვდომა აკრძალულია" },
            404: { description: "კლინიკა ან ექიმი ვერ მოიძებნა" },
            500: { description: "სერვერის შიდა შეცდომა" },
          },
        },
      },

      "/api/clinic/appointments": {
        get: {
          summary: "კლინიკის ვიზიტების სია ფილტრებით",
          tags: ["Clinic Dashboard"],
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "from",
              in: "query",
              required: false,
              description: "პერიოდის დასაწყისი",
              schema: { type: "string", format: "date-time" },
            },
            {
              name: "to",
              in: "query",
              required: false,
              description: "პერიოდის დასასრული",
              schema: { type: "string", format: "date-time" },
            },
            {
              name: "doctorId",
              in: "query",
              required: false,
              description: "ექიმის ID-ით ფილტრაცია",
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: { description: "ვიზიტების სია წარმატებით დაბრუნდა" },
            400: { description: "ფილტრის მონაცემები არასწორია" },
            401: { description: "არაავტორიზებული" },
            403: { description: "წვდომა აკრძალულია" },
            404: { description: "კლინიკა ან ექიმი ვერ მოიძებნა" },
            500: { description: "სერვერის შიდა შეცდომა" },
          },
        },
      },

      "/api/clinic/appointments/{id}/reschedule": {
        patch: {
          summary: "კლინიკის ვიზიტის სხვა დროზე გადატანა",
          tags: ["Clinic Dashboard"],
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ვიზიტის უნიკალური ID",
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["startAt"],
                  properties: {
                    startAt: {
                      type: "string",
                      format: "date-time",
                      example: "2026-10-26T10:00:00+04:00",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "ვიზიტის დრო წარმატებით შეიცვალა" },
            400: { description: "თარიღი ან დრო არასწორია" },
            401: { description: "არაავტორიზებული" },
            403: { description: "წვდომა აკრძალულია" },
            404: { description: "ვიზიტი ვერ მოიძებნა" },
            409: { description: "არჩეული დრო დაკავებულია" },
            500: { description: "სერვერის შიდა შეცდომა" },
          },
        },
      },

      "/api/clinic/appointments/{id}/cancel": {
        patch: {
          summary: "კლინიკის ვიზიტის გაუქმება",
          tags: ["Clinic Dashboard"],
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ვიზიტის უნიკალური ID",
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["reason"],
                  properties: {
                    reason: {
                      type: "string",
                      maxLength: 200,
                      example: "ექიმი მიუწვდომელია",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "ვიზიტი წარმატებით გაუქმდა" },
            400: { description: "გაუქმების მიზეზი არასწორია" },
            401: { description: "არაავტორიზებული" },
            403: { description: "წვდომა აკრძალულია" },
            404: { description: "ვიზიტი ვერ მოიძებნა" },
            409: { description: "ვიზიტის გაუქმება შეუძლებელია" },
            500: { description: "სერვერის შიდა შეცდომა" },
          },
        },
      },

      "/api/clinic/stats": {
        get: {
          summary: "კლინიკის სტატისტიკა არჩეული პერიოდის მიხედვით",
          tags: ["Clinic Dashboard"],
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "from",
              in: "query",
              required: true,
              description: "პერიოდის დასაწყისი, ჩათვლით",
              schema: {
                type: "string",
                format: "date-time",
              },
              example: "2026-09-18T20:00:00.000Z",
            },
            {
              name: "to",
              in: "query",
              required: true,
              description: "პერიოდის დასასრული, ჩაუთვლელად",
              schema: {
                type: "string",
                format: "date-time",
              },
              example: "2026-10-18T20:00:00.000Z",
            },
          ],
          responses: {
            200: {
              description: "კლინიკის სტატისტიკა წარმატებით დაბრუნდა",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: {
                        type: "boolean",
                        example: true,
                      },
                      data: {
                        type: "object",
                        properties: {
                          total: { type: "integer", example: 412 },
                          completed: { type: "integer", example: 298 },
                          upcoming: { type: "integer", example: 41 },
                          cancelled: { type: "integer", example: 37 },
                          rescheduled: { type: "integer", example: 19 },
                          cancellationRate: {
                            type: "number",
                            example: 0.0898,
                          },
                          utilisation: {
                            type: "number",
                            example: 0.4721,
                          },
                          workload: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                doctor: {
                                  type: "object",
                                  description:
                                    "ექიმის მონაცემები GET /api/clinic/doctors endpoint-ის ფორმატით",
                                },
                                booked: { type: "integer", example: 96 },
                                completed: { type: "integer", example: 81 },
                                cancelled: { type: "integer", example: 9 },
                                capacity: { type: "integer", example: 352 },
                                utilisation: {
                                  type: "number",
                                  example: 0.2727,
                                },
                              },
                            },
                          },
                          doctorsCount: { type: "integer", example: 12 },
                          appointmentsCount: { type: "integer", example: 412 },
                          appointmentsByStatus: {
                            type: "object",
                            properties: {
                              pending: { type: "integer", example: 36 },
                              scheduled: { type: "integer", example: 41 },
                              completed: { type: "integer", example: 298 },
                              cancelled: { type: "integer", example: 37 },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description:
                "თარიღები აკლია ან არასწორია, from >= to, ან პერიოდი 366 დღეზე მეტია",
            },
            401: { description: "არაავტორიზებული" },
            403: { description: "წვდომა აკრძალულია" },
            404: { description: "კლინიკა ვერ მოიძებნა" },
            500: { description: "სერვერის შიდა შეცდომა" },
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
