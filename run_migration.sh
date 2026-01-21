#!/bin/bash
cd backend
npx prisma migrate dev --name add_is_default_to_user_location
