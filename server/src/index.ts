import express, { Express, Request, Response } from "express";

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("TypeScript Express Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
