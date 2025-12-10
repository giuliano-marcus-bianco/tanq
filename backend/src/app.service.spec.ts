import { describe, it, expect, beforeEach } from 'vitest';
import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(() => {
    appService = new AppService();
  });

  describe('getHello', () => {
    it('should return message and version', () => {
      const result = appService.getHello();
      expect(result.message).toBe('Bem-vindo à API do Tanq! ⛽');
      expect(result.version).toBe('1.0.0');
    });
  });

  describe('healthCheck', () => {
    it('should return ok status with timestamp', () => {
      const result = appService.healthCheck();
      expect(result.status).toBe('ok');
      expect(new Date(result.timestamp)).toBeInstanceOf(Date);
    });
  });
});
