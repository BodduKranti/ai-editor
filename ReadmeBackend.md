## ============================================
Backend
## ============================================

#   Dependency
        1. npm i express
        2. npm i dotenv
        3. npm i cors
        4. npm i nodemon
        5. npm i cookie-parser
        6. npm i morgan [give the logs which api hit]
        7. npm i express-http-proxy
                        microservces to combine two services into one
                        app.use("/api/auth", proxy(process.env.AUTH_SERVICE))
        8. npm i firebase-admin 
                verify details from the frontend

                        process steps
                                1. create app
                                        - settings -> service accounts -> Generate new Private key -> click generate -> downloading file process [c:\Users\hp\Downloads\ai-editor-5150f-firebase-adminsdk-fbsvc-2472ba1431.json]

        docker-compose.yml
                run docker-compose.yml
                CMD    -        docker compose up
                CMD     -       docker compose up -d [Docker run on the background]
                CMD     -       npm i ioredis [for redis works]
1. Microservices
        structure
            -   gateway
            -   services
            -   shared



## ===================================
AI SERVICES
## ===================================

How to impliment
        LANgGRAPH
                START -> AGENT - IF GET RESPONSE - END [NODE]
                START -> AGENT - IF NOT GET RESPONSE - TOOLS [NODE]

        CMD : npm install @langchain/langgraph @langchain/core

        CMD : npm i zod 
                for schema validation
        CMD : npm install @langchain/openrouter

        TOOL Creation

