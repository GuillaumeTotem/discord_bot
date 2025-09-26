import {
  Interaction,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction
} from 'discord.js';
import { reportBugCommand } from '../commands/reportBug';
import { handleModalSubmit, setBugReportAttachment } from './modalHandler';

export async function handleInteraction(interaction: Interaction) {
  try {
    if (interaction.isChatInputCommand()) {
      await handleChatInputCommand(interaction);
    } else if (interaction.isModalSubmit()) {
      await handleModalSubmit(interaction);
    } else if (interaction.isStringSelectMenu()) {
      await handleSelectMenu(interaction);
    }
  } catch (error) {
    console.error('Error handling interaction:', error);

    const errorMessage = {
      content: '❌ An error occurred while processing your request. Please try again.',
      ephemeral: true
    };

    try {
      if (interaction.isRepliable()) {
        if ('replied' in interaction && interaction.replied || 'deferred' in interaction && interaction.deferred) {
          await interaction.editReply(errorMessage);
        } else {
          await interaction.reply(errorMessage);
        }
      }
    } catch (followUpError) {
      console.error('Error sending error message:', followUpError);
    }
  }
}

async function handleChatInputCommand(interaction: ChatInputCommandInteraction) {
  const { commandName } = interaction;

  switch (commandName) {
    case 'report-bug':
      const attachment = interaction.options.getAttachment('screenshot');
      if (attachment) {
        setBugReportAttachment(interaction.user.id, attachment);
      }
      await reportBugCommand.execute(interaction);
      break;
    default:
      await interaction.reply({
        content: '❌ Unknown command.',
        ephemeral: true
      });
  }
}

async function handleSelectMenu(interaction: StringSelectMenuInteraction) {
  if (interaction.customId === 'frequency-select') {
    return;
  }

  await interaction.reply({
    content: '❌ Unknown select menu.',
    ephemeral: true
  });
}