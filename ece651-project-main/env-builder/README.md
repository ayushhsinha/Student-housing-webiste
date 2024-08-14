# Adding New Constants

There are two types of constants you can add: input, and derived.

Input constants simply take the value that they are given. For example, `FRONTEND_PORT` is an input constant that takes whatever port we want the frontent to run on and is set in the `.env`.

To add a new input constant, modify the `build-env.py` file in `env-builder` to prompt the user for a new constant using the `get_var` function.

Derived constants are built and formatted from other constants. For example, `HTTP_API_URL` is a constant URL built from a combination of the hostname and port number for the backend.

To add a new derived constant, modify the `generate-env.py` file in `env-builder`, setting the `config` object's key to the name of the constant, and the value to the value of the constant.

**!!! IMPORTANT !!!**
**DO NOT INCLUDE OR DERIVE ANY SECRETS (E.G. DATABASE PWDS) IN generate-env.py. IF THE FRONTEND IMPORTS THE GENERATED CONSTANTS FILE, IT WILL BE AVAILABLE TO ANYONE WHO LOADS THE PAGE**