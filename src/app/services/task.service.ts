import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { TaskFilter, TTask } from "../dtos/task.dtos";
import { TAssignTask } from "../dtos/task_assign.dto";
import { Repository } from "../repositories/helper.repository";
import { ProviderRepository } from "../repositories/provider.repository";
import { TaskRepository } from "../repositories/task.repository";
import { TaskAssignedRepository } from "../repositories/task_assigned.repository";
import { UserRepository } from "../repositories/user.repository";
import { AppError } from "../utils/serverTools/AppError";
import { schema } from "../db";

export interface TaskStatusUpdate {
  task_assign_id: string;
  task_id: string;
  task_status: "ignored" | "completed";
}

const addTask = async (user_id: string, task_data: TTask) => {
  const { assign_to, ...rest } = task_data;
  return await Repository.transaction(async (tx) => {
    const new_data = await TaskRepository.addTask(
      {
        created_by: user_id,
        ...rest,
        initial_date: new Date(task_data.initial_date),
      },
      tx
    );

    let assigned_data;
    if (assign_to) {
      assigned_data = await assignMember(
        { assign_to, task_id: new_data.id },
        tx
      );
    }
    return { task: new_data, assigned_data };
  });
};

const assignMember = async (
  data: TAssignTask,
  tx?: NodePgDatabase<typeof schema>
) => {
  const [provider, user] = await Promise.all([
    ProviderRepository.getProviderById(data.assign_to),
    UserRepository.findById(data.assign_to),
  ]);

  if (!provider && !user) {
    throw new AppError("No User found to assign");
  }

  const task_data = await TaskRepository.getTaskById(data.task_id, tx);
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

  const task_assign_data = await TaskAssignedRepository.getLatestTaskAssingInfo(
    data.task_id
  );

  if (task_assign_data) {
    if (task_data.recurrence_type === "none") {
      if (task_assign_data.status == "completed") {
        throw new AppError("Task already completed.");
      } else {
        return await TaskAssignedRepository.changeMember(
          task_assign_data.id,
          {
            assign_to: data.assign_to,
            user_type: type,
          },
          tx
        );
      }
    } else {
      return await TaskAssignedRepository.changeMember(
        task_assign_data.id,
        {
          assign_to: data.assign_to,
          user_type: type,
        },
        tx
      );
    }
  } else {
    return await TaskAssignedRepository.assignMember(
      {
        ...data,
        date: task_data.initial_date,
        user_type: type,
      },
      tx
    );
  }
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
    task_data:task_data,
    last_service_by:last_service_by,
    present_assign_to:present_assign_to,
  };
};

const getTaskNotification = async (user_id: string) => {
  const data = await TaskAssignedRepository.getTaskNotification(user_id);
  return data;
};

const update_task_status = async (data: TaskStatusUpdate) => {
  const task_data = await TaskRepository.getTaskById(data.task_id);

  if (!task_data) {
    throw new AppError("Task data not found.", 404);
  }

  const pre_date = task_data.initial_date;
  let new_date: Date;

  switch (task_data.recurrence_type) {
    case "annually":
      new_date = new Date(pre_date);
      new_date.setFullYear(pre_date.getFullYear() + 1);
      break;

    case "quarterly":
      new_date = new Date(pre_date);
      new_date.setMonth(pre_date.getMonth() + 3);
      break;

    case "monthly":
      new_date = new Date(pre_date);
      new_date.setMonth(pre_date.getMonth() + 1);
      break;

    case "weekly":
      new_date = new Date(pre_date);
      new_date.setDate(pre_date.getDate() + 7);
      break;

    default:
      new_date = pre_date; // fallback (no change)
  }

  if (task_data.recurrence_type === "none") {
    const updated = await TaskAssignedRepository.update_task_status(
      data.task_assign_id,
      data.task_status
    );
    return updated;
  } else {
    return await Repository.transaction(async (tx) => {
      const updated = await TaskAssignedRepository.update_task_status(
        data.task_assign_id,
        data.task_status
      );

      const t_id = updated.task_id;
      const assign_to = updated.assign_to;

      await TaskAssignedRepository.assignMember({
        assign_to,
        task_id: t_id,
        user_type: updated.user_type,
        date: new_date,
      });

      return updated;
    });
  }
};

export const TaskService = {
  addTask,
  assignMember,
  usersTask,
  taskDetails,
  getTaskNotification,
  update_task_status,
};
