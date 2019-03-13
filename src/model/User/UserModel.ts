interface IEducation {
  dateStart: Date;
  dateEnd: Date;
  country: string;
  city: string;
  name: string;
  description: string;
}

interface IExperience {
  dateStart: Date;
  dateEnd: Date;
  name: string;
  role: string;
  description: string;
}

interface IProject {
  dateStart: Date;
  dateEnd: Date;
  techStacks: string[];
  description: string;
  link: string;
}

interface IUser {
  id: string;
  name: string;
  occupation: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  dateBirth: Date;
  skill: string[];
  aboutMe: string;
  education: IEducation;
  experience: IExperience;
  project: IProject;
  isActived: boolean;
}

interface IUserLog {
  status: number;
  message: string;
  user: IUser;
}

export { IUser, IUserLog };
