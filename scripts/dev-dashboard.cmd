@echo off
set PATH=C:\BudStore\rareimagery\node-v22.14.0-win-x64;%PATH%
cd /d C:\RareImagery\frontend
npx pnpm@9 --filter @rareimagery/dashboard dev
