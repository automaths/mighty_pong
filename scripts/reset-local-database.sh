#!/bin/bash

docker stop ft_transcendence-postgre-1

pwd

docker-compose exec postgres sh -c "cd /database/ && psql -U postgres --quiet -f setup.sql"

docker-compose up -d postgres