// import { readdirSync } from 'fs';
// import { join, parse } from 'path';

// interface Emoji {
//   attachment: string;
//   name: string;
// }

// export const loadEmojis = (): Emoji[] => {
//   const emojiFiles = readdirSync(join(__dirname, '../assets')).filter((file) =>
//     /\.(png|jpg|jpeg|gif)$/i.test(file),
//   );

//   const emojis = emojiFiles.map((file) => {
//     const filePath = join(__dirname, '../assets', file);
//     const { name: fileName } = parse(file);

//     return {
//       attachment: filePath,
//       name: fileName,
//     };
//   });

//   return emojis;
// };
