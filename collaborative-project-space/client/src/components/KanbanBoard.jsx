import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getTasks, updateTask, createTask } from '../services/api';
import io from 'socket.io-client';
import { Plus, MoreHorizontal } from 'lucide-react';
import './KanbanBoard.css';

const socket = io('http://localhost:5000');

const KanbanBoard = ({ projectId }) => {
    const [tasks, setTasks] = useState([]);
    const [columns, setColumns] = useState({
        'todo': { id: 'todo', title: 'To Do', taskIds: [] },
        'in-progress': { id: 'in-progress', title: 'In Progress', taskIds: [] },
        'done': { id: 'done', title: 'Done', taskIds: [] },
    });

    useEffect(() => {
        fetchTasks();

        socket.emit('join_project', projectId);

        socket.on('task_updated', (updatedTask) => {
            // Simple strategy: re-fetch or update local state
            // For now, let's re-fetch to ensure consistency
            fetchTasks();
        });

        return () => {
            socket.off('task_updated');
        };
    }, [projectId]);

    const fetchTasks = async () => {
        try {
            const data = await getTasks(projectId);
            setTasks(data);
            organizeTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const organizeTasks = (taskList) => {
        const newColumns = {
            'todo': { id: 'todo', title: 'To Do', taskIds: [] },
            'in-progress': { id: 'in-progress', title: 'In Progress', taskIds: [] },
            'done': { id: 'done', title: 'Done', taskIds: [] },
        };

        taskList.forEach(task => {
            if (newColumns[task.status]) {
                newColumns[task.status].taskIds.push(task._id);
            }
        });

        setColumns(newColumns);
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const start = columns[source.droppableId];
        const finish = columns[destination.droppableId];

        // Optimistic update
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...start,
            taskIds: startTaskIds,
        };

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds,
        };

        const newColumns = {
            ...columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish,
        };

        setColumns(newColumns);

        // API Call
        try {
            const task = tasks.find(t => t._id === draggableId);
            if (task && task.status !== destination.droppableId) {
                await updateTask(draggableId, { status: destination.droppableId });
                socket.emit('task_updated', { projectId, taskId: draggableId });
            }
        } catch (error) {
            console.error("Failed to update task", error);
            fetchTasks(); // Revert on error
        }
    };

    const handleCreateTask = async (status) => {
        const title = prompt("Enter task title:");
        if (!title) return;

        try {
            const newTask = await createTask({
                title,
                status,
                projectId,
                priority: 'medium'
            });
            socket.emit('task_updated', { projectId, taskId: newTask._id });
            fetchTasks(); // Refresh
        } catch (error) {
            console.error("Error creating task", error);
        }
    };

    return (
        <div className="kanban-board">
            <DragDropContext onDragEnd={onDragEnd}>
                {Object.values(columns).map((column) => {
                    const columnTasks = column.taskIds.map(taskId => tasks.find(t => t._id === taskId)).filter(Boolean);

                    return (
                        <div key={column.id} className="column">
                            <div className="column-header">
                                <h3>{column.title}</h3>
                                <span className="count">{columnTasks.length}</span>
                            </div>
                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {columnTasks.map((task, index) => (
                                            <Draggable key={task._id} draggableId={task._id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <div className="task-content">
                                                            <h4>{task.title}</h4>
                                                            {task.priority && <span className={`priority ${task.priority}`}>{task.priority}</span>}
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                            <button className="add-task-btn" onClick={() => handleCreateTask(column.id)}>
                                <Plus size={16} /> Add Task
                            </button>
                        </div>
                    );
                })}
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
