import {
  TextChannel,
  ThreadAutoArchiveDuration,
  ChannelType,
  AttachmentBuilder,
  ThreadChannel,
  ForumChannel,
  MediaChannel
} from 'discord.js';
import { BugReportData, createBugReportEmbed } from './embedBuilder';

export class ThreadManager {
  static async createBugReportThread(
    channel: TextChannel,
    bugData: BugReportData,
    screenshot?: AttachmentBuilder
  ): Promise<ThreadChannel> {
    const threadName = `[${bugData.bugId}] ${bugData.title}`.slice(0, 100);

    const thread = await channel.threads.create({
      name: threadName,
      autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
      type: ChannelType.PublicThread,
      reason: `Bug report created by ${bugData.reporterUsername}`
    });

    const embed = createBugReportEmbed(bugData);

    const messageOptions: any = {
      embeds: [embed]
    };

    if (screenshot) {
      messageOptions.files = [screenshot];
    }

    await thread.send(messageOptions);

    await thread.send({
      content: [
        '**Instructions:**',
        '• Developers can discuss the bug in this thread',
        '• Use reactions to indicate bug status (🔍 investigating, ✅ fixed, ❌ won\'t fix)',
        '• Thread will auto-archive after 1 week of inactivity',
        '',
        `**Reporter:** <@${bugData.reporterId}> will be notified of updates`
      ].join('\n')
    });

    return thread;
  }

  static async addBugTags(thread: ThreadChannel, os: string, frequency: string): Promise<void> {
    try {
      const parent = thread.parent;
      if (!parent || !('availableTags' in parent)) {
        return;
      }

      const availableTags = (parent as ForumChannel | MediaChannel).availableTags || [];
      const tagsToApply: string[] = [];

      const osTag = availableTags.find((tag: any) =>
        tag.name.toLowerCase().includes(os.toLowerCase())
      );
      if (osTag) tagsToApply.push(osTag.id);

      const frequencyTag = availableTags.find((tag: any) =>
        tag.name.toLowerCase().includes(frequency.toLowerCase())
      );
      if (frequencyTag) tagsToApply.push(frequencyTag.id);

      if (tagsToApply.length > 0) {
        await thread.setAppliedTags(tagsToApply);
      }
    } catch (error) {
      console.warn('Could not apply tags to thread:', error);
    }
  }
}