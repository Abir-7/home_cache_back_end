import { TaskFilter, TTask } from "../dtos/task.dtos";
import { TAssignTask } from "../dtos/task_assign.dto";
import { ProviderRepository } from "../repositories/provider.repository";
import { TaskRepository } from "../repositories/task.repository";
import { TaskAssignedRepository } from "../repositories/task_assigned.repository";
import { UserRepository } from "../repositories/user.repository";
import { AppError } from "../utils/serverTools/AppError";

const addTask = async (user_id: string, task_data: TTask) => {
  const new_data = await TaskRepository.addTask({
    created_by: user_id,
    ...task_data,
    initial_date: new Date(task_data.initial_date),
  });

  return new_data;
};

const assignMember = async (data: TAssignTask) => {
  const [provider, user] = await Promise.all([
    ProviderRepository.getProviderById(data.assign_to),
    UserRepository.findById(data.assign_to),
  ]);

  if (!provider && !user) {
    throw new AppError("No User found to assign");
  }

  const task_data = await TaskRepository.getTaskById(data.task_id);
  if (!task_data) {
    throw new AppError("Task not found.");
  }

  let type: "user" | "provider" | undefined;

  if (user?.id) {
    type = "user";
  } else if (provider?.id) {
    type = "provider";
  }

  if (!type) {
    throw new AppError("No user or provider found to assign");
  }
  return await TaskAssignedRepository.assignMember({
    ...data,
    date: task_data.initial_date,
    user_type: type,
  });
};

const usersTask = async (user_id: string, task_time: TaskFilter) => {
  return await TaskRepository.getUserTasks(user_id, task_time);
};

const taskDetails = async (task_id: string) => {
  const [task_data, last_service_by, present_assign_to] = await Promise.all([
    TaskRepository.getTaskById(task_id),
    TaskAssignedRepository.lastCompletedServiceWithProfile(task_id),
    TaskAssignedRepository.latestTaskUserDetails(task_id),
  ]);

  return {
    task_data,
    last_service_by,
    present_assign_to,
  };
};
const getTaskNotification = async (user_id: string) => {
  const data = await TaskAssignedRepository.getTaskNotification(user_id);
  return data;
};
export const TaskService = {
  addTask,
  assignMember,
  usersTask,
  taskDetails,
  getTaskNotification,
};
