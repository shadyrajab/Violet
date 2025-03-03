import { inject, injectable } from 'tsyringe';
import { TheMovieDBService } from '../../services/theMovieDB.service';
import { CommandInteraction } from 'discord.js';
import {
  ICommandData,
  ISlashCommand,
} from '../../interfaces/command.interface';

@injectable()
export class Host implements ISlashCommand {
  constructor(
    @inject(TheMovieDBService.name)
    private theMovieDBService: TheMovieDBService,
  ) {}

  public async execute(interaction: CommandInteraction) {}
  public get commandData(): ICommandData {
    return {
      name: 'host',
      description: 'host command',
      category: 'cinema',
    };
  }
}
