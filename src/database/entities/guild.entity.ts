import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity('guilds')
export class GuildEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column('varchar', { primary: true, name: 'guild_id' })
  guildId: string;

  @Column('varchar', { name: 'tr_setup_id' })
  trSetupId: string;

  @Column('varchar', { name: 'cinema_setup_id' })
  cinemaSetupId: string;

  @Column('varchar', { name: 'cinema_category_id' })
  cinemaCategoryId: string;
}
