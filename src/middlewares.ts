import { Request, Response, NextFunction } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "./database";
import { IDevelopers, IProject, IProjectTechnology, TProject } from "./interfaces";

const checkEmailExists = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  let email = req.body.email;
  const queryString: string = 
  `
    SELECT 
      *
    FROM 
      developers 
    WHERE 
      email = $1
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [email],
  };
  const queryResult: QueryResult<IDevelopers> = await client.query(queryConfig);
  
  if (queryResult.rowCount >= 0) {
    return res.status(409).json({ message: "Email already exists." });
  }
  
  return next();
};

const checkDeveloperExists = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const id = req.params.id;
  const queryString: string = 
  `
    SELECT
      *
    FROM
      developers
    WHERE
      id = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<IDevelopers> = await client.query(queryConfig);
  const dev: IDevelopers = queryResult.rows[0];

  if (queryResult.rowCount === 0) {
    return res.status(404).json({ message: "Developer not found." });
  };

  res.locals.dev = dev;

  return next();
};

const checkInfoExists = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const id = req.params.id;
  const queryString: string = 
  `
    SELECT
      *
    FROM
      "dev_infos"
    WHERE
      "developerId" = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<IDevelopers> = await client.query(queryConfig);

  if (queryResult.rowCount >= 1) {
    return res.status(409).json({ message: "Developer info already exists." });
  };

  return next();
};

const checkIdExists = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const id = req.body.id;
  const queryString: string =
  `
    SELECT
      *
    FROM
      projects
    WHERE
      "developerId" = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<IProject | TProject> = await client.query(queryConfig);
  const proj: IProject | TProject = queryResult.rows[0];

  if (queryResult.rowCount === 0) {
    return res.status(404).json({ message: "Developer not found." });
  };

  res.locals.proj = proj;

  return next();
};

const checkIdProject = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const id = req.params.id;
  const queryString: string = 
  `
    SELECT
      *
    FROM
      projects
    WHERE
      "id" = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<IProjectTechnology> = await client.query(queryConfig);
  const proj: IProjectTechnology = queryResult.rows[0];

  if (queryResult.rowCount === 0) {
    return res.status(404).json({ message: "Project not found." });
  };
  res.locals.proj = proj;

  return next();
};

export { checkEmailExists, checkDeveloperExists, checkInfoExists, checkIdExists, checkIdProject };
