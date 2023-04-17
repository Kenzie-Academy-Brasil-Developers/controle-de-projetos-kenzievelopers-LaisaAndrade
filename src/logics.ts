import { Request, Response } from "express";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "./database";
import { IDeveloperInfo, IDevelopers, IInfoDevelopers, IProject, IProjectTechnology, IUpdateProject, TDeveloper, TProjRes, TProject, TProjectRes } from "./interfaces";

const createDevelopers = async (req: Request, res: Response): Promise<Response> => {
  const developerData: TDeveloper = req.body;
  const queryString: string = format(
    `
      INSERT INTO 
        developers(%I)
      VALUES
        (%L)
      RETURNING *;
    `,
    Object.keys(developerData),
    Object.values(developerData)
  );
  const queryResult: QueryResult<IDevelopers> = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

const listDevelopers = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const queryString: string = 
  `
    SELECT
      dev. "id" AS "devId",
      dev. "name" AS "devName",
      dev. "email" AS "devEmail",
      devInfo. "developerSince" AS "infoSince",
      devInfo. "preferredOS" AS "infoPreferred"
    FROM
      dev_infos "devInf"
    RIGHT JOIN
      developers dev ON "devInf"."devId" = dev."id"
    WHERE
      dev. "id"=$1;
  `;
  const queryResult:QueryResult<IDeveloperInfo> = await client.query(queryString, [id]);

  return res.json(queryResult.rows[0]);
};

const updateDevelopers = async (req: Request, res: Response): Promise<Response> => {
  const developerData: TDeveloper = req.body;
  const id: number = parseInt(req.params.id);
  const queryString: string = format(
    `
      UPDATE
        developers
      SET (%I) = ROW (%L)
      WHERE
        id = $1
      RETURNING *;
    `,
    Object.keys(developerData),
    Object.values(developerData)
  );
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<IDevelopers> = await client.query(queryConfig);

  return res.json(queryResult.rows[0]);
};

const deleteDevelopers = async (req: Request, res: Response): Promise<Response> => {
  const id: number = parseInt(req.params.id);
  const queryString: string = 
  `
    DELETE FROM
      developers
    WHERE
      id = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  await client.query(queryConfig);

  return res.status(204).send();
};

const createInfo = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseInt(req.params.id);
    const infoData = {
      developerSince: req.body.developerSince,
      preferresOS: req.body.preferredOS,
      developerId: id,
    };
    const queryString: string = format(
      `
        INSERT INTO
          dev_infos (%I)
        VALUES
          (%L)
        RETURNING *;
      `,
      Object.keys(infoData),
      Object.values(infoData)
    );
    const queryResult: QueryResult<IInfoDevelopers> = await client.query(queryString);

    return res.status(201).json(queryResult.rows[0]);
  } catch (error) {

    if (error instanceof Error) {
      const infoData = {
        preferredOS: req.body.preferredOS,
      };

      if (infoData.preferredOS !== "Windows" || "Linux" || "MacOS") {
        return res.status(400).json({
          message: "Invalid OS option.",
          options: ["Windows", "Linux", "MacOS"]
        });
      };
    };
    return res.status(500).json({
      message: error
    });
  };
};

const createProject = async (req: Request, res: Response): Promise<Response> => {
  const projectData: IProject | TProject = req.body;
  const queryString: string = format (
    `
      INSERT INTO
        projects (%I)
      VALUES
        (%L)
      RETURNING *;
    `,
    Object.keys(projectData),
    Object.values(projectData)
  );
  const queryResult: QueryResult<TProjectRes | TProjRes> = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

const listProjects = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.body;
  const queryString: string = 
  `
    SELECT
      proj. "id" AS "projId",
      proj. "name" AS "projName",
      proj. "description" AS "projDescription",
      proj. "estimatedTime" AS "projEstimatedTime",
      proj. "repository" AS "projRepository",
      proj. "startDate" AS "projStartDate",
      proj. "endDate" AS "projEndDate",
      proj. "developerId" AS "projDeveloperId",
      tec. "id" AS "techId",
      tec. "name" AS "techName"
    FROM
      "project_technology" "projTech"
    RIGHT JOIN
      technology tec ON tec.id = "projTech"."techId"
    RICHT JOIN 
      project proj ON "projTech"."projId" = proj."id"
    WHERE
      proj. "id" = $1;
  `;
  const queryResult: QueryResult<IProjectTechnology> = await client.query(queryString, [id]);

  return res.json(queryResult.rows[0]);
};

const updateProjects = async (req: Request, res: Response): Promise<Response> => {
  const projectData: IUpdateProject = req.body;
  const id: number = parseInt(req.params.id);
  const queryString: string = format (
    `
      UPDATE
        projects
      SET (%I) = ROW(%L)
      WHERE
        id = $1
      RETURNING *;
    `, 
    Object.keys(projectData),
    Object.values(projectData)
  );
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<TProjRes | TProjectRes> = await client.query(queryConfig);

  return res.json(queryResult.rows[0]);
};

const deleteProjects = async (req: Request, res: Response): Promise<Response> => {
  const id: number = parseInt(req.params.id);
  const queryString: string = 
  `
    DELETE FROM
      projects
    WHERE
      id = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  await client.query(queryConfig);

  return res.status(204).send();
};

export { createDevelopers, listDevelopers, updateDevelopers, deleteDevelopers, createInfo, createProject, listProjects, updateProjects, deleteProjects };
