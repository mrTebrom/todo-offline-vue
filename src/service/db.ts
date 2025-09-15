import Dexie, { type Table } from 'dexie';
import type { Project } from '../model/project';

class AppDB extends Dexie {
    // Таблица с типами строк и ключа
    projects!: Table<Project, number>;

    constructor() {
        super('local-todo-db'); // имя вашей IndexedDB
        this.version(1).stores({
            // ++id — автоинкремент PK; индекс по title для быстрых выборок
            projects: '++id, title',
        });
    }
}

// Экспорт единственного экземпляра БД
export const db = new AppDB();
