# Generates derived environment variables (e.g. addresses) to use
from dotenv import dotenv_values
import json
import shutil

config = dotenv_values(".env")  # take environment variables from .env.

#########################
### DERIVED CONSTANTS ###
#########################

# To create a new derived constant, simply set the key in the `config` object to the constant

config["API_URL_HTTP"] = f"http://{config['BACKEND_HOSTNAME']}:{config['BACKEND_PORT']}/"

# Copy to JSON

with open("shared_constants.json", "w") as json_file:
    json.dump(config, json_file, indent=4)

#######################
## GENERATED SECRETS ##
#######################

# Move file to shared directory

shutil.move("./shared_constants.json", "../shared/shared_constants.json")
shutil.copy(".env", "../.env")