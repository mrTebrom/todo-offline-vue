// Идентификатор проекта (auto-increment в БД)
export type ProjectId = number;

export interface Project {
    /** PK. При создании отсутствует, БД присвоит автоматически */
    id?: ProjectId;

    /** Заголовок проекта (обязателен) */
    title: string;

    /** Описание проекта (может быть пустым) */
    description: string;
}
