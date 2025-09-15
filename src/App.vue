<template>
    <el-container class="layout" style="height: 100vh">
        <!-- Сайдбар -->
        <el-aside width="220px" class="sidebar">
            <el-scrollbar>
                <a class="brand" href="#">
                    <span class="brand-title">TO&nbsp;DO</span>
                    <!-- <span class="brand-sub">Full&nbsp;Local</span> -->
                </a>

                <el-divider class="brand-divider" />

                <el-menu class="sidemenu" :default-active="'inbox'" router>
                    <el-menu-item index="inbox">
                        <el-icon><Message /></el-icon><span>Входящие</span>
                    </el-menu-item>
                    <el-menu-item index="tomorrow">
                        <el-icon><Timer /></el-icon><span>Завтра</span>
                    </el-menu-item>
                    <el-menu-item index="week">
                        <el-icon><Calendar /></el-icon
                        ><span>На этой неделе</span>
                    </el-menu-item>
                    <el-menu-item index="no-date">
                        <el-icon><MoreFilled /></el-icon><span>Без даты</span>
                    </el-menu-item>
                </el-menu>

                <el-divider class="divider" />

                <div class="projects-header">
                    <span>Проекты</span>
                    <el-button
                        type="primary"
                        link
                        :icon="Plus"
                        @click="showCreateProject = true"
                    />
                </div>

                <el-menu
                    class="sidemenu projects"
                    :default-active="activeProject"
                    router
                >
                    <el-menu-item
                        v-for="project in projects"
                        :key="project.id"
                        :index="`project-${project.id}`"
                        @click="selectProject(project)"
                        >{{ project.title }}</el-menu-item
                    >
                </el-menu>
            </el-scrollbar>
        </el-aside>

        <!-- Контент -->
        <el-container>
            <el-header class="toolbar">
                <div class="toolbar-title">{{ currentProjectTitle }}</div>
                <div class="toolbar-actions">
                    <el-button size="small" type="primary" :icon="Plus"
                        >Добавить задачу</el-button
                    >
                </div>
            </el-header>

            <el-main class="main">
                <el-scrollbar>
                    <div class="content">
                        <CreateProject
                            v-model="showCreateProject"
                            @created="loadProjects"
                        />
                    </div>
                </el-scrollbar>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

import { listProjects } from './service/project.service';

import CreateProject from './components/create-project.vue';

import type { Project } from './model/project';

import {
    Message,
    Timer,
    Calendar,
    MoreFilled,
    Plus,
} from '@element-plus/icons-vue'; // ИКОНКИ!

const projects = ref<Project[]>([]);
const activeProject = ref<string>('inbox');
const currentProject = ref<Project | null>(null);
const showCreateProject = ref(false);

const currentProjectTitle = computed(() => {
    if (activeProject.value === 'inbox') return 'Входящие';
    if (activeProject.value === 'tomorrow') return 'Завтра';
    if (activeProject.value === 'week') return 'На этой неделе';
    if (activeProject.value === 'no-date') return 'Без даты';
    return currentProject.value?.title || 'Проект';
});

const loadProjects = async () => {
    try {
        projects.value = await listProjects();
    } catch (error) {
        console.error('Ошибка загрузки проектов:', error);
        // Можно добавить уведомление пользователю
    }
};

const selectProject = (project: Project) => {
    currentProject.value = project;
    activeProject.value = `project-${project.id}`;
};

onMounted(loadProjects);
</script>

<style scoped>
.sidebar {
    background: var(--sidebar-bg);
    border-right: 1px solid var(--sidebar-border);
}

.sidemenu {
    border-right: 0;
    padding: 8px 6px;
    background: transparent !important;

    --el-menu-bg-color: transparent;
    --el-menu-text-color: var(--sidebar-fg);
    --el-menu-active-color: var(--sidebar-active-fg);
    --el-menu-hover-text-color: var(--sidebar-active-fg);
    --el-menu-hover-bg-color: var(--sidebar-hover-bg);
    --el-menu-item-height: 38px;
}

.sidemenu :deep(.el-menu-item) {
    height: var(--el-menu-item-height);
    line-height: var(--el-menu-item-height);
    margin: 4px 6px;
    padding: 0 10px !important;
}

.sidemenu :deep(.el-menu-item .el-icon) {
    font-size: 16px;
    margin-right: 8px;
}

.sidemenu :deep(.el-menu-item.is-active) {
    font-weight: 600;
    box-shadow: inset 2px 0 0 0 var(--el-color-primary);
}

.divider {
    margin: 10px 8px;
    border-top-color: var(--sidebar-border);
}

.projects-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 12px 0 12px;
    color: var(--sidebar-fg);
    font-weight: 600;
    font-size: 13px;
}

/* ---- Хедер/контент ---- */
.toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 16px;
    background: #fff;
    border-bottom: 1px solid var(--el-border-color-lighter);
}

.main {
    padding: 0;
    background: #f8fafc;
}

.content {
    padding: 16px;
}

/* ---- Брендинг ---- */
.brand {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 14px 12px 8px;
    text-decoration: none;
    user-select: none;
    text-align: center;
}

.brand-title {
    font-family: 'Black Ops One', system-ui, -apple-system, Segoe UI, Roboto,
        Arial, sans-serif;
    font-size: 24px;
    line-height: 1;
    letter-spacing: 0.02em;
    color: var(--brand);
}

.brand-divider {
    margin: 8px 10px 6px;
    border-top-color: var(--el-border-color-light);
}
</style>
