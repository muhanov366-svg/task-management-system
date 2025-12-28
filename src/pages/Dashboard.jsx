import React, { useState } from 'react';
import {
  Paper,
  Tabs,
  Tab,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedUser, setSelectedUser] = useState('all');
  const [showOnlyMyIssues, setShowOnlyMyIssues] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const completedTasks = [
    { id: 'AB-1234', title: 'Исправить баг авторизации', assignee: 'Иван Иванов', timeSpent: '2д 4ч', status: 'Выполнено' },
    { id: 'CD-5678', title: 'Добавить темную тему', assignee: 'Петр Петров', timeSpent: '3д', status: 'Выполнено' },
    { id: 'EF-9012', title: 'Обновить документацию API', assignee: 'Мария Сидорова', timeSpent: '1д 6ч', status: 'Выполнено' },
  ];

  const backlogItems = [
    { id: 'GH-3456', title: 'Реализовать поиск', priority: 'Высокий', estimate: '5д' },
    { id: 'IJ-7890', title: 'Рефакторинг модуля авторизации', priority: 'Средний', estimate: '3д' },
    { id: 'KL-1234', title: 'Добавить unit-тесты', priority: 'Низкий', estimate: '2д' },
  ];

  const sprintStats = {
    totalTasks: 24,
    completed: 18,
    inProgress: 4,
    remaining: 2,
    daysLeft: 3,
    velocity: 85,
  };

  const chartData = {
    labels: ['Неделя 1', 'Неделя 2', 'Неделя 3', 'Неделя 4'],
    datasets: [
      {
        label: 'Выполнено задач',
        data: [8, 12, 15, 18],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Запланировано',
        data: [10, 15, 20, 24],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Прогресс спринта',
      },
    },
  };

  const teamMembers = [
    { id: 'all', name: 'Вся команда' },
    { id: 'ivan', name: 'Иван Иванов' },
    { id: 'petr', name: 'Петр Петров' },
    { id: 'maria', name: 'Мария Сидорова' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Рабочий стол
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Выберите пользователя</InputLabel>
              <Select
                value={selectedUser}
                label="Выберите пользователя"
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                {teamMembers.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={showOnlyMyIssues}
                  onChange={(e) => setShowOnlyMyIssues(e.target.checked)}
                />
              }
              label="Только мои задачи"
            />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Статистика спринта
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" variant="body2">
                      Всего задач
                    </Typography>
                    <Typography variant="h5">{sprintStats.totalTasks}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" variant="body2">
                      Выполнено
                    </Typography>
                    <Typography variant="h5">{sprintStats.completed}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" variant="body2">
                      В работе
                    </Typography>
                    <Typography variant="h5">{sprintStats.inProgress}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" variant="body2">
                      Осталось дней
                    </Typography>
                    <Typography variant="h5">{sprintStats.daysLeft}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Product Backlog" />
              <Tab label="Статистика" />
            </Tabs>
            
            <Box sx={{ p: 2 }}>
              {tabValue === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Product Backlog
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Название</TableCell>
                          <TableCell>Приоритет</TableCell>
                          <TableCell>Оценка</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {backlogItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>
                              <Chip
                                label={item.priority}
                                size="small"
                                color={
                                  item.priority === 'Высокий' ? 'error' :
                                  item.priority === 'Средний' ? 'warning' : 'success'
                                }
                              />
                            </TableCell>
                            <TableCell>{item.estimate}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
              
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    График прогресса
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Line data={chartData} options={chartOptions} />
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Недавно выполненные задачи
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Название</TableCell>
                    <TableCell>Исполнитель</TableCell>
                    <TableCell>Время</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {completedTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.id}</TableCell>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.assignee}</TableCell>
                      <TableCell>{task.timeSpent}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Эффективность команды
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {teamMembers.slice(1).map((member) => (
                <Box key={member.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>{member.name}</Typography>
                  <Chip 
                    label="85%" 
                    size="small" 
                    color="success" 
                    variant="outlined"
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;