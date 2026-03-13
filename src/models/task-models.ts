export interface taskCreateModel{
    cardId: string;
    title: string;
    description: string;
    dueDate: string;
    startDate: string;
    createDate: string;
    memberIds: string[];
    isComplete: boolean;
}
export interface taskInfoModel{
    taskId: string;
    cardId: string;
    title: string;
    description: string;
    dueDate: string;
    startDate: string;
    createDate: string;
    assignees: {
        [uuid: string]: Assignee;
    };
    isComplete: boolean;
}
export interface Assignee {
    uuid: string;
    name: string;
}

export interface taskUpdateModel {
    taskId: string;
    title: string;
    description?: string;
    dueDate?: string;
    startDate?: string;
    isComplete?: boolean;
    memberIds?: string[];
}