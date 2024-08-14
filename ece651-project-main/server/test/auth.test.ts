/**
 * @file This file contains unit tests for the authentication endpoints.
 * @module auth.test
 */
import { auth } from "../src/auth";
import { db } from "db/db";
import { describe, beforeEach, afterEach, it, expect } from "bun:test";
import { users, sessions, email_verification, password_reset } from "db/schema";
import { buildJSONRequest, generateTestUser } from "./common.test";
import { eq } from "drizzle-orm";

const userSignupData = {
  firstname: "test",
  lastname: "user",
  password: "testpassword",
  confirmpassword: "testpassword",
  email: "test@example.com",
};

// Chose some authenticated endpoint ("logout") to test the session token verification and CSRF check
describe("Session Token Verification", () => {
  beforeEach(async () => {
    await db.delete(sessions);
    await db.delete(email_verification);
    await db.delete(password_reset);
    await db.delete(users);
  });

  afterEach(async () => {
    await db.delete(sessions);
    await db.delete(email_verification);
    await db.delete(password_reset);
    await db.delete(users);
  });

  it("should return 401 if session token is invalid", async () => {
    const response = await auth.handle(
      buildJSONRequest("/auth/logout", "POST", {}, "auth_session=badtoken"),
    );

    expect(response.status).toBe(401);
  });

  it("should return 401 if session token is missing", async () => {
    const response = await auth.handle(
      buildJSONRequest("/auth/logout", "POST", {}),
    );

    expect(response.status).toBe(401);
  });

  it("should return 401 if token is valid but host and origin do not match", async () => {
    const user = await generateTestUser();

    const sessionId = "1";
    // Create a session for the user
    const session = await db.insert(sessions).values({
      id: sessionId,
      userId: user.id,
      expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
    });

    const response = await auth.handle(
      buildJSONRequest(
        "/auth/logout",
        "POST",
        {},
        `auth_session=${sessionId}`,
        "example1.com",
        "example.com",
      ),
    );

    expect(response.status).toBe(401);
  });
});

