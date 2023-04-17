interface IDevelopers {
    id: number,
    name: string,
    email: string,
};

type TDeveloper = Omit<IDevelopers, "id">;

interface IDeveloperInfo {
    devId: number,
    devName: string,
    devEmail: string,
    infoSince?: Date | null,
    infoPreferred?: string | null,
};

interface IInfoDevelopers {
    id: number,
    developerSince: Date,
    preferredOS: string,
    developerId?: number,
};

interface IInfoDeveloper {
    since: Date,
    preferreds: "Windows" | "Linux" | "MacOS",
};

interface IProject {
    name: string,
    description: string,
    estimatedTime: string,
    repository: string,
    startDate: Date,
    endDate: Date | null,
    developerId: number,
};

type TProject = Omit<IProject, "endDate">;

type TProjectRes = IProject & { id: number };

type TProjRes = Omit<TProjectRes, "endDate">;

interface IUpdateProject {
    name?: string,
    description?: string,
    estimatedTime?: string,
    repository?: string,
    startDate?: Date,
    endDate?: Date | null,
    developerId?: number,
};

interface IProjectTechnology {
    projId: number,
    projName: string,
    projDescription: string,
    projEstimatedTime: string,
    projRepository: string,
    projStartDate: Date,
    projEndDate: Date | null,
    projDeveloperId: number,
    techId: number | null,
    techName: string | null,
}; 

interface ITechnology {
    id?: number,
    name: string,
};

interface IProjetcTechnology {
    id?: number,
    addedIn: Date,
    technologyId?: number,
    projectId?: number,
};
  
export { IDevelopers, TDeveloper, IDeveloperInfo, IInfoDevelopers, IInfoDeveloper, IProject, TProject, TProjectRes, TProjRes, IUpdateProject, IProjectTechnology, ITechnology, IProjetcTechnology };
  