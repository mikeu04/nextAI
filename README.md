# NextAI
> NextAI | Web-Based Text & Speech Response AI for PDF Document Queries

- A conversational AI with React and Ant Design for seamless text & speech interaction with uploaded PDF document.
- Designed for improved accessibility.
- Developed high-performance RESTful APIs using Express and Node.js. Optimized content retrieval by 50% with in-memory vector store.
- Ensured advanced document handling and AI-driven responses by Integrating OpenAI GPT-3.5 Turbo and LangChain.

---
### Initial Setup
1. download the project
2. add an `uploads/` folder under `server/`. All user uploaded PDF will be stored here.
3. run `npm install` under `server/` to install all necessary Node modules for Backend Server.
4. create a `.env` file under `server/`. Write REACT_APP_OPENAI_API_KEY=[Your OpenAI API Key here, without quotation marks & brackets]

### How to Start Running the Project
1. Complete **Initial Setup**
2. Under `server/` directory, run `node server.js` command to start the Backend Server at `PORT: 5001`
3. Under root directory, run `npm start` to start the Frontend at [PORT: 3000](http://localhost:3000)
