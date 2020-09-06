import { Test, TestingModule } from '@nestjs/testing';
import { ProjectAccessController } from './project-access.controller';

describe('ProjectAccess Controller', () => {
  let controller: ProjectAccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectAccessController],
    }).compile();

    controller = module.get<ProjectAccessController>(ProjectAccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
