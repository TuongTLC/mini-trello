export interface userRegisterModel  {
    name: string;
    email: string;
    position: string;
}
export interface userAuthModel {
    email: string;
    otp: string;
}
export interface userInfoModel {
    id: string;
    name: string;
    email: string;
    position: string;
}
export interface user {
    email: string;
    id: string;
    name: string;
    position: string;
}

export interface usersCollection {
    [userId: string]: user;
}

export interface usersData {
    users: usersCollection;
}
export interface assigneeModel {
    id: string;
    name: string;
}