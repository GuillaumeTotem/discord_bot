import {
  ModalSubmitInteraction,
  TextChannel,
  AttachmentBuilder
} from 'discord.js';
import { botConfig } from '../config/botConfig';
import { bugIdGenerator } from '../utils/bugIdGenerator';
import { BugReportData, createBugReportSuccessEmbed } from '../utils/embedBuilder';
import { ThreadManager } from '../utils/threadManager';

const bugReportAttachments = new Map<string, any>();

export async function handleModalSubmit(interaction: ModalSubmitInteraction): Promise<void> {
  if (!interaction.customId.startsWith('bug-report-modal-')) {
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    const channel = interaction.guild?.channels.cache.get(botConfig.bugReportsChannelId) as TextChannel;

    if (!channel) {
      await interaction.editReply({
        content: '❌ Bug reports channel not found. Please contact an administrator.'
      });
      return;
    }

    const title = interaction.fields.getTextInputValue('bug-title');
    const description = interaction.fields.getTextInputValue('bug-description');
    const os = interaction.fields.getTextInputValue('bug-os');
    const architecture = interaction.fields.getTextInputValue('bug-architecture');
    const version = interaction.fields.getTextInputValue('bug-version');

    if (!validateInputs(os, architecture)) {
      await interaction.editReply({
        content: '❌ Invalid input values. Please check OS (Windows/MacOS) and Architecture (x86/x64/arm).'
      });
      return;
    }

    const frequency = await askForFrequency(interaction);
    if (!frequency) return;

    const bugId = bugIdGenerator.getNextId();

    const bugData: BugReportData = {
      bugId,
      title,
      description,
      os: normalizeOs(os),
      architecture: normalizeArchitecture(architecture),
      frequency,
      version,
      reporterId: interaction.user.id,
      reporterUsername: interaction.user.username,
      timestamp: new Date()
    };

    const attachment = bugReportAttachments.get(interaction.user.id);
    let screenshotAttachment: AttachmentBuilder | undefined;

    if (attachment) {
      screenshotAttachment = new AttachmentBuilder(attachment.url, {
        name: `${bugId}-screenshot.${attachment.name?.split('.').pop() || 'png'}`
      });
      bugReportAttachments.delete(interaction.user.id);
    }

    const thread = await ThreadManager.createBugReportThread(channel, bugData, screenshotAttachment);

    await ThreadManager.addBugTags(thread, bugData.os, bugData.frequency);

    const successEmbed = createBugReportSuccessEmbed(bugId, thread.id);

    await interaction.editReply({
      embeds: [successEmbed]
    });

    console.log(`Bug report created: ${bugId} by ${interaction.user.username}`);

  } catch (error) {
    console.error('Error creating bug report:', error);
    await interaction.editReply({
      content: '❌ An error occurred while creating the bug report. Please try again.'
    });
  }
}

async function askForFrequency(interaction: ModalSubmitInteraction): Promise<string | null> {
  return new Promise((resolve) => {
    const frequencyMessage = interaction.followUp({
      content: 'Please select how frequently this bug occurs:',
      components: [{
        type: 1,
        components: [{
          type: 3,
          custom_id: 'frequency-select',
          placeholder: 'Select frequency...',
          options: [
            { label: 'Always', value: 'Always', description: 'Bug occurs every time' },
            { label: 'Occasional', value: 'Occasional', description: 'Bug occurs sometimes' },
            { label: 'Rare', value: 'Rare', description: 'Bug occurs rarely' }
          ]
        }]
      }],
      ephemeral: true
    });

    const collector = interaction.channel?.createMessageComponentCollector({
      filter: (i) => i.customId === 'frequency-select' && i.user.id === interaction.user.id,
      time: 30000,
      max: 1
    });

    collector?.on('collect', async (i) => {
      await i.deferUpdate();
      if ('values' in i && Array.isArray(i.values)) {
        resolve(i.values[0]);
      } else {
        resolve(null);
      }
    });

    collector?.on('end', (collected) => {
      if (collected.size === 0) {
        interaction.editReply({ content: '❌ Frequency selection timed out.' });
        resolve(null);
      }
    });
  });
}

function validateInputs(os: string, architecture: string): boolean {
  const validOs = ['windows', 'macos', 'mac'];
  const validArch = ['x86', 'x64', 'arm', 'arm64'];

  return validOs.includes(os.toLowerCase()) &&
         validArch.includes(architecture.toLowerCase());
}

function normalizeOs(os: string): string {
  const lower = os.toLowerCase();
  if (lower === 'mac') return 'MacOS';
  return lower === 'windows' ? 'Windows' : 'MacOS';
}

function normalizeArchitecture(arch: string): string {
  const lower = arch.toLowerCase();
  if (lower === 'arm64') return 'arm';
  return lower;
}

export function setBugReportAttachment(userId: string, attachment: any) {
  bugReportAttachments.set(userId, attachment);
}