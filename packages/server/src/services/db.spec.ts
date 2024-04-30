import { DbService } from "./db";

// Define mockDelete outside to make it accessible
const mockDelete = jest.fn().mockResolvedValue({});

jest.mock('@azure/cosmos', () => {
  return {
    CosmosClient: jest.fn().mockImplementation(() => {
      return {
        database: jest.fn().mockReturnValue({
          container: jest.fn().mockReturnValue({
            items: {
              create: jest.fn().mockResolvedValue({
                resource: {
                  id: '123',
                  userId: '123',
                  title: 'Test task',
                  completed: false
                }
              }),
              query: jest.fn().mockReturnValue({
                fetchAll: jest.fn().mockResolvedValue({ resources: [] })
              })
            },

            item: jest.fn().mockReturnValue({
              read: jest.fn().mockResolvedValue({
                resource: {
                  id: '123',
                  userId: '123',
                  title: 'Test task',
                  completed: false
                }
              }),

              replace: jest.fn().mockResolvedValue({
                resource: {
                  id: '123',
                  userId: '123',
                  title: 'Updated task',
                  completed: true
                }
              }),
              
              delete: mockDelete  // Now correctly using the externally defined mock
            })
          })
        })
      };
    })
  };
});

describe('DbService', () => {
  beforeAll(() => {
    process.env.COSMOS_ENDPOINT = 'dummy';
    process.env.COSMOS_KEY = '123';
  });

  it('should get all tasks for a user', async () => {
    const dbService = new DbService();
    const tasks = await dbService.getTasks('123');
    expect(tasks).toEqual([]);
  });

  it('should create a new task', async () => {
    const dbService = new DbService();
    const task = await dbService.createTask({
      id: '123',
      userId: '123',
      title: 'Test task',
      completed: false
    });
    expect(task).toEqual({
      id: '123',
      userId: '123',
      title: 'Test task',
      completed: false
    });
  });

  it('should get a task by id', async () => {
    const dbService = new DbService();
    const task = await dbService.getTask('123');
    expect(task).toEqual({
      id: '123',
      userId: '123',
      title: 'Test task',
      completed: false
    });
  });

  it('should update a task', async () => {
    const dbService = new DbService();
    const task = await dbService.updateTask({
      id: '123',
      userId: '123',
      title: 'Updated task',
      completed: true
    });
    expect(task).toEqual({
      id: '123',
      userId: '123',
      title: 'Updated task',
      completed: true
    });
  });

  it('should delete a task', async () => {
    const dbService = new DbService();
    await dbService.deleteTask('123');
    expect(mockDelete).toHaveBeenCalledTimes(1);  // Now checking the direct mock
  });

}); // Added the missing closing brace here
