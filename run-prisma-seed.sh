# This file assumes you are using a UNIX OS and are looking to automate the seeding process.
# Replace path/to/your/project with the project directory.

# 1. cd to path/to/your/project
# 2. Execute: crontab -e
# 3. Add to the file: 0 15 * * * /bin/bash /path/to/your/project/run-prisma-seed.sh

#!/bin/bash
cd /path/to/your/project
npx prisma db seed
