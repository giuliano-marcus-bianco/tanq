import { describe, it, expect, beforeEach } from 'vitest';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(() => {
    appService = new AppService();
    appController = new AppController(appService);
  });

  describe('getHello', () => {
    it('should return welcome message', () => {
      const result = appController.getHello();
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('version');
      expect(result.message).toContain('Tanq');
    });
  });

  describe('healthCheck', () => {
    it('should return ok status', () => {
      const result = appController.healthCheck();
      expect(result.status).toBe('ok');
      expect(result.timestamp).toBeDefined();
    });
  });
});
