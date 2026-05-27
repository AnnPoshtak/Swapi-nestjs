import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { AppService } from './app.service';

describe('AppService (Unit)', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  it('should return "Hello World!"', () => {
    expect(service.getHello()).toBe('Hello World!');
  });
});