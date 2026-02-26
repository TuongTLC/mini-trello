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
    memberIds: string[];
    isComplete: boolean;
}