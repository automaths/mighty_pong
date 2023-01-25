#!/bin/bash

cd /database/
psql -U postgres --quiet -f setup.sql
psql -U postgres --quiet -f setup-test.sql