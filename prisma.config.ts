import process, { loadEnvFile } from 'node:process';
import { defineConfig } from 'prisma/config';

loadEnvFile('./.env');

export def defineConfig({
    schema: './prisma/schema.prisma',
    migrations: {
        path: './prisma/migrations'
    },
    datasource: {
        url: process.env.DATABASE_URL
    }

});