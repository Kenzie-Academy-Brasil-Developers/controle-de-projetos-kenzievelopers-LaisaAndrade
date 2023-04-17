import express, { Application } from "express";
import "dotenv/config";
import { createDevelopers, createInfo, createProject, deleteDevelopers, listDevelopers, listProjects, updateDevelopers, updateProjects, deleteProjects } from "./logics";
import { checkDeveloperExists, checkEmailExists, checkIdExists, checkIdProject, checkInfoExists } from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/developers", checkEmailExists, createDevelopers);
app.get("/developers/:id", checkDeveloperExists, listDevelopers);
app.patch("/developers/:id",checkDeveloperExists, checkEmailExists, updateDevelopers);
app.delete("/developers/:id", checkDeveloperExists, deleteDevelopers);
app.post("/developers/:id/infos", checkDeveloperExists, checkInfoExists, createInfo);

app.post("/projects", checkIdExists, createProject);
app.get("/projects/:id", checkIdProject, listProjects);
app.patch("/projects/:id", checkIdProject, checkIdExists, updateProjects);
app.delete("/projects/:id", checkIdProject, deleteProjects);
app.post("/projects/:id/technologies");
app.delete("/projects/:id/technologies/:name");

export default app;
