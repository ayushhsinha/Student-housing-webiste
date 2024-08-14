import { User, Session, verifyRequestOrigin, Lucia, generateId } from "lucia";
import { db, luciaAdapter } from "../db/db";
import { users, email_verification, password_reset } from "db/schema";
import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { alphabet, generateRandomString } from "oslo/crypto";
import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import { DrizzlePostgresError, DatabaseUserAttributes, HOST } from "./common";

const VERIFICATION_CODE_LENGTH = 6;
const VERIFICATION_CODE_TIME_MINS = 30;

const PASSWORD_RESET_CODE_LENGTH = 40;
const PASSWORD_RESET_TIME_MINS = 60;

const createPasswordSchema = (
  description: string = "",
  error: string = JSON.stringify({
    status: 200,
    message: "password with minimum length of 8 characters is required.",
  }),
) => {
  return t.String({
    minLength: 8,
    maxLength: 255,
    error,
    description,
  });
};

const lucia = new Lucia(luciaAdapter, {
  sessionCookie: {
    attributes: {
      secure: false,
    },
  },
  getUserAttributes: (attributes) => {
    // Don't return user's ID or their password!
    return {
      firstname: attributes.firstname,
      lastname: attributes.lastname,
      email: attributes.email,
      verified_email: attributes.verified_email,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
const loginRespone = {
  status: 200,
  message: "Request successful.",
};
async function createSessionForUser(user_id: string, redirect: string = "/") {
  const session = await lucia.createSession(user_id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  return new Response(JSON.stringify(loginRespone), {
    status: 200,

    headers: {
      // Location: redirect,
      "Set-Cookie": sessionCookie.serialize(),
    },
  });
}

// Creates a verification code for a user, and returns that code
const createEmailVerificationCode = async (user_id: string) =>
  db.transaction(async (tx) => {
    // Delete all previous verification codes for user first
    await tx
      .delete(email_verification)
      .where(eq(email_verification.user_id, user_id));

    const code = generateRandomString(
      VERIFICATION_CODE_LENGTH,
      alphabet("0-9", "A-Z"),
    );
    await tx.insert(email_verification).values({
      user_id,
      verification_code: code,
      expires_at: createDate(new TimeSpan(VERIFICATION_CODE_TIME_MINS, "m")),
    });
    return code;
  });

export const createPasswordResetToken = async (user_id: string) =>
  db.transaction(async (tx) => {
    await tx.delete(password_reset).where(eq(password_reset.user_id, user_id));

    const tokenId = generateId(PASSWORD_RESET_CODE_LENGTH);

    await tx.insert(password_reset).values({
      reset_token: tokenId,
      user_id,
      expires_at: createDate(new TimeSpan(PASSWORD_RESET_TIME_MINS, "m")),
    });

    return tokenId;
  });

const verifyEmailVerificationCode = async (user: User, code: string) =>
  await db.transaction(async (tx) => {
    const dbCode = await tx.query.email_verification.findFirst({
      where: eq(email_verification.user_id, user.id),
    });

    if (!dbCode || dbCode.verification_code !== code) {
      return false;
    }
    await tx
      .delete(email_verification)
      .where(eq(email_verification.user_id, user.id));

    // Expired codes are not valid
    if (!isWithinExpirationDate(dbCode.expires_at)) {
      return false;
    }
    return true;
  });

const findPasswordResetToken = async (token: string) =>
  db.transaction(async (tx) => {
    const maybeToken = await tx.query.password_reset.findFirst({
      where: eq(password_reset.reset_token, token),
    });

    if (maybeToken) {
      await tx
        .delete(password_reset)
        .where(eq(password_reset.reset_token, token));
    }

    return maybeToken;
  });

async function sendEmailVerificationCode(email: string, code: string) {
  console.log(`Email verification code:`, code);
}

async function sendPasswordResetLink(email: string, link: URL) {
  console.log(`Password verification: `, link);
}

// Include on your route if you want session authentication
export const authCheck = new Elysia({ name: "Authentication Check" })
  // Taken from: https://lucia-auth.com/guides/validate-session-cookies/elysia
  .derive(
    { as: "scoped" },
    async (
      context,
    ): Promise<{
      user: User | null;
      session: Session | null;
    }> => {
      // CSRF check -- exception for development
      if (
        context.request.method !== "GET" &&
        context.request.headers.get("Host") !== "localhost:3000"
      ) {
        const originHeader = context.request.headers.get("Origin");
        // NOTE: You may need to use `X-Forwarded-Host` instead
        const hostHeader =
          context.request.headers.get("Host") ||
          context.request.headers.get("X-Forwarded-Host");
        if (
          !originHeader ||
          !hostHeader ||
          !verifyRequestOrigin(originHeader, [hostHeader])
        ) {
          return {
            user: null,
            session: null,
          };
        }
      }

      // use headers instead of Cookie API to prevent type coercion
      const cookieHeader = context.request.headers.get("Cookie") ?? "";
      const sessionId = lucia.readSessionCookie(cookieHeader);
      if (!sessionId) {
        return {
          user: null,
          session: null,
        };
      }

      const { session, user } = await lucia.validateSession(sessionId);
      if (session && session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);
        context.cookie[sessionCookie.name].set({
          value: sessionCookie.value,
          ...sessionCookie.attributes,
        });
      }
      if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        context.cookie[sessionCookie.name].set({
          value: sessionCookie.value,
          ...sessionCookie.attributes,
        });
      }
      return {
        user,
        session,
      };
    },
  );

export const auth = new Elysia({ name: "Authentication", prefix: "/auth" })
  .use(authCheck)
  .post(
    "/signup",
    async ({
      body: { firstname, lastname, confirmpassword, password, email },
      set,
    }) => {
      try {
        const id = generateId(15);
        const hashedPassword = await Bun.password.hash(password);

        // TODO: consider that usernames shouldn't be emails?
        // Will throw error if username, pwd, or email are non-unique
        await db.insert(users).values({
          id,
          firstname,
          lastname,
          email,
          hashed_password: hashedPassword,
        });

        // TODO: email user with verification code
        const verificationCode = await createEmailVerificationCode(id);
        await sendEmailVerificationCode(email, verificationCode);
        return await createSessionForUser(id);
      } catch (e) {
        const maybePostgresDrizzleError = (
          typeof e === "object" ? e : {}
        ) as Partial<DrizzlePostgresError>;

        // Uniqueness key constraint error
        const responseSignIn = {
          status: 400,
          message: "User already exists.",
        };
        if (maybePostgresDrizzleError.code === "23505") {
          return new Response(JSON.stringify(responseSignIn), {
            status: 400,
          });
        }
      }
    },
    {
      detail: {
        tags: ["Auth"],
        description: "Creates a user",
        responses: {
          200: {
            description: "Redirects to main page on success",
            headers: {
              // Location: { description: "Redirect page" },
              "Set-Cookie": { description: "Serialized user session token" },
            },
          },
          400: {
            description: "Error on invalid user data provided",
          },
          500: {
            description: "Error on internal sever error",
          },
        },
      },
      body: t.Object({
        firstname: t.String({
          error: "firstname is missing",
          description: "Publicly available & visible firstname",
        }),
        lastname: t.String({
          error: "Lastname is missing.",
          description: "Publicly available & visible lastname",
        }),
        password: createPasswordSchema(
          "Password for the user to use (will be hashed internally)",
        ),
        confirmpassword: createPasswordSchema(
          "Password for the user to use (will be hashed internally)",
        ),
        email: t.String({
          format: "email",
          error: JSON.stringify({
            status: 400,
            message: "Invalid email format.",
          }),
          description: "Email the user wants to use",
        }),
      }),
    },
  )
  .post(
    "/login",
    async ({ body, user, session }) => {
      // User already logged-in, just redirect them
      if (session) {
        const sessionResponse = { status: 200, message: "Already logged in" };
        return new Response(JSON.stringify(sessionResponse), {
          status: 200,
          headers: {
            // Location: "/",
          },
        });
      }

      const maybeUser = await db.query.users.findFirst({
        where: eq(users.email, body.email),
      });

      let hashedPassword = "";
      if (maybeUser) {
        hashedPassword = maybeUser.hashed_password;
      }

      // note: hash password to prevent timing attacks to discover users
      const correctPassword = await Bun.password.verify(
        body.password,
        hashedPassword,
      );

      if (correctPassword && maybeUser) {
        return await createSessionForUser(maybeUser.id);
      } else {
        const InvalidResponse = {
          status: 400,
          message: "Invalid username or password",
        };
        return new Response(JSON.stringify(InvalidResponse), {
          status: 400,
        });
      }
    },
    {
      detail: {
        tags: ["Auth"],
        description: "Logs a user in if not already logged in",
        responses: {
          200: {
            description:
              "Redirects to main page on success, or if user is already logged in",
            headers: {
              // Location: { description: "Redirect page" },
              "Set-Cookie": { description: "Serialized user session token" },
            },
          },
          400: {
            description: "Error on invalid user data provided",
          },
        },
      },
      body: t.Object({
        email: t.String({
          format: "email",
          error: "Invalid email format",
          description: "The email to login with",
        }),
        password: createPasswordSchema(),
      }),
    },
  )
  .post(
    "/logout",
    async ({ user, session }) => {
      // Don't do anything if a user is already signed out
      if (!session) {
        return new Response("", {
          status: 401,
        });
      }

      await lucia.invalidateSession(session.id);
      const sessionCookie = lucia.createBlankSessionCookie();
      return new Response(
        JSON.stringify({ status: 200, message: "Logout successful" }),
        {
          status: 200,
          headers: {
            // Location: "/",
            "Set-Cookie": sessionCookie.serialize(),
          },
        },
      );
    },
    {
      detail: {
        tags: ["Auth"],
        description: "Logs a user out if they are logged in",
        responses: {
          302: {
            description: "Redirects to main page on success",
            headers: {
              Location: { description: "Redirect page" },
              "Set-Cookie": { description: "Serialized user session token" },
            },
          },
          401: {
            description: "Error if user is not logged in",
          },
        },
      },
    },
  )
  .post(
    "/verify_email",
    async ({ user, session, body: { code } }) => {
      if (!user) {
        return new Response("", {
          status: 401,
        });
      }

      const validCode = await verifyEmailVerificationCode(user, code);
      if (!validCode) {
        return new Response("Invalid verification code provided", {
          status: 400,
        });
      }

      // Invalidate all sessions
      await lucia.invalidateUserSessions(user.id);
      await db
        .update(users)
        .set({ verified_email: true })
        .where(eq(users.email, user.email));

      return await createSessionForUser(user.id);
    },
    {
      detail: {
        tags: ["Auth"],
        description: "Verifies the logged in user's email",
        responses: {
          302: {
            description: "Redirects to main page on success",
            headers: {
              Location: { description: "Redirect page" },
              "Set-Cookie": { description: "Serialized user session token" },
            },
          },
          401: { description: "Error if user is not logged in" },
          400: {
            description: "Error if invalid verification code is provided",
          },
        },
      },
      body: t.Object({
        code: t.String({
          description: "The verification code to check",
          error: "A verification code must be provided",
        }),
      }),
    },
  )
  .post(
    "/reset_password",
    async ({ body: { email }, user, session }) => {
      const userObj = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      // For security reasons, if no user exists still act as if a reset email has been generated
      if (!userObj || !userObj.verified_email) {
        return new Response("Password reset email sent.");
      }

      const verificationToken = await createPasswordResetToken(userObj.id);
      const verificationLink = new URL(
        "/auth/reset_password/" + verificationToken,
        HOST,
      );

      await sendPasswordResetLink(email, verificationLink);
      return new Response("Password reset email sent.");
    },
    {
      detail: {
        tags: ["Auth"],
        description:
          "Generates and sends a reset password link to an email if it exists in the users table",
        responses: {
          200: {
            description:
              "Successfully sent password reset email to user's email in DB; otherwise, a no-op",
          },
          500: {
            description: "Internal server error while attempting to send email",
          },
        },
      },
      body: t.Object({
        email: t.String({
          format: "email",
          description: "The email corresponding to the user to reset",
          error: "A valid email must be provided",
        }),
      }),
    },
  )
  .post(
    "/reset_password/:token",
    async ({ params: { token }, body: { password }, user, session }) => {
      const maybeToken = await findPasswordResetToken(token);

      // Invalid or expired token
      if (!maybeToken || !isWithinExpirationDate(maybeToken.expires_at)) {
        return new Response("Invalid reset token", {
          status: 400,
        });
      }

      await lucia.invalidateUserSessions(maybeToken.user_id);
      const hashedPassword = await Bun.password.hash(password);
      await db
        .update(users)
        .set({ hashed_password: hashedPassword })
        .where(eq(users.id, maybeToken.user_id));

      return createSessionForUser(maybeToken.user_id);
    },
    {
      detail: {
        tags: ["Auth"],
        description: "Resets the password of the user who requested a reset",
        responses: {
          302: {
            description: "Redirects to main page on success",
            headers: {
              Location: { description: "Redirect page" },
              "Set-Cookie": { description: "Serialized user session token" },
            },
          },
          400: { description: "Error on invalid reset token provided" },
        },
      },
      body: t.Object({
        password: createPasswordSchema("The new password desired by the user"),
      }),
    },
  )
  .get("/profile", async ({ user }) => {
    if (!user) {
      return new Response("Not logged in", {
        status: 401,
      });
    }

    return user;
  });
