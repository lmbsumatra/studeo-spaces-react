#!/bin/bash

# Export the database
mysqldump -u root -p laravel > laravel.sql

# Add, commit, and push changes to GitHub
git add laravel.sql
git commit -m "Automated update of database"
git push origin main