describe("Authentication Endpoints", () => {
  beforeEach(async () => {
    await db.delete(sessions);
    await db.delete(email_verification);
    await db.delete(password_reset);
    await db.delete(users);
  });

  afterEach(async () => {
    await db.delete(sessions);
    await db.delete(email_verification);
    await db.delete(password_reset);
    await db.delete(users);
  });

  describe("GET /auth/profile", () => {
    it("should return 401 if user is not logged in", async () => {
      const response = await auth.handle(
        buildJSONRequest("/auth/profile", "GET", {}),
      );

      expect(response.status).toBe(401);
    });

    it("should return the user's profile", async () => {
      const user = await generateTestUser();
      const sessionId = "1";

      // Create a session for the user
      const session = await db.insert(sessions).values({
        id: sessionId,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
      });

      const response = await auth.handle(
        buildJSONRequest(
          "/auth/profile",
          "GET",
          {},
          `auth_session=${sessionId}`,
        ),
      );

      expect(response.status).toBe(200);

      const userProfile = await db.query.users.findFirst({
        where: eq(users.id, user.id),
      });

      expect(await response.json()).toStrictEqual({
        firstname: user.firstname,
        lastname: user.lastname,
        id: userProfile?.id,
        email: user.email,
        verified_email: user.verified_email,
      });
    });
  });

  describe("POST /auth/signup", () => {
    it("should create a new user", async () => {
      const response = await auth.handle(
        buildJSONRequest("/auth/signup", "POST", userSignupData),
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toStrictEqual({
        status: 200,
        message: "Request successful.",
      });
      expect(response.headers.getSetCookie()).toBeDefined();

      const user = await db.query.users.findFirst({
        where: eq(users.email, "test@example.com"),
      });

      expect(user).toBeDefined();
      if (!user) return;

      const verificationCode = await db.query.email_verification.findFirst({
        where: eq(email_verification.user_id, user.id),
      });

      expect(verificationCode).toBeDefined();
      expect(verificationCode?.user_id).toBe(user.id);
      expect(verificationCode?.verification_code).toBeDefined();
      expect(verificationCode?.expires_at).toBeInstanceOf(Date);

      expect(user.firstname).toBe("test");
      expect(user.lastname).toBe("user");
      expect(
        Bun.password.verify("testpassword", user.hashed_password),
      ).toBeDefined();
      expect(user.email).toBe("test@example.com");
      expect(user.verified_email).toBe(false);
    });

    it("should return 400 if user already exists", async () => {
      const user = await generateTestUser();

      const responseUsername = await auth.handle(
        buildJSONRequest("/auth/signup", "POST", userSignupData),
      );

      expect(responseUsername.status).toBe(400);
      expect(await responseUsername.json()).toEqual({
        status: 400,
        message: "User already exists.",
      });
    });
  });

  describe("POST /auth/login", () => {
    it("should log in a user with valid credentials", async () => {
      // Create a user
      const user = await generateTestUser();

      const response = await auth.handle(
        buildJSONRequest("/auth/login", "POST", {
          email: user.email,
          password: user.password,
        }),
      );

      expect(response.status).toBe(200);
      expect(response.headers.getSetCookie()).toBeDefined();
    });

    it("should preemtively return 200 for an already logged in user", async () => {
      const user = await generateTestUser();
      const sessionId = "1";

      // Create a session for the user
      const session = await db.insert(sessions).values({
        id: sessionId,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
      });

      const response = await auth.handle(
        buildJSONRequest(
          "/auth/login",
          "POST",
          {
            email: user.email,
            password: user.password,
          },
          `auth_session=${sessionId}`,
        ),
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toStrictEqual({
        status: 200,
        message: "Already logged in",
      });
      expect(response.headers.getSetCookie()).toBeDefined();
    });

    it("should return 400 for invalid credentials", async () => {
      // Create a user
      const user = await generateTestUser();

      const response = await auth.handle(
        buildJSONRequest("/auth/login", "POST", {
          email: user.email,
          password: "invalidpassword",
        }),
      );

      expect(response.status).toBe(400);
      expect(await response.json()).toStrictEqual({
        status: 400,
        message: "Invalid username or password",
      });
    });
  });

  describe("POST /auth/logout", () => {
    it("should log out a user", async () => {
      // Create a user
      const user = await generateTestUser();
      const sessionId = "1";

      // Create a session for the user
      const session = await db.insert(sessions).values({
        id: sessionId,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
      });

      const response = await auth.handle(
        buildJSONRequest(
          "/auth/logout",
          "POST",
          {},
          `auth_session=${sessionId}`,
        ),
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("Set-Cookie")).toBeDefined();
    });

    it("should return 401 if user is not logged in", async () => {
      const response = await auth.handle(
        buildJSONRequest("/auth/logout", "POST", {}),
      );

      expect(response.status).toBe(401);
    });
  });
  describe("After Signup Workflow", () => {
    // Create a user before each test
    const user = {
      firstname: "test",
      lastname: "user",
      password: "testpassword",
      email: "test@example.com",
      id: "badid",
      verified_email: false,
    };
    const sessionId = "1";

    beforeEach(async () => {
      await auth.handle(
        buildJSONRequest("/auth/signup", "POST", {
          firstname: user.firstname,
          lastname: user.lastname,
          password: user.password,
          confirmpassword: user.password,
          email: user.email,
        }),
      );

      const userDb = await db.query.users.findFirst({
        where: eq(users.email, user.email),
      });
      if (userDb) {
        user.id = userDb.id;
      }

      // Create a session for the user
      await db.insert(sessions).values({
        id: sessionId,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
      });
    });

    describe("POST /auth/verify_email", () => {
      it("should verify the email of a logged in user", async () => {
        // Create a user
        const sessionId = "1";

        const verificationCode = await db.query.email_verification.findFirst({
          where: eq(email_verification.user_id, user.id),
        });

        expect(verificationCode).toBeDefined();

        const response = await auth.handle(
          buildJSONRequest(
            "/auth/verify_email",
            "POST",
            { code: verificationCode?.verification_code },
            `auth_session=${sessionId}`,
          ),
        );

        expect(response.status).toBe(200);
        expect(response.headers.get("Set-Cookie")).toBeDefined();

        // Check if the user's email is verified
        const updatedUser = await db.query.users.findFirst({
          where: eq(users.id, user.id),
        });

        expect(updatedUser?.verified_email).toBe(true);
      });

      it("should return 401 if user is not logged in", async () => {
        const response = await auth.handle(
          buildJSONRequest("/auth/verify_email", "POST", { code: "badcode" }),
        );

        expect(response.status).toBe(401);
      });

      it("should return 400 for expired verification codes", async () => {
        // Create a user
        const sessionId = "1";

        const verificationCode = await db.query.email_verification.findFirst({
          where: eq(email_verification.user_id, user.id),
        });

        expect(verificationCode).toBeDefined();
        if (!verificationCode) return;

        // Set verification code to have expired already
        await db
          .update(email_verification)
          .set({
            expires_at: new Date(Date.now() - 3600000),
          })
          .where(eq(email_verification.id, verificationCode.id));

        const response = await auth.handle(
          buildJSONRequest(
            "/auth/verify_email",
            "POST",
            { code: verificationCode?.verification_code },
            `auth_session=${sessionId}`,
          ),
        );

        expect(response.status).toBe(400);
        expect(await response.text()).toBe(
          "Invalid verification code provided",
        );
      });

      it("should return 400 for invalid verification code", async () => {
        const verificationCode = await db.query.email_verification.findFirst({
          where: eq(email_verification.user_id, user.id),
        });

        expect(verificationCode).toBeDefined();

        const response = await auth.handle(
          buildJSONRequest(
            "/auth/verify_email",
            "POST",
            { code: "badcode" },
            `auth_session=${sessionId}`,
          ),
        );

        expect(response.status).toBe(400);
        expect(await response.text()).toBe(
          "Invalid verification code provided",
        );
      });
    });

    describe("POST /auth/reset_password", () => {
      it("should not send a password reset email to a user without a verified email", async () => {
        const response = await auth.handle(
          buildJSONRequest("/auth/reset_password", "POST", {
            email: user.email,
          }),
        );

        expect(response.status).toBe(200);
        expect(await response.text()).toBe("Password reset email sent.");

        const token = await db.query.password_reset.findFirst({
          where: eq(password_reset.user_id, user.id),
        });

        expect(token).toBeUndefined();
      });

      it("should send a password reset email to a valid user", async () => {
        // First need to set the user's email to be verified
        await db
          .update(users)
          .set({ verified_email: true })
          .where(eq(users.id, user.id));

        const response = await auth.handle(
          buildJSONRequest("/auth/reset_password", "POST", {
            email: user.email,
          }),
        );

        expect(response.status).toBe(200);
        expect(await response.text()).toBe("Password reset email sent.");

        // Check if a password reset token is created
        const token = await db.query.password_reset.findFirst({
          where: eq(password_reset.user_id, user.id),
        });

        expect(token).toBeDefined();
        expect(token?.user_id).toBe(user.id);
        expect(token?.reset_token).toBeDefined();
        expect(token?.expires_at).toBeInstanceOf(Date);
      });

      it("should not create password reset for invalid user", async () => {
        const response = await auth.handle(
          buildJSONRequest("/auth/reset_password", "POST", {
            email: "bademail@email.com",
          }),
        );

        expect(response.status).toBe(200);
        expect(await response.text()).toBe("Password reset email sent.");

        const token = await db.query.password_reset.findFirst();
        expect(token).toBeUndefined();
      });
    });

    describe("POST /auth/reset_password/:token", () => {
      it("should reset the password of a user with a valid token", async () => {
        // First generate a password reset token (after setting user's email to be verified)
        await db
          .update(users)
          .set({ verified_email: true })
          .where(eq(users.id, user.id));

        const genResponse = await auth.handle(
          buildJSONRequest("/auth/reset_password", "POST", {
            email: user.email,
          }),
        );

        expect(genResponse.status).toBe(200);

        // Then get token from the DB
        const token = await db.query.password_reset.findFirst({
          where: eq(password_reset.user_id, user.id),
        });

        expect(token).toBeDefined();
        expect(token?.reset_token).toBeDefined();
        expect(token?.expires_at).toBeInstanceOf(Date);
        if (!token) return;

        // Now reset the user's password
        const response = await auth.handle(
          buildJSONRequest(
            `/auth/reset_password/${token.reset_token}`,
            "POST",
            {
              password: "newpassword",
            },
          ),
        );

        expect(response.status).toBe(200);
        expect(response.headers.get("Set-Cookie")).toBeDefined();

        // Check if the user's password is updated
        const updatedUser = await db.query.users.findFirst({
          where: eq(users.id, user.id),
        });

        expect(updatedUser).toBeDefined();
        if (!updatedUser) return;

        expect(
          await Bun.password.verify("newpassword", updatedUser.hashed_password),
        ).toBe(true);
        expect(updatedUser.email).toBe(user.email);
        expect(updatedUser.firstname).toBe(user.firstname);
        expect(updatedUser.lastname).toBe(user.lastname);
      });

      it("should return 200 but not generate a reset token for invalid user or user with unverified email", async () => {
        const bademailResponse = await auth.handle(
          buildJSONRequest(`/auth/reset_password`, "POST", {
            email: "bademail@email.com",
          }),
        );

        const bademailToken = await db.query.password_reset.findFirst();
        expect(bademailResponse.status).toBe(200);
        expect(bademailToken).toBeUndefined();

        const unverifiedResponse = await auth.handle(
          buildJSONRequest(`/auth/reset_password`, "POST", {
            email: user.email,
          }),
        );

        const unverifiedToken = await db.query.password_reset.findFirst();
        expect(unverifiedResponse.status).toBe(200);
        expect(unverifiedToken).toBeUndefined();
      });

      it("should return 400 for invalid token", async () => {
        const response = await auth.handle(
          buildJSONRequest(`/auth/reset_password/badtoken`, "POST", {
            password: "newpassword",
          }),
        );

        expect(response.status).toBe(400);
        expect(await response.text()).toBe("Invalid reset token");
      });

      it("should return 400 for expired tokens", async () => {
        const createToken = await db.insert(password_reset).values({
          reset_token: "expiredtoken",
          user_id: user.id,
          expires_at: new Date(Date.now() - 3600000),
        });

        const response = await auth.handle(
          buildJSONRequest(`/auth/reset_password/expiredtoken`, "POST", {
            password: "newpassword",
          }),
        );

        expect(response.status).toBe(400);
        expect(await response.text()).toBe("Invalid reset token");
      });
    });
  });
});
