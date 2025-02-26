# Dockerfile.api
FROM node:18-alpine

# RUN useradd -ms /bin/sh -u 1001 app
# USER app

WORKDIR /app

# Install dependencies
COPY package*.json ./

COPY --chown=nextjs:nodejs prisma ./prisma/  

# Copy application code
COPY . .

# Build the Prisma client
# RUN npx prisma generate deploy

# RUN npx prisma db seed

RUN npm install

# Build the Next.js app
RUN npm run build

# Expose port 3001
EXPOSE 3000

# RUN npx prisma migrate deploy

# Start the application
# CMD ["npm", "start"]

#RUN npx prisma migrate deploy
#RUN npx prisma db seed

#CMD ["node", ".next/standalone/server.js"]
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/bin/sh", "/docker-entrypoint.sh"]
