<template>
    <el-dialog
        v-model="model"
        title="Новый проект"
        width="520"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        :append-to-body="true"
    >
        <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-position="top"
            status-icon
        >
            <el-form-item label="Название проекта" prop="name">
                <el-input
                    v-model="form.name"
                    placeholder="Введите название проекта"
                    @keyup.enter="onSubmit"
                />
            </el-form-item>

            <el-form-item label="Описание проекта" prop="desc">
                <el-input
                    v-model="form.desc"
                    type="textarea"
                    :rows="4"
                    placeholder="Описание проекта (необязательно)"
                />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="onCancel">Отмена</el-button>
            <el-button type="primary" :loading="submitting" @click="onSubmit">
                Создать
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { addProject } from '../service/project.service';

/** Поддержка v-model из родителя */
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean): void;
    (e: 'created', id: number): void;
}>();

const model = computed({
    get: () => props.modelValue,
    set: (v: boolean) => emit('update:modelValue', v),
});

const submitting = ref(false);
const formRef = ref<FormInstance>();
const form = reactive({ name: '', desc: '' });

const rules: FormRules<typeof form> = {
    name: [
        {
            required: true,
            message: 'Укажите название проекта',
            trigger: 'blur',
        },
        { min: 2, max: 60, message: 'От 2 до 60 символов', trigger: 'blur' },
    ],
    desc: [{ max: 500, message: 'До 500 символов', trigger: 'blur' }],
};

const reset = () => {
    form.name = '';
    form.desc = '';
    formRef.value?.clearValidate();
};

const onCancel = () => {
    reset();
    model.value = false;
};

const onSubmit = async () => {
    if (!formRef.value) return;
    await formRef.value.validate(async (valid) => {
        if (!valid) return;
        submitting.value = true;
        try {
            const id = await addProject(form.name, form.desc);
            emit('created', id);
            model.value = false;
            reset();
        } finally {
            submitting.value = false;
        }
    });
};
</script>

<style scoped>
:deep(.el-form--label-top .el-form-item__label) {
    padding-bottom: 4px;
}
:deep(.el-form-item) {
    margin-bottom: 12px;
}
</style>
