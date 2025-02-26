#!/bin/bash

# no need to prisma db seed if already seeded and generated
npx prisma migrate deploy

npx prisma db seed

# Build the Next site including SSG
npm run build

export PORT=3000

# Start the production server
npm run start
