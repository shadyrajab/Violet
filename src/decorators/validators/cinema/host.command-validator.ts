import { CommandInteraction } from 'discord.js';
import { HostValidatedParams } from '../../../interfaces/command-params.interface';

export function HostParamsValidator() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (interaction: CommandInteraction) {
      const validatedParams: HostValidatedParams = {};

      const movieId = interaction.options.get('movieid').value.toString();
      const startDate = interaction.options.get('startdate').value.toString();
      const startTime = interaction.options.get('starttime').value.toString();

      const eventDateTime = new Date(`${startDate}T${startTime}:00`);

      validatedParams.movieId = parseInt(movieId);
      validatedParams.startDate = eventDateTime;
      validatedParams.startTime = startTime;

      return await originalMethod.apply(this, [interaction, validatedParams]);
    };

    return descriptor;
  };
}
