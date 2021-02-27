import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'
import { v4 as uuid } from 'uuid';

@Entity('users')
class User {

  @PrimaryColumn()
  readonly id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  mail_replied: number;

  @Column()
  classification: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    this.mail_replied = 0;
    if (!this.id) {
      this.id = uuid()
    }
  }
}

export { User };