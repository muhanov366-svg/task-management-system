import React, { useState } from 'react';
import {
  Paper,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import FilterListIcon from '@mui/icons-material/FilterList';

const initialTasks = {
  todo: [
    { 
      id: 'AB-1234', 
      title: 'Исправить выравнивание заголовка', 
      description: 'Элементы заголовка перекрываются на экранах меньше 768px',
      assignee: 'Иван Иванов', 
      priority: 'high',
      estimate: '6ч',
      tags: ['frontend', 'баг']
    },
    { 
      id: 'CD-5678', 
      title: 'Обновить документацию API', 
      description: 'Добавить новые endpoints в документацию API',
      assignee: 'Петр Петров', 
      priority: 'medium',
      estimate: '1д',
      tags: ['документация']
    },
  ],
  inProgress: [
    { 
      id: 'EF-9012', 
      title: 'Реализовать расширенный поиск', 
      description: 'Добавить фильтры и опции сортировки в функционал поиска',
      assignee: 'Иван Иванов', 
      priority: 'high',
      estimate: '2д 4ч',
      tags: ['frontend', 'фича']
    },
  ],
  review: [
    { 
      id: 'GH-3456', 
      title: 'Рефакторинг модуля аутентификации', 
      description: 'Улучшить безопасность и производительность системы авторизации',
      assignee: 'Мария Сидорова', 
      priority: 'low',
      estimate: '3д',
      tags: ['backend', 'рефакторинг']
    },
  ],
  done: [
    { 
      id: 'IJ-7890', 
      title: 'Добавить переключатель темной темы', 
      description: 'Реализовать функционал переключения тем',
      assignee: 'Иван Иванов', 
      priority: 'medium',
      estimate: '1д 6ч',
      tags: ['frontend', 'фича']
    },
  ],
};

const teamMembers = [
  { id: 'all', name: 'Все участники' },
  { id: 'ivan', name: 'Иван Иванов', avatar: 'ИИ' },
  { id: 'petr', name: 'Петр Петров', avatar: 'ПП' },
  { id: 'maria', name: 'Мария Сидорова', avatar: 'МС' },
];

const ActiveSprint = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [filterAssignee, setFilterAssignee] = useState('all');

  const columns = [
    { id: 'todo', title: 'К выполнению', color: '#e3f2fd', count: initialTasks.todo.length },
    { id: 'inProgress', title: 'В работе', color: '#fff3e0', count: initialTasks.inProgress.length },
    { id: 'review', title: 'На проверке', color: '#f3e5f5', count: initialTasks.review.length },
    { id: 'done', title: 'Выполнено', color: '#e8f5e9', count: initialTasks.done.length },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff5252';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return priority;
    }
  };

  const filteredTasks = {
    todo: tasks.todo.filter(task => filterAssignee === 'all' || task.assignee.includes(filterAssignee === 'ivan' ? 'Иван' : filterAssignee === 'petr' ? 'Петр' : 'Мария')),
    inProgress: tasks.inProgress.filter(task => filterAssignee === 'all' || task.assignee.includes(filterAssignee === 'ivan' ? 'Иван' : filterAssignee === 'petr' ? 'Петр' : 'Мария')),
    review: tasks.review.filter(task => filterAssignee === 'all' || task.assignee.includes(filterAssignee === 'ivan' ? 'Иван' : filterAssignee === 'petr' ? 'Петр' : 'Мария')),
    done: tasks.done.filter(task => filterAssignee === 'all' || task.assignee.includes(filterAssignee === 'ivan' ? 'Иван' : filterAssignee === 'petr' ? 'Петр' : 'Мария')),
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">Активный спринт</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FilterListIcon />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Фильтр по исполнителю</InputLabel>
            <Select
              value={filterAssignee}
              label="Фильтр по исполнителю"
              onChange={(e) => setFilterAssignee(e.target.value)}
            >
              {teamMembers.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {member.id !== 'all' && (
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {member.avatar}
                      </Avatar>
                    )}
                    {member.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {columns.map((column) => (
          <Grid item xs={12} md={3} key={column.id}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: column.color,
                minHeight: '70vh',
                border: `1px solid ${column.color}`,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {column.title}
                </Typography>
                <Chip 
                  label={filteredTasks[column.id].length} 
                  size="small" 
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredTasks[column.id].map((task) => (
                  <Card 
                    key={task.id}
                    sx={{
                      cursor: 'move',
                      '&:hover': {
                        boxShadow: 3,
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s',
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="body2" color="textSecondary" sx={{ fontFamily: 'monospace' }}>
                          {task.id}
                        </Typography>
                        <IconButton size="small" sx={{ cursor: 'grab' }}>
                          <DragIndicatorIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                        {task.title}
                      </Typography>
                      
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        {task.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        {task.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          label={getPriorityLabel(task.priority)}
                          size="small"
                          sx={{
                            backgroundColor: getPriorityColor(task.priority),
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={task.estimate}
                            size="small"
                            variant="outlined"
                          />
                          <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem' }}>
                            {task.assignee.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredTasks[column.id].length === 0 && (
                  <Box
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      border: '2px dashed #ccc',
                      borderRadius: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      Нет задач {filterAssignee !== 'all' ? `для ${teamMembers.find(m => m.id === filterAssignee)?.name}` : ''}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography variant="body2" color="textSecondary">
          Всего задач в спринте: {Object.values(tasks).flat().length} 
          {filterAssignee !== 'all' && ` • Отфильтровано: ${Object.values(filteredTasks).flat().length} задач`}
        </Typography>
      </Box>
    </Box>
  );
};

export default ActiveSprint;