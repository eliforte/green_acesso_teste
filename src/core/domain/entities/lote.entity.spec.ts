import { LoteEntity } from './lote.entity';

describe('LoteEntity', () => {
  describe('constructor', () => {
    it('should create a valid lote entity with all properties', () => {
      const lote = new LoteEntity({
        id: 1,
        nome: '0017',
        ativo: true,
        criado_em: new Date('2023-01-01'),
      });

      expect(lote.id).toBe(1);
      expect(lote.nome).toBe('0017');
      expect(lote.ativo).toBe(true);
      expect(lote.criado_em).toEqual(new Date('2023-01-01'));
    });

    it('should create a valid lote entity with default values', () => {
      const lote = new LoteEntity({
        nome: '0018',
      });

      expect(lote.id).toBeUndefined();
      expect(lote.nome).toBe('0018');
      expect(lote.ativo).toBe(true);
      expect(lote.criado_em).toBeInstanceOf(Date);
    });
  });

  describe('validation', () => {
    it('should throw error when nome is empty', () => {
      expect(() => {
        new LoteEntity({
          nome: '',
        });
      }).toThrow('Nome do lote não pode ser vazio');
    });

    it('should throw error when setting empty nome', () => {
      const lote = new LoteEntity({
        nome: '0019',
      });

      expect(() => {
        lote.nome = '';
      }).toThrow('Nome do lote não pode ser vazio');
    });
  });

  describe('formatarNome', () => {
    it('should pad nome with zeros to reach length of 4', () => {
      const lote1 = new LoteEntity({ nome: '17' });
      const lote2 = new LoteEntity({ nome: '123' });
      const lote3 = new LoteEntity({ nome: '1234' });

      expect(lote1.formatarNome()).toBe('0017');
      expect(lote2.formatarNome()).toBe('0123');
      expect(lote3.formatarNome()).toBe('1234');
    });
  });
});