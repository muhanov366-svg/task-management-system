import React, { useState } from 'react';
import {
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Formik, Form } from 'formik';
import { DatePicker } from '@mui/x-date-pickers';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import * as yup from 'yup';
import { generateTaskId } from '../utils/taskIdGenerator';
import { formatTime, calculateDuration } from '../utils/timeFormatter';
import CustomInput from '../components/common/CustomInput';
import CustomSelect from '../components/common/CustomSelect';

const taskValidationSchema = yup.object().shape({
  title: yup.string().required('Заголовок обязателен'),
  subtitle: yup.string().required('Подзаголовок обязателен'),
  author: yup.string().required('Автор обязателен'),
  assignee: yup.string().required('Исполнитель обязателен'),
  estimatedHours: yup
    .number()
    .required('Время выполнения обязательно')
    .min(1, 'Минимум 1 час')
    .max(240, 'Максимум 240 часов (30 дней)'),
  description: yup
    .string()
    .required('Описание обязательно')
    .min(40, 'Описание должно содержать минимум 40 символов'),
  comments: yup
    .string()
    .test(
      'comments-length',
      'Комментарии должны содержать минимум 40 символов',
      (value) => !value || value.length >= 40
    ),
  watchers: yup.array().of(yup.string()),
});

const sprintValidationSchema = yup.object().shape({
  name: yup.string().required('Имя спринта обязательно'),
  goal: yup.string().required('Цель спринта обязательна'),
  startDate: yup.date().required('Дата начала обязательна'),
  endDate: yup
    .date()
    .required('Дата окончания обязательна')
    .min(yup.ref('startDate'), 'Дата окончания должна быть после даты начала'),
});

const teamMemberValidationSchema = yup.object().shape({
  fullName: yup.string().required('ФИО обязательно'),
  position: yup.string().required('Должность обязательна'),
  department: yup.string().required('Подразделение обязательно'),
});

const initialTaskValues = {
  id: generateTaskId(),
  title: '',
  subtitle: '',
  author: '',
  assignee: '',
  estimatedHours: '',
  description: '',
  comments: '',
  watchers: [],
};

const initialSprintValues = {
  name: '',
  goal: '',
  startDate: null,
  endDate: null,
};

const initialTeamMemberValues = {
  fullName: '',
  position: '',
  department: '',
};

const teamMembersOptions = [
  { value: 'ivan', label: 'Иван Иванов' },
  { value: 'petr', label: 'Петр Петров' },
  { value: 'maria', label: 'Мария Сидорова' },
  { value: 'alex', label: 'Алексей Смирнов' },
];

const positionsOptions = [
  { value: 'developer', label: 'Разработчик' },
  { value: 'designer', label: 'Дизайнер' },
  { value: 'qa', label: 'Тестировщик' },
  { value: 'pm', label: 'Менеджер проекта' },
  { value: 'devops', label: 'DevOps инженер' },
];

const departmentsOptions = [
  { value: 'frontend', label: 'Фронтенд' },
  { value: 'backend', label: 'Бэкенд' },
  { value: 'design', label: 'Дизайн' },
  { value: 'qa', label: 'Тестирование' },
  { value: 'devops', label: 'DevOps' },
];

