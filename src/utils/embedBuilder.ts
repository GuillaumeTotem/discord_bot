import { EmbedBuilder, Colors } from 'discord.js';

export interface BugReportData {
  bugId: string;
  title: string;
  description: string;
  os: string;
  architecture: string;
  frequency: string;
  version: string;
  reporterId: string;
  reporterUsername: string;
  timestamp: Date;
}

export function createBugReportEmbed(data: BugReportData): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`🐛 ${data.bugId}: ${data.title}`)
    .setDescription(data.description)
    .setColor(Colors.Red)
    .addFields([
      {
        name: '🖥️ Operating System',
        value: data.os,
        inline: true
      },
      {
        name: '⚙️ Architecture',
        value: data.architecture,
        inline: true
      },
      {
        name: '📊 Frequency',
        value: data.frequency,
        inline: true
      },
      {
        name: '📦 Version',
        value: data.version,
        inline: true
      },
      {
        name: '👤 Reported by',
        value: `<@${data.reporterId}>`,
        inline: true
      },
      {
        name: '📅 Reported at',
        value: `<t:${Math.floor(data.timestamp.getTime() / 1000)}:F>`,
        inline: true
      }
    ])
    .setFooter({
      text: `Bug ID: ${data.bugId} • Use Discord search to find this bug later`
    })
    .setTimestamp();
}

export function createBugReportSuccessEmbed(bugId: string, threadId: string): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle('✅ Bug Report Created')
    .setDescription(`Your bug report **${bugId}** has been created successfully!`)
    .setColor(Colors.Green)
    .addFields([
      {
        name: '📝 Thread Created',
        value: `<#${threadId}>`
      }
    ])
    .setFooter({
      text: 'Thank you for helping improve the software!'
    })
    .setTimestamp();
}