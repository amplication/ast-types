import { formatCode } from "./java-formatter";

async function main() {
  // Example Java code with inconsistent formatting
  const unformattedCode = `
  
package com.example.controller;

import com.example.dto.UserDTO;
import com.example.dto.UserDTO;
import com.example.dto.UserDTO;
import com.example.dto.UserDTO;
import com.example.dto.UserDTO;
import com.example.dto.UserDTO;
import com.example.dto.UserDTO;
import com.example.exception.DuplicateResourceException;
import com.example.service.UserService;
import com.example.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import java.lang.String;
import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.List;
import java.util.Map;
import java.util.Map;
import javax.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

/**
 * Controller for managing User entities.
 * Provides CRUD operations for users.
 */
@RestController
@RequestMapping(value = "/api/users")
@Slf4j
public class UserController {
@Autowired
private final UserService userService;

public UserController(UserService userService)     {
this.userService = userService;
log.info("UserController initialized");    }

    /**
     * Retrieves all users from the system.
     * @return List of all users
     */
@GetMapping
@Operation(summary = "Get all users", description = "Returns a list of all users in the system")
public ResponseEntity<List<UserDTO>> getAllUsers()     {
try {
    log.info("Fetching all users");
    List<UserDTO> users = userService.findAll();
    return ResponseEntity.ok(users);
} catch (Exception e) {
    log.error("Error fetching all users", e);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
}    }

    /**
     * Retrieves a specific user by ID.
     * @param id The user ID
     * @return The user if found
     */
@GetMapping(value = "/{id}")
public ResponseEntity<UserDTO> getUserById(@PathVariable long id)     {
try {
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
}    }

    /**
     * Creates a new user.
     * @param userDTO The user information
     * @return The created user
     */
@PostMapping
public ResponseEntity<UserDTO> createUser(@RequestBody @Valid UserDTO userDTO)     {
try {
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
}    }

    /**
     * Handles validation exceptions.
     * @param ex The validation exception
     * @return Map of field errors
     */
@ResponseStatus(value = HttpStatus.BAD_REQUEST)
@ExceptionHandler(MethodArgumentNotValidException.class)
public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex)     {
Map<String, String> errors = new HashMap<>();
ex.getBindingResult().getFieldErrors().forEach(error -> 
    errors.put(error.getField(), error.getDefaultMessage()));
log.warn("Validation error: {}", errors);
return errors;    }

    /**
     * User roles in the system.
     */
public enum Role     {
ADMIN("Administrator")        ,

USER("Standard User")        ,

GUEST("Guest User")        ;

private final String value;

private void Role(String value)         {
this.value = value;        }

public String getValue()         {
return value;        }

    }

}

`;

  try {
    // Format the code
    const formattedCode = await formatCode(unformattedCode);
    console.log("Formatted code:");
    console.log(formattedCode);
  } catch (error) {
    console.error("Error formatting code:", error);
  }
}

// Run the main function
main();
