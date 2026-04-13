# STAGE 1 — "builder"
# Goal: compile TypeScript → JavaScript (dist/)
# ──────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Set the working directory inside the container.
WORKDIR /app

# Copy only the package files first.
COPY package*.json ./

RUN npm ci

# Now copy the rest of the source code.
COPY . .

# Compile TypeScript → JavaScript.
RUN npm run build

# STAGE 2 — "runner"
# Goal: create a lean production image
# ──────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# Copy the environment file for database configuration
COPY .env ./.env

# Copy the entrypoint script that runs migrations then starts the server.
COPY docker-entrypoint.sh ./docker-entrypoint.sh

# Make the script executable inside the container.
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

CMD ["sh", "docker-entrypoint.sh"]
