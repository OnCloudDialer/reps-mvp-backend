import { Test, TestingModule } from '@nestjs/testing';
import { AreaTagController } from './area-tag.controller';

describe('AreaTagController', () => {
  let controller: AreaTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AreaTagController],
    }).compile();

    controller = module.get<AreaTagController>(AreaTagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
