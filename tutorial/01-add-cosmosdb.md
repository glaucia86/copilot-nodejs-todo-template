# Tutorial Step by Step - Add Cosmos DB

```typescript
// Import CosmosClient SDK and task model

import { CosmosClient } from '@azure/cosmos';
import { Task } from '../models/task';


export class DbService {
  private client: CosmosClient;
  private database: any;
  private container: any;

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
  async createTask(task: Task): Promise<Task> {
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
  async updateTask(task: Task): Promise<Task> {
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
```

Agora vamos entender o que esse código está fazendo:

1. Importamos o CosmosClient SDK e o modelo de tarefa.
2. Criamos uma classe `DbService` que contém métodos para criar, ler, atualizar e excluir tarefas.
3. No construtor, verificamos se as variáveis de ambiente `COSMOS_ENDPOINT` e `COSMOS_KEY` estão definidas. Se não estiverem, lançamos um erro.
4. Criamos uma instância do `CosmosClient` com as credenciais fornecidas.
5. Obtemos uma referência para o banco de dados `todos` e o contêiner `tasks`.
6. Implementamos os métodos `createTask`, `getTask`, `getTasks`, `updateTask` e `deleteTask` para interagir com o Cosmos DB.

Agora vamos entender o método `database` do `CosmosClient`:


É usado para ler, atualizar ou excluir um banco de dados existente por id ou acessar contêineres pertencentes a esse banco de dados.

