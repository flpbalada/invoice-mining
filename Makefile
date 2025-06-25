up:
	docker compose up --build

down:
	docker compose down

production-up:
	docker compose -f docker-compose.prod.yml up --build -d

production-deploy: production-down production-build production-up production-prune
	@echo "✅ Production deployment complete."

production-down:
	docker compose -f docker-compose.prod.yml down

production-build:
	docker compose -f docker-compose.prod.yml build --no-cache

production-prune:
	docker image prune -f

prisma-studio:
	docker compose exec web yarn prisma studio

prisma-migrate:
	docker compose exec web yarn prisma migrate dev

prisma-deploy:
	docker compose exec web yarn prisma migrate deploy

prisma-push:
	docker compose exec web yarn prisma db push

prisma-generate:
	docker compose exec web yarn prisma generate

prisma-reset:
	docker compose exec web yarn prisma migrate reset --force

print-web-env:
	docker compose exec web printenv
