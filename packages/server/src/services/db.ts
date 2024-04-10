// Import CosmosClient SDK and task model

import { Container,
    CosmosClient,
    Database } from '@azure/cosmos';
import { Task } from '../models/task';


export class DbService {
  private client: CosmosClient;
  private database: Database;
  private container: Container;

  // Create a singleton instance
  private static instance: DbService;

  public static getInstance(): DbService {
    if (!DbService.instance) {
      DbService.instance = new DbService();
    }

    return DbService.instance;
  }

  constructor() {

    // Check if the required environment variables are set
    if (!process.env.COSMOS_ENDPOINT || !process.env.COSMOS_KEY) {
      throw new Error('Missing required environment variables COSMOS_ENDPOINT and/or COSMOS_KEY');
    }

    this.client = new CosmosClient({
      endpoint: process.env.COSMOS_ENDPOINT || '',
      key: process.env.COSMOS_KEY || ''
    });

    this.database = this.client.database('todos');
    this.container = this.database.container('tasks');
  }

  // Create a new task
  async createTask(task: Task): Promise<Task | undefined> {
    const { resource: createdItem } = await this.container
      .items
      .create(task);

    return createdItem;
  }

  // Get a task by id
  async getTask(id: string): Promise<Task> {
    const { resource: task } = await this.container
      .item(id)
      .read();

    return task;
  }

  // Get all tasks for a user
  async getTasks(userId: string): Promise<Task[]> {
    const { resources: tasks } = await this.container
      .items.query({
        query: 'SELECT * FROM c WHERE c.userId = @userId',
        parameters: [{ name: '@userId', value: userId }]
      })
      .fetchAll();

    return tasks;
  }

  // Update a task
  async updateTask(task: Task): Promise<Task | undefined> {
    const { resource: updatedItem } = await this.container
      .item(task.id)
      .replace(task);

    return updatedItem;
  }

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    await this.container
      .item(id)
      .delete();
  }
}