const AdminPanel = () => {
  const [tabValue, setTabValue] = useState(0);
  const [sprintHours] = useState(160); // 20 дней * 8 часов
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, fullName: 'Иван Иванов', position: 'developer', department: 'frontend' },
    { id: 2, fullName: 'Петр Петров', position: 'developer', department: 'backend' },
    { id: 3, fullName: 'Мария Сидорова', position: 'designer', department: 'design' },
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddTeamMember = (values, { resetForm }) => {
    const newMember = {
      id: teamMembers.length + 1,
      ...values,
    };
    setTeamMembers([...teamMembers, newMember]);
    resetForm();
  };

  const handleDeleteTeamMember = (id) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Панель администратора
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Создание задачи" />
          <Tab label="Создание спринта" />
          <Tab label="Управление командой" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Task Creation Form */}
          {tabValue === 0 && (
            <Formik
              initialValues={initialTaskValues}
              validationSchema={taskValidationSchema}
              onSubmit={(values, { resetForm }) => {
                console.log('Task created:', values);
                const taskHours = values.estimatedHours;
                const remainingHours = sprintHours - taskHours;
                
                if (remainingHours < 0) {
                  alert('Недостаточно времени в спринте для этой задачи!');
                  return;
                }
                
                alert(`Задача создана!\nID: ${values.id}\nОстаток времени в спринте: ${formatTime(remainingHours)}`);
                resetForm({ ...initialTaskValues, id: generateTaskId() });
              }}
            >
              {({ values, setFieldValue, errors, touched }) => {
                const formattedTime = formatTime(values.estimatedHours);
                const remainingHours = sprintHours - (values.estimatedHours || 0);
                const showTimeWarning = values.estimatedHours && remainingHours < 0;

                return (
                  <Form>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                          Создание новой задачи
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="ID задачи"
                          value={values.id}
                          disabled
                          helperText="Автоматически сгенерированный ID"
                          margin="normal"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Button
                                  size="small"
                                  onClick={() => setFieldValue('id', generateTaskId())}
                                >
                                  Обновить ID
                                </Button>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <CustomInput
                          name="title"
                          label="Заголовок"
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <CustomInput
                          name="subtitle"
                          label="Подзаголовок"
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <CustomSelect
                          name="author"
                          label="Автор"
                          options={teamMembersOptions}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <CustomSelect
                          name="assignee"
                          label="Исполнитель"
                          options={teamMembersOptions}
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          name="estimatedHours"
                          label="Время выполнения (часы)"
                          type="number"
                          value={values.estimatedHours}
                          onChange={(e) => setFieldValue('estimatedHours', e.target.value)}
                          error={touched.estimatedHours && Boolean(errors.estimatedHours)}
                          helperText={
                            touched.estimatedHours && errors.estimatedHours
                              ? errors.estimatedHours
                              : values.estimatedHours
                                ? `Отформатировано: ${formattedTime}`
                                : 'Например: 6ч или 1д 6ч если более 8 часов'
                          }
                          margin="normal"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          name="description"
                          label="Описание (минимум 40 символов)"
                          value={values.description}
                          onChange={(e) => setFieldValue('description', e.target.value)}
                          error={touched.description && Boolean(errors.description)}
                          helperText={`${values.description.length}/40 символов`}
                          margin="normal"
                          required
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          name="comments"
                          label="Дополнительные комментарии (опционально, минимум 40 символов если указаны)"
                          value={values.comments}
                          onChange={(e) => setFieldValue('comments', e.target.value)}
                          helperText={
                            values.comments
                              ? `${values.comments.length}/40 символов`
                              : 'Необязательное поле'
                          }
                          margin="normal"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Autocomplete
                          multiple
                          options={teamMembersOptions.map(option => option.label)}
                          value={values.watchers}
                          onChange={(event, newValue) => {
                            setFieldValue('watchers', newValue);
                          }}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                label={option}
                                {...getTagProps({ index })}
                                size="small"
                              />
                            ))
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Наблюдатели"
                              placeholder="Выберите наблюдателей"
                              margin="normal"
                            />
                          )}
                        />
                      </Grid>

                      {values.estimatedHours && (
                        <Grid item xs={12}>
                          <Alert
                            severity={showTimeWarning ? "error" : "info"}
                            sx={{ mt: 2 }}
                          >
                            {showTimeWarning
                              ? 'Недостаточно времени в спринте для этой задачи!'
                              : `Если добавить эту задачу, в спринте останется: ${formatTime(remainingHours)}`}
                          </Alert>
                        </Grid>
                      )}

                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                          <Button
                            variant="outlined"
                            onClick={() => setFieldValue('id', generateTaskId())}
                          >
                            Сгенерировать новый ID
                          </Button>
                          <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            disabled={showTimeWarning}
                          >
                            Создать задачу
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          )}

          {/* Sprint Creation Form */}
          {tabValue === 1 && (
            <Formik
              initialValues={initialSprintValues}
              validationSchema={sprintValidationSchema}
              onSubmit={(values, { resetForm }) => {
                console.log('Sprint created:', values);
                const duration = calculateDuration(values.startDate, values.endDate);
                alert(`Спринт "${values.name}" создан успешно!\nДлительность: ${duration} дней`);
                resetForm();
              }}
            >
              {({ values, setFieldValue }) => {
                const duration = calculateDuration(values.startDate, values.endDate);
                const durationText = duration > 0 ? `${duration} дней` : '';

                return (
                  <Form>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                          Создание нового спринта
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <CustomInput
                          name="name"
                          label="Имя спринта"
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <CustomInput
                          name="goal"
                          label="Цель спринта"
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <DatePicker
                          label="Дата начала"
                          value={values.startDate}
                          onChange={(date) => {
                            setFieldValue('startDate', date);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              margin="normal"
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <DatePicker
                          label="Дата окончания"
                          value={values.endDate}
                          onChange={(date) => {
                            setFieldValue('endDate', date);
                          }}
                          minDate={values.startDate}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              margin="normal"
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Длительность (рассчитано)"
                          value={durationText}
                          disabled
                          margin="normal"
                          helperText="Автоматически рассчитывается из дат"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                          <Button
                            type="button"
                            variant="outlined"
                            onClick={() => {
                              const today = new Date();
                              const twoWeeksLater = new Date(today);
                              twoWeeksLater.setDate(today.getDate() + 14);
                              
                              setFieldValue('startDate', today);
                              setFieldValue('endDate', twoWeeksLater);
                            }}
                          >
                            Установить 2 недели
                          </Button>
                          <Button type="submit" variant="contained" color="primary">
                            Создать спринт
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          )}

          {/* Team Management */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Управление командой
              </Typography>

              <Formik
                initialValues={initialTeamMemberValues}
                validationSchema={teamMemberValidationSchema}
                onSubmit={handleAddTeamMember}
              >
                {({ handleSubmit, resetForm }) => (
                  <>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={12} md={4}>
                        <CustomInput
                          name="fullName"
                          label="ФИО"
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <CustomSelect
                          name="position"
                          label="Должность"
                          options={positionsOptions}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <CustomSelect
                          name="department"
                          label="Подразделение"
                          options={departmentsOptions}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          <Button
                            variant="outlined"
                            onClick={() => resetForm()}
                          >
                            Очистить
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSubmit()}
                            startIcon={<AddIcon />}
                          >
                            Добавить участника
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </>
                )}
              </Formik>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ФИО</TableCell>
                      <TableCell>Должность</TableCell>
                      <TableCell>Подразделение</TableCell>
                      <TableCell align="right">Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>{member.fullName}</TableCell>
                        <TableCell>
                          {positionsOptions.find(p => p.value === member.position)?.label || member.position}
                        </TableCell>
                        <TableCell>
                          {departmentsOptions.find(d => d.value === member.department)?.label || member.department}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteTeamMember(member.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {teamMembers.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    Участники команды еще не добавлены
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminPanel;