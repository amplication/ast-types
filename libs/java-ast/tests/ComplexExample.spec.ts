import {
  Access,
  Annotation,
  Class,
  ClassReference,
  CodeBlock,
  Enum,
  Field,
  Method,
  Parameter,
  Type,
  Writer,
} from "../src/index";

describe("Complex Example", () => {
  it("should generate a complex Spring Boot controller", async () => {
    // Function to generate a Spring Boot REST controller
    async function generateUserController() {
      // Create the main controller class
      const userController = new Class({
        name: "UserController",
        packageName: "com.example.controller",
        access: Access.Public,
        annotations: [
          new Annotation({
            reference: new ClassReference({
              name: "RestController",
              packageName: "org.springframework.web.bind.annotation",
            }),
          }),
          new Annotation({
            reference: new ClassReference({
              name: "RequestMapping",
              packageName: "org.springframework.web.bind.annotation",
            }),
            namedArguments: new Map([["value", '"/api/users"']]),
          }),
          new Annotation({
            reference: new ClassReference({
              name: "Slf4j",
              packageName: "lombok.extern.slf4j",
            }),
          }),
        ],
        javadoc:
          "Controller for managing User entities.\nProvides CRUD operations for users.",
      });

      // Add service field with dependency injection
      userController.addField(
        new Field({
          name: "userService",
          type: Type.reference({
            name: "UserService",
            packageName: "com.example.service",
          }),
          access: Access.Private,
          final_: true,
          annotations: [
            new Annotation({
              reference: new ClassReference({
                name: "Autowired",
                packageName: "org.springframework.beans.factory",
              }),
            }),
          ],
        }),
      );

      // Add constructor with dependency injection
      userController.addConstructor({
        access: Access.Public,
        parameters: [
          new Parameter({
            name: "userService",
            type: Type.reference({
              name: "UserService",
              packageName: "com.example.service",
            }),
          }),
        ],
        body: new CodeBlock({
          code: 'this.userService = userService;\nlog.info("UserController initialized");',
        }),
      });

      // Create a nested Role enum
      const roleEnum = new Enum({
        name: "Role",
        packageName: "com.example.controller",
        access: Access.Public,
        isNestedEnum: true,
        constantsWithStringValues: [
          { name: "ADMIN", value: "Administrator" },
          { name: "USER", value: "Standard User" },
          { name: "GUEST", value: "Guest User" },
        ],
        javadoc: "User roles in the system.",
      });

      // Add the nested enum to the controller
      userController.addNestedEnum(roleEnum);

      // Add a GET method to fetch all users
      userController.addMethod(
        new Method({
          name: "getAllUsers",
          access: Access.Public,
          returnType: Type.reference({
            name: "ResponseEntity",
            packageName: "org.springframework.http",
            genericArgs: [
              Type.reference({
                name: "List",
                packageName: "java.util",
                genericArgs: [
                  Type.reference({
                    name: "UserDTO",
                    packageName: "com.example.dto",
                  }),
                ],
              }),
            ],
          }),
          annotations: [
            new Annotation({
              reference: new ClassReference({
                name: "GetMapping",
                packageName: "org.springframework.web.bind.annotation",
              }),
            }),
            new Annotation({
              reference: new ClassReference({
                name: "Operation",
                packageName: "io.swagger.v3.oas.annotations",
              }),
              namedArguments: new Map([
                ["summary", '"Get all users"'],
                ["description", '"Returns a list of all users in the system"'],
              ]),
            }),
          ],
          javadoc:
            "Retrieves all users from the system.\n@return List of all users",
        }).setBody(
          new CodeBlock({
            code: `try {
    log.info("Fetching all users");
    List<UserDTO> users = userService.findAll();
    return ResponseEntity.ok(users);
} catch (Exception e) {
    log.error("Error fetching all users", e);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
}`,
            references: [
              new ClassReference({
                name: "HttpStatus",
                packageName: "org.springframework.http",
              }),
              new ClassReference({ name: "List", packageName: "java.util" }),
              new ClassReference({
                name: "UserDTO",
                packageName: "com.example.dto",
              }),
            ],
          }),
        ),
      );

      // Add a GET method to fetch a single user
      userController.addMethod(
        new Method({
          name: "getUserById",
          access: Access.Public,
          parameters: [
            new Parameter({
              name: "id",
              type: Type.long(),
              annotations: [
                new Annotation({
                  reference: new ClassReference({
                    name: "PathVariable",
                    packageName: "org.springframework.web.bind.annotation",
                  }),
                }),
              ],
            }),
          ],
          returnType: Type.reference({
            name: "ResponseEntity",
            packageName: "org.springframework.http",
            genericArgs: [
              Type.reference({
                name: "UserDTO",
                packageName: "com.example.dto",
              }),
            ],
          }),
          annotations: [
            new Annotation({
              reference: new ClassReference({
                name: "GetMapping",
                packageName: "org.springframework.web.bind.annotation",
              }),
              namedArguments: new Map([["value", '"/{id}"']]),
            }),
          ],
          javadoc:
            "Retrieves a specific user by ID.\n@param id The user ID\n@return The user if found",
        }).setBody(
          new CodeBlock({
            code: `try {
    log.info("Fetching user with id: {}", id);
    return userService.findById(id)
        .map(user -> ResponseEntity.ok(user))
        .orElseGet(() -> {
            log.warn("User with id {} not found", id);
            return ResponseEntity.notFound().build();
        });
} catch (Exception e) {
    log.error("Error fetching user with id: " + id, e);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
}`,
            references: [
              new ClassReference({
                name: "HttpStatus",
                packageName: "org.springframework.http",
              }),
              new ClassReference({
                name: "UserDTO",
                packageName: "com.example.dto",
              }),
            ],
          }),
        ),
      );

      // Add a POST method to create a user
      userController.addMethod(
        new Method({
          name: "createUser",
          access: Access.Public,
          parameters: [
            new Parameter({
              name: "userDTO",
              type: Type.reference({
                name: "UserDTO",
                packageName: "com.example.dto",
              }),
              annotations: [
                new Annotation({
                  reference: new ClassReference({
                    name: "RequestBody",
                    packageName: "org.springframework.web.bind.annotation",
                  }),
                }),
                new Annotation({
                  reference: new ClassReference({
                    name: "Valid",
                    packageName: "javax.validation",
                  }),
                }),
              ],
            }),
          ],
          returnType: Type.reference({
            name: "ResponseEntity",
            packageName: "org.springframework.http",
            genericArgs: [
              Type.reference({
                name: "UserDTO",
                packageName: "com.example.dto",
              }),
            ],
          }),
          annotations: [
            new Annotation({
              reference: new ClassReference({
                name: "PostMapping",
                packageName: "org.springframework.web.bind.annotation",
              }),
            }),
          ],
          javadoc:
            "Creates a new user.\n@param userDTO The user information\n@return The created user",
        }).setBody(
          new CodeBlock({
            code: `try {
    log.info("Creating new user: {}", userDTO.getUsername());
    UserDTO createdUser = userService.create(userDTO);
    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{id}")
        .buildAndExpand(createdUser.getId())
        .toUri();
    return ResponseEntity.created(location).body(createdUser);
} catch (DuplicateResourceException e) {
    log.warn("Duplicate user attempted: {}", userDTO.getUsername());
    return ResponseEntity.status(HttpStatus.CONFLICT).build();
} catch (Exception e) {
    log.error("Error creating user", e);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
}`,
            references: [
              new ClassReference({
                name: "HttpStatus",
                packageName: "org.springframework.http",
              }),
              new ClassReference({ name: "URI", packageName: "java.net" }),
              new ClassReference({
                name: "ServletUriComponentsBuilder",
                packageName: "org.springframework.web.servlet.support",
              }),
              new ClassReference({
                name: "DuplicateResourceException",
                packageName: "com.example.exception",
              }),
              new ClassReference({
                name: "UserDTO",
                packageName: "com.example.dto",
              }),
            ],
          }),
        ),
      );

      // Add exception handler
      userController.addMethod(
        new Method({
          name: "handleValidationExceptions",
          access: Access.Public,
          parameters: [
            new Parameter({
              name: "ex",
              type: Type.reference({
                name: "MethodArgumentNotValidException",
                packageName:
                  "org.springframework.web.bind.MethodArgumentNotValidException",
              }),
            }),
          ],
          returnType: Type.reference({
            name: "Map",
            packageName: "java.util",
            genericArgs: [Type.string(), Type.string()],
          }),
          annotations: [
            new Annotation({
              reference: new ClassReference({
                name: "ResponseStatus",
                packageName: "org.springframework.web.bind.annotation",
              }),
              namedArguments: new Map([["value", "HttpStatus.BAD_REQUEST"]]),
            }),
            new Annotation({
              reference: new ClassReference({
                name: "ExceptionHandler",
                packageName: "org.springframework.web.bind.annotation",
              }),
              argument: "MethodArgumentNotValidException.class",
            }),
          ],
          javadoc:
            "Handles validation exceptions.\n@param ex The validation exception\n@return Map of field errors",
        }).setBody(
          new CodeBlock({
            code: `Map<String, String> errors = new HashMap<>();
ex.getBindingResult().getFieldErrors().forEach(error -> 
    errors.put(error.getField(), error.getDefaultMessage()));
log.warn("Validation error: {}", errors);
return errors;`,
            references: [
              new ClassReference({ name: "Map", packageName: "java.util" }),
              new ClassReference({ name: "HashMap", packageName: "java.util" }),
            ],
          }),
        ),
      );

      // Generate the Java code
      const writer = new Writer({ packageName: "com.example.controller" });
      userController.write(writer);
      return writer.toString();
    }

    // Generate the code and compare with snapshot
    const javaCode = await generateUserController();
    expect(javaCode).toMatchSnapshot();
  });
});
