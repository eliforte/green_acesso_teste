import { BoletoEntity } from './boleto.entity';

describe('BoletoEntity', () => {
  it('should create a valid boleto entity', () => {
    const boleto = new BoletoEntity({
      nome_sacado: 'João Silva',
      id_lote: 1,
      valor: 100.50,
      linha_digitavel: '12345678901234567890'
    });

    expect(boleto).toBeDefined();
    expect(boleto.nome_sacado).toBe('João Silva');
    expect(boleto.id_lote).toBe(1);
    expect(boleto.valor).toBe(100.50);
    expect(boleto.linha_digitavel).toBe('12345678901234567890');
    expect(boleto.ativo).toBe(true);
    expect(boleto.criado_em).toBeInstanceOf(Date);
  });

  it('should create a boleto with all properties', () => {
    const date = new Date('2023-01-01');
    const boleto = new BoletoEntity({
      id: 123,
      nome_sacado: 'Maria Oliveira',
      id_lote: 2,
      valor: 200.75,
      linha_digitavel: '09876543210987654321',
      ativo: false,
      criado_em: date
    });

    expect(boleto.id).toBe(123);
    expect(boleto.nome_sacado).toBe('Maria Oliveira');
    expect(boleto.id_lote).toBe(2);
    expect(boleto.valor).toBe(200.75);
    expect(boleto.linha_digitavel).toBe('09876543210987654321');
    expect(boleto.ativo).toBe(false);
    expect(boleto.criado_em).toBe(date);
  });

  it('should throw error when nome_sacado is empty', () => {
    expect(() => {
      new BoletoEntity({
        nome_sacado: '',
        id_lote: 3,
        valor: 182.54,
        linha_digitavel: '123456123456123456'
      });
    }).toThrow('Nome do sacado não pode ser vazio');

    expect(() => {
      new BoletoEntity({
        nome_sacado: '   ',
        id_lote: 3,
        valor: 182.54,
        linha_digitavel: '123456123456123456'
      });
    }).toThrow('Nome do sacado não pode ser vazio');
  });

  it('should throw error when valor is less than or equal to zero', () => {
    expect(() => {
      new BoletoEntity({
        nome_sacado: 'José Santos',
        id_lote: 3,
        valor: 0,
        linha_digitavel: '12345678901234567890'
      });
    }).toThrow('Valor do boleto deve ser maior que zero');

    expect(() => {
      new BoletoEntity({
        nome_sacado: 'José Santos',
        id_lote: 3,
        valor: -10,
        linha_digitavel: '12345678901234567890'
      });
    }).toThrow('Valor do boleto deve ser maior que zero');
  });

  it('should throw error when id_lote is less than or equal to zero', () => {
    expect(() => {
      new BoletoEntity({
        nome_sacado: 'Ana Paula',
        id_lote: 0,
        valor: 150,
        linha_digitavel: '12345678901234567890'
      });
    }).toThrow('ID do lote deve ser maior que zero');

    expect(() => {
      new BoletoEntity({
        nome_sacado: 'Ana Paula',
        id_lote: -5,
        valor: 150,
        linha_digitavel: '12345678901234567890'
      });
    }).toThrow('ID do lote deve ser maior que zero');
  });

  it('should throw error when linha_digitavel is empty', () => {
    expect(() => {
      new BoletoEntity({
        nome_sacado: 'Pedro Costa',
        id_lote: 4,
        valor: 300,
        linha_digitavel: ''
      });
    }).toThrow('Linha digitável não pode ser vazia');

    expect(() => {
      new BoletoEntity({
        nome_sacado: 'Pedro Costa',
        id_lote: 4,
        valor: 300,
        linha_digitavel: '   '
      });
    }).toThrow('Linha digitável não pode ser vazia');
  });

  it('should update properties correctly', () => {
    const boleto = new BoletoEntity({
      nome_sacado: 'Carlos Pereira',
      id_lote: 5,
      valor: 250,
      linha_digitavel: '12345678901234567890'
    });

    boleto.nome_sacado = 'Carlos Pereira Silva';
    boleto.valor = 300;
    boleto.id_lote = 6;
    boleto.linha_digitavel = '09876543210987654321';

    expect(boleto.nome_sacado).toBe('Carlos Pereira Silva');
    expect(boleto.valor).toBe(300);
    expect(boleto.id_lote).toBe(6);
    expect(boleto.linha_digitavel).toBe('09876543210987654321');
  });

  it('should throw error when updating nome_sacado to empty string', () => {
    const boleto = new BoletoEntity({
      nome_sacado: 'Marcos Oliveira',
      id_lote: 7,
      valor: 175.50,
      linha_digitavel: '12345678901234567890'
    });

    expect(() => {
      boleto.nome_sacado = '';
    }).toThrow('Nome do sacado não pode ser vazio');

    expect(() => {
      boleto.nome_sacado = '   ';
    }).toThrow('Nome do sacado não pode ser vazio');
  });

  it('should validate boleto correctly', () => {
    const boleto = new BoletoEntity({
      nome_sacado: 'Julia Santos',
      id_lote: 8,
      valor: 425.75,
      linha_digitavel: '12345678901234567890'
    });

    expect((boleto as any).validarBoleto()).toBe(true);
  });
});