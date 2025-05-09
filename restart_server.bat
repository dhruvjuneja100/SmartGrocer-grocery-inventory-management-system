@echo off
echo Stopping any existing Node.js server on port 5001...
FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :5001') DO (
  echo Found process: %%P
  taskkill /F /PID %%P
)
echo Starting server...
cd server
node server.js 