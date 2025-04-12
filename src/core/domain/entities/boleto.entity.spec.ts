import { BoletoEntity } from './boleto.entity';

describe('BoletoEntity', () => {
  describe('constructor', () => {
    it('should create a valid boleto entity with all properties', () => {
      const boleto = new BoletoEntity({
        id: 1,
        nome_sacado: 'JOSE DA SILVA',
        id_lote: 3,
        valor: 182.54,
        linha_digitavel: '123456123456123456',
        ativo: true,
        criado_em: new Date('2023-01-01'),
      });

      expect(boleto.id).toBe(1);
      expect(boleto.nome_sacado).toBe('JOSE DA SILVA');
      expect(boleto.id_lote).toBe(3);
      expect(boleto.valor).toBe(182.54);
      expect(boleto.linha_digitavel).toBe('123456123456123456');
      expect(boleto.ativo).toBe(true);
      expect(boleto.criado_em).toEqual(new Date('2023-01-01'));
    });

    it('should create a valid boleto entity with default values', () => {
      const boleto = new BoletoEntity({
        nome_sacado: 'JOSE DA SILVA',
        id_lote: 3,
        valor: 182.54,
        linha_digitavel: '123456123456123456',
      });

      expect(boleto.id).toBeUndefined();
      expect(boleto.nome_sacado).toBe('JOSE DA SILVA');
      expect(boleto.id_lote).toBe(3);
      expect(boleto.valor).toBe(182.54);
      expect(boleto.linha_digitavel).toBe('123456123456123456');
      expect(boleto.ativo).toBe(true);
      expect(boleto.criado_em).toBeInstanceOf(Date);
    });
  });

  describe('validation', () => {
    it('should throw error when nome_sacado is empty', () => {
      expect(() => {
        new BoletoEntity({
          nome_sacado: '',
          id_lote: 3,
          valor: 182.54,
          linha_digitavel: '123456123456123456',
        });
      }).toThrow('Nome do sacado não pode ser vazio');
    });

    it('should throw error when id_lote is invalid', () => {
      expect(() => {
        new BoletoEntity({
          nome_sacado: 'JOSE DA SILVA',
          id_lote: 0,
          valor: 182.54,
          linha_digitavel: '123456123456123456',
        });
      }).toThrow('ID do lote deve ser válido');
    });

    it('should throw error when valor is <= 0', () => {
      expect(() => {
        new BoletoEntity({
          nome_sacado: 'JOSE DA SILVA',
          id_lote: 3,
          valor: 0, // Invalid value
          linha_digitavel: '123456123456123456',
        });
      }).toThrow('Valor do boleto deve ser maior que zero');
    });

    it('should throw error when linha_digitavel is empty', () => {
      expect(() => {
        new BoletoEntity({
          nome_sacado: 'JOSE DA SILVA',
          id_lote: 3,
          valor: 182.54,
          linha_digitavel: '',
        });
      }).toThrow('Linha digitável não pode ser vazia');
    });
  });

  describe('setters', () => {
    let boleto: BoletoEntity;

    beforeEach(() => {
      boleto = new BoletoEntity({
        nome_sacado: 'JOSE DA SILVA',
        id_lote: 3,
        valor: 182.54,
        linha_digitavel: '123456123456123456',
      });
    });

    it('should update nome_sacado', () => {
      boleto.nome_sacado = 'MARCOS ROBERTO';
      expect(boleto.nome_sacado).toBe('MARCOS ROBERTO');
    });

    it('should update id_lote', () => {
      boleto.id_lote = 6;
      expect(boleto.id_lote).toBe(6);
    });

    it('should update valor', () => {
      boleto.valor = 200;
      expect(boleto.valor).toBe(200);
    });

    it('should update linha_digitavel', () => {
      boleto.linha_digitavel = '987654321987654321';
      expect(boleto.linha_digitavel).toBe('987654321987654321');
    });

    it('should update ativo', () => {
      boleto.ativo = false;
      expect(boleto.ativo).toBe(false);
    });
  });
});