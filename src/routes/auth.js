const authController = require("../controllers/auth.controller");
const roleController = require("../controllers/role.controller");
const permissionController = require("../controllers/permission.controller");
const User = require("../models/User");

module.exports = async function (fastify) {


  // ------------------ Register User ------------------
  fastify.post("/register", {
    schema: {
      tags: ["Auth"],
      summary: "Register a user with OTP verification",
      body: {
        type: "object",
        required: [
          "first_name",
          "last_name",
          "email",
          "password",
          "mobile_number",
          "otp",
        ],
        properties: {
          first_name: { type: "string" },
          last_name: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
          mobile_number: { type: "string", minLength: 10, maxLength: 15 },
          otp: { type: "string", minLength: 6, maxLength: 6 },
        },
      },
      response: {
        201: {
          description:
            "User registered successfully with verified mobile number",
          type: "object",
          properties: {
            id: { type: "string" },
            first_name: { type: "string" },
            last_name: { type: "string" },
            email: { type: "string" },
            mobile_number: { type: "string" },
            role_id: { type: "string" },
            message: { type: "string" },
          },
        },
        400: {
          description: "Bad request - Invalid OTP or user already exists",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: authController.register,
  });



  // ------------------ Login User ------------------
  fastify.post("/login", {
    schema: {
      tags: ["Auth"],
      summary: "Login a user using email/password or mobile number/otp",
      body: {
        type: "object",
        properties: {
          email_or_mobile_number: { type: "string" },
          password: { type: "string" },
          otp: { type: "string", minLength: 4, maxLength: 8 },
        },
        oneOf: [
          {
            required: ["email_or_mobile_number", "password"],
          },
          {
            required: ["mobile_number", "otp"],
          },
        ],
      },
      response: {
        200: {
          description: "Login successful",
          type: "object",
          properties: {
            token: { type: "string" },
            message: { type: "string" },
            access: {
              type: "object",
              properties: {
                permissions: { type: "array", items: { type: "string" } },
                role: { type: "string" },
              },
            },
          },
        },
        400: {
          description: "Bad request",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
        401: {
          description: "Unauthorized",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: authController.login,
  });

    // ------------------ Send OTP ------------------
  fastify.post("/send-otp", {
    schema: {
      tags: ["Auth"],
      summary: "Send OTP to mobile number for registration",
      body: {
        type: "object",
        required: ["mobile_number"],
        properties: {
          mobile_number: {
            type: "string",
            minLength: 10,
            maxLength: 15,
            pattern: "^[0-9]+$",
          },
        },
      },
      response: {
        200: {
          description: "OTP sent successfully",
          type: "object",
          properties: {
            message: { type: "string" },
            mobile_number: { type: "string" },
            otp: { type: "string" }, // Only in development
          },
        },
        400: {
          description: "Bad request",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: authController.sendOtp,
  });

  // ------------------ Check Existing Email ------------------
  fastify.post("/check-email", {
    schema: {
      tags: ["Auth"],
      summary: "Check if email is already registered",
      body: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email" },
        },
      },
      response: {
        200: {
          description: "Email availability status",
          type: "object",
          properties: {
            is_registered: { type: "boolean" },
          },
        },
        400: {
          description: "Bad request",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: async (req, reply) => {
      const { email } = req.body;
      const user = await User.findOne({ email });
      reply.send({ is_registered: !!user });
    },
  });

  // ------------------ Check Existing Mobile Number ------------------
  fastify.post("/check-mobile", {
    schema: {
      tags: ["Auth"],
      summary: "Check if mobile number is already registered",
      body: {
        type: "object",
        required: ["mobile_number"],
        properties: {
          mobile_number: { type: "string", minLength: 10, maxLength: 15 },
        },
      },
      response: {
        200: {
          description: "Mobile number availability status",
          type: "object",
          properties: {
            is_registered: { type: "boolean" },
          },
        },
        400: {
          description: "Bad request",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: async (req, reply) => {
      const { mobile_number } = req.body;
      const user = await User.findOne({ mobile_number });
      reply.send({ is_registered: !!user });
    },

  });

  // ------------------ Get All Users ------------------

  fastify.get("/users", {
    schema: {
      tags: ["User"],
      summary: "Get all registered users",
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              first_name: { type: "string" },
              last_name: { type: "string" },
              email: { type: "string" },
              mobile_number: { type: "string" },
              role_id: { type: "string" },
              is_email_verified: { type: "boolean" },
              is_mobile_number_verified: { type: "boolean" },
              is_account_approved: { type: "boolean" },
              status: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
          },
        },
      },
    },
    handler: authController.getAllUsers,
  });

  // ------------------ Get Single User Post Method ------------------
  fastify.post("/user", {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ["User"],
      summary: "Get a single user by ID",
      body: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            _id: { type: "string" },
            first_name: { type: "string" },
            last_name: { type: "string" },
            email: { type: "string" },
            mobile_number: { type: "string" },
            role_id: { type: "string" },
            is_email_verified: { type: "boolean" },
            is_mobile_number_verified: { type: "boolean" },
            is_account_approved: { type: "boolean" },
            status: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
        },
        404: {
          description: "User not found",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: authController.getSingleUser,
  });


  // ------------------ Get All Admins ------------------

  fastify.get("/admin-list", {
    schema: {
      tags: ["User"],
      summary: "Get all registered admins",
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },
              first_name: { type: "string" },
              last_name: { type: "string" },
              email: { type: "string" },
              mobile_number: { type: "string" },
              role_id: { type: "string" },
              is_email_verified: { type: "boolean" },
              is_mobile_number_verified: { type: "boolean" },
              is_account_approved: { type: "boolean" },
              status: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
          },
        },
      },
    },
    handler: authController.getAllAdmins,
  });

    // ------------------ Verify OTP ------------------
  fastify.post("/verify-otp", {
    schema: {
      tags: ["Auth"],
      summary: "Verify user OTP and complete registration",
      body: {
        type: "object",
        required: ["mobile_number", "otp"],
        properties: {
          mobile_number: { type: "string", minLength: 10, maxLength: 20 },
          otp: { type: "string", minLength: 4, maxLength: 6 },
        },
      },
    },
    handler: authController.verifyOtp,
  });

  // ------------------ Logut User -------------------
  fastify.post("/logout", {
    schema: {
      tags: ["Auth"],
      summary: "Logout the user and expire the token",
      body: {
        type: "object",
        required: ["token"],
        properties: {
          token: { type: "string" },
        },
      },
      response: {
        200: {
          description: "Logout successful",
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    handler: authController.logout,
  });

  // ------------------ Forgot Password ------------------
  fastify.post("/forgot-password", {
    schema: {
      tags: ["Auth"],
      summary: "Forgot password via email or phone",
      body: {
        type: "object",
        required: [
          "email_or_mobile_number",
          "otp",
          "password",
          "confirm_password",
        ],
        properties: {
          email_or_mobile_number: { type: "string" },
          otp: { type: "string" },
          password: { type: "string", minLength: 6 },
          confirm_password: { type: "string", minLength: 6 },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        400: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
        404: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        500: {
          type: "object",
          properties: {
            message: { type: "string" },
            error: { type: "string" },
          },
        },
      },
    },
    handler: authController.forgotPassword,
  });

  // ------------------ Update Profile ---------------
  fastify.patch("/update-profile", {
    preHandler: [fastify.authenticate], // Assuming auth is required
    schema: {
      tags: ["Auth"],
      summary: "Update user profile (name/email only)",
      body: {
        type: "object",
        required: ["first_name", "last_name", "email"],
        properties: {
          first_name: { type: "string" },
          last_name: { type: "string" },
          email: { type: "string", format: "email" },
        },
      },
      response: {
        200: {
          description: "Profile updated successfully",
          type: "object",
          properties: {
            id: { type: "string" },
            first_name: { type: "string" },
            last_name: { type: "string" },
            email: { type: "string" },
          },
        },
      },
    },
    handler: authController.updateProfile,
  });

  // ------------------ Update Password --------------
  fastify.patch("/update-password", {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ["Auth"],
      summary: "Update user password (requires old password)",
      body: {
        type: "object",
        required: ["old_password", "new_password"],
        properties: {
          old_password: { type: "string", minLength: 6 },
          new_password: { type: "string", minLength: 6 },
        },
      },
      response: {
        200: {
          description: "Password updated successfully",
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    handler: authController.updatePassword,
  });

  // ----------------- User Delete -------------------
  fastify.delete("/delete-account/:id", {
    preHandler: [fastify.authenticate],
    schema: {
      tags: ["Auth"],
      summary: "Delete current user account",
      response: {
        200: {
          description: "User account deleted successfully",
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    handler: authController.userDelete,
  });

  // ------------------ Create Role ------------------
  fastify.post("/roles", {
    schema: {
      tags: ["Role"],
      summary: "Create a role",
      body: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
        },
      },
      response: {
        201: {
          description: "Role created",
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
          },
        },
      },
    },
    handler: roleController.createRole,
  });

  // ------------------ Delete Role ------------------
  fastify.delete("/roles/:id", {
    schema: {
      tags: ["Role"],
      summary: "Delete a role",
      params: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string" },
        },
      },
      response: {
        200: {
          description: "Role deleted",
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    handler: roleController.deleteRole,
  });

  // ------------------ Get All Roles ------------------
  fastify.get("/roles", {
    schema: {
      tags: ["Role"],
      summary: "Get all roles",
      response: {
        200: {
          description: "List of roles",
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
            },
          },
        },
      },
    },
    handler: roleController.getAllRoles,
  });

  // ------------------ Update Role ------------------
  fastify.put("/roles/:id", {
    schema: {
      tags: ["Role"],
      summary: "Update a role",
      params: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string" },
        },
      },
      body: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
        },
      },
      response: {
        200: {
          description: "Role updated",
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
          },
        },
      },
    },
    handler: roleController.updateRole,
  });

  // ------------------ Get Single Role --------------------
  fastify.get("/roles/:id", {
    schema: {
      tags: ["Role"],
      summary: "Get a single role by ID",
      params: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string" },
        },
      },
      response: {
        200: {
          description: "Role found",
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
          },
        },
        404: {
          description: "Role not found",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: roleController.getRoleById,
  });

  fastify.post("/permissions", {
    schema: {
      tags: ["Permission"],
      summary: "Create a permission",
      body: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
        },
      },
      response: {
        201: {
          description: "Permission created",
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
          },
        },
      },
    },
    handler: permissionController.createPermission,
  });

  fastify.get("/permissions", {
    schema: {
      tags: ["Permission"],
      summary: "Get all permissions",
      response: {
        200: {
          description: "List of permissions",
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
            },
          },
        },
      },
    },
    handler: permissionController.getAllPermissions,
  });

  fastify.get("/permissions/:id", {
    schema: {
      tags: ["Permission"],
      summary: "Get a single permission by ID",
      params: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string" },
        },
      },
      response: {
        200: {
          description: "Permission found",
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
          },
        },
        404: {
          description: "Permission not found",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: permissionController.getPermissionById,
  });

  fastify.put("/permissions/:id", {
    schema: {
      tags: ["Permission"],
      summary: "Update a permission",
      params: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string" },
        },
      },
      body: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
        },
      },
      response: {
        200: {
          description: "Permission updated",
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
          },
        },
      },
    },
    handler: permissionController.updatePermission,
  });

  fastify.delete("/permissions/:id", {
    schema: {
      tags: ["Permission"],
      summary: "Delete a permission",
      params: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string" },
        },
      },
      response: {
        200: {
          description: "Permission deleted",
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        404: {
          description: "Permission not found",
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: permissionController.deletePermission,
  });

  fastify.put("/role-permissions", {
    schema: {
      tags: ["RolePermission"],
      summary: "Update permissions assigned to a role (overwrite)",
      body: {
        type: "object",
        required: ["role_id", "permission_ids"],
        properties: {
          role_id: { type: "string" },
          permission_ids: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
          },
        },
      },
      response: {
        200: {
          description: "Permissions updated for role",
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    handler: roleController.assignPermissions, // Overwrites permission list
  });

  fastify.post("/role-permissions/add", {
    schema: {
      tags: ["RolePermission"],
      summary: "Add permissions to an existing role",
      body: {
        type: "object",
        required: ["role_id", "permission_ids"],
        properties: {
          role_id: { type: "string" },
          permission_ids: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
          },
        },
      },
      response: {
        200: {
          description: "Permissions added to role",
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    handler: roleController.addPermissionsToRole,
  });

  fastify.post("/role-permissions/remove", {
    schema: {
      tags: ["RolePermission"],
      summary: "Remove permissions from a role",
      body: {
        type: "object",
        required: ["role_id", "permission_ids"],
        properties: {
          role_id: { type: "string" },
          permission_ids: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
          },
        },
      },
      response: {
        200: {
          description: "Permissions removed from role",
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    handler: roleController.removePermissionsFromRole,
  });

  fastify.get("/auth/health", async (req, reply) => {
    return { status: "ok", service: "auth-service" };
  });
};
