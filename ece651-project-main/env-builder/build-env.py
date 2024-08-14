with open(".env", "w") as env:
    # Prompt the user for a value for var_name, using default if the user provides an empty line
    # These vars are available to both the front and backend
    def get_var(var_name, default):
        user_input = input(f"{var_name} (default: {default}):")
        if user_input == "":
            user_input = default

        user_input = f"{var_name}={user_input}\n"
        env.write(user_input)
        
    print("Enter values for the following environment variables:")
    print("=====================================================")

    ##############
    ## GET VARS ##
    ##############
    
    get_var("FRONTEND_PORT", "4200")
    get_var("BACKEND_PORT", "3000")
    get_var("DB_PORT", "5432")
    get_var("FRONTEND_HOSTNAME", "frontend")
    get_var("BACKEND_HOSTNAME", "backend")
    get_var("DB_HOSTNAME", "db")