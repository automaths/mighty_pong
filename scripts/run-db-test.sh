#!/bin/bash

docker-compose -f docker-compose.test.yml up --build -d postgres

docker-compose -f docker-compose.test.yml up --build --exit-code-from db-test

exit_status=$?
docker-compose -f docker-compose.test.yml down

if [[ $exit_status -eq 0 ]]; then
    exit 0;
fi
exit 1;