class BoletoEntity {
  public readonly id?: number;
  private _nome_sacado: string;
  private _valor: number;
  protected _id_lote: number;
  private _linha_digitavel: string;
  public ativo: boolean;
  public criado_em: Date;

  constructor(props: {
    id?: number;
    nome_sacado: string;
    id_lote: number;
    valor: number;
    linha_digitavel: string;
    ativo?: boolean;
    criado_em?: Date;
  }) {
    this.id = props.id;
    this.nome_sacado = props.nome_sacado;
    this.valor = props.valor;
    this.linha_digitavel = props.linha_digitavel;
    this.id_lote = props.id_lote;
    this.ativo = props.ativo ?? true;
    this.criado_em = props.criado_em ?? new Date();
  }

  get nome_sacado(): string {
    return this._nome_sacado;
  }
    
  set nome_sacado(value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Nome do sacado não pode ser vazio');
    }
    this._nome_sacado = value;
  }

  get valor(): number {
    return this._valor;
  }

  set valor(value: number) {
    if (value <= 0) {
      throw new Error('Valor do boleto deve ser maior que zero');
    }
    this._valor = value;
  }

  get id_lote(): number {
    return this._id_lote;
  }

  set id_lote(value: number) {
    if (value <= 0) {
      throw new Error('ID do lote deve ser maior que zero');
    }
    this._id_lote = value;
  }

  get linha_digitavel(): string {
    return this._linha_digitavel;
  }

  set linha_digitavel(value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Linha digitável não pode ser vazia');
    }
    
    this._linha_digitavel = value;
  }

  protected validarBoleto(): boolean {
    return this._valor > 0 && this._linha_digitavel.length > 0;
  }
}

export { BoletoEntity }