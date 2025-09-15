import { db } from './db';
import type { ProjectId, Project } from '../model/project';

/** Создать проект и вернуть его id */
export async function addProject(
    title: string,
    description = '',
): Promise<ProjectId> {
    const project: Project = {
        title: title.trim(),
        description: description ?? '',
    };
    return db.projects.add(project);
}

/** Получить один проект */
export function getProject(id: ProjectId) {
    return db.projects.get(id);
}

/** Список проектов (упорядочим по id возрастанию) */
export function listProjects() {
    return db.projects.orderBy('id').toArray();
}

/** Обновить поля проекта (частично) */
export function updateProject(
    id: ProjectId,
    patch: Partial<Omit<Project, 'id'>>,
) {
    return db.projects.update(id, patch);
}

/** Удалить проект */
export function removeProject(id: ProjectId) {
    return db.projects.delete(id);
}
