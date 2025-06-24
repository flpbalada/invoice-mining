up:
	docker compose up --build

down:
	docker compose down

production-up:
	docker compose -f docker-compose.prod.yml up --build

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

print-web-env:
	docker compose exec web printenv