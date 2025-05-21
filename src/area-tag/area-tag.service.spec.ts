import { Test, TestingModule } from '@nestjs/testing';
import { AreaTagService } from './area-tag.service';

describe('AreaTagService', () => {
  let service: AreaTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AreaTagService],
    }).compile();

    service = module.get<AreaTagService>(AreaTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
