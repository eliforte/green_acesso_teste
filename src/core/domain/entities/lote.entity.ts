class LoteEntity {
  public readonly id?: number;
  private _nome: string;
  public ativo: boolean;
  public criado_em: Date;

  constructor(props: {
    id?: number;
    nome: string;
    ativo?: boolean;
    criado_em?: Date;
  }) {
    this.id = props.id;
    this.nome = props.nome;
    this.ativo = props.ativo ?? true; 
    this.criado_em = props.criado_em ?? new Date();
  }

  get nome(): string {
    return this._nome;
  }

  set nome(value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Nome do lote não pode ser vazio');
    }
    this._nome = value;
  }

  public formatarNome(): string {
    return this._nome.padStart(4, '0');
  }

  public estaAtivo(): boolean {
    return this.ativo;
  }
}

export { LoteEntity }