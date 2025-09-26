import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} from 'discord.js';

export const reportBugCommand = {
  data: new SlashCommandBuilder()
    .setName('report-bug')
    .setDescription('Report a new bug with detailed information')
    .addAttachmentOption(option =>
      option
        .setName('screenshot')
        .setDescription('Screenshot or video of the bug (optional)')
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const attachment = interaction.options.getAttachment('screenshot');

    if (attachment) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'video/mp4', 'video/webm'];
      if (!validTypes.includes(attachment.contentType || '')) {
        await interaction.reply({
          content: '❌ Invalid file type. Please upload a PNG, JPG, GIF, MP4, or WebM file.',
          ephemeral: true
        });
        return;
      }

      if (attachment.size > 25 * 1024 * 1024) { // 25MB limit
        await interaction.reply({
          content: '❌ File too large. Please upload a file smaller than 25MB.',
          ephemeral: true
        });
        return;
      }
    }

    const modal = new ModalBuilder()
      .setCustomId(`bug-report-modal-${interaction.user.id}`)
      .setTitle('🐛 Bug Report Details');

    const titleInput = new TextInputBuilder()
      .setCustomId('bug-title')
      .setLabel('Bug Title')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Brief description of the bug')
      .setRequired(true)
      .setMaxLength(100);

    const descriptionInput = new TextInputBuilder()
      .setCustomId('bug-description')
      .setLabel('Description / Steps to Reproduce')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Detailed description and steps to reproduce the problem...')
      .setRequired(true)
      .setMaxLength(4000);

    const osInput = new TextInputBuilder()
      .setCustomId('bug-os')
      .setLabel('Operating System')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Windows or MacOS')
      .setRequired(true)
      .setMaxLength(20);

    const architectureInput = new TextInputBuilder()
      .setCustomId('bug-architecture')
      .setLabel('Architecture')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('x86, x64, or arm')
      .setRequired(true)
      .setMaxLength(10);

    const versionInput = new TextInputBuilder()
      .setCustomId('bug-version')
      .setLabel('Version and Branch')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('e.g., v1.2.3 (main branch)')
      .setRequired(true)
      .setMaxLength(100);

    const titleRow = new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput);
    const descriptionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput);
    const osRow = new ActionRowBuilder<TextInputBuilder>().addComponents(osInput);
    const architectureRow = new ActionRowBuilder<TextInputBuilder>().addComponents(architectureInput);
    const versionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(versionInput);

    modal.addComponents(titleRow, descriptionRow, osRow, architectureRow, versionRow);

    if (attachment) {
      (interaction as any).bugReportAttachment = attachment;
    }

    await interaction.showModal(modal);
  }
};