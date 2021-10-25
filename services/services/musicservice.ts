import {Service} from "../service";

import {
    Client,
    DMChannel,
    Message,
    NewsChannel,
    Permissions, StreamDispatcher,
    TextChannel,
    VoiceChannel,
    VoiceConnection
} from "discord.js";
import * as ytdl from "ytdl-core";
import {Logger} from "../../utils/logger";
import {ServiceHandler} from "../servicehandler";

export class Song {
    constructor(public readonly title: string, public readonly url: string) {
    }
}

export type ServerQueue = {
    textChannel: TextChannel | DMChannel | NewsChannel,
    voiceChannel: VoiceChannel,
    connection: VoiceConnection,
    songs: Song[],
    volume: number,
    playing: boolean
}

export class MusicCommandStatus {
    constructor(public readonly message: string, public readonly error: boolean, public readonly errorMessage: Error | string = null) { }
}

export class MusicService extends Service {

    public static instance: MusicService;

    private queue: Map<string, ServerQueue> = new Map<string, ServerQueue>();

    init(client: Client) {
        if(!MusicService.instance) {
            MusicService.instance = this;
        } else if(MusicService.instance != this) {
            ServiceHandler.unregister(this);
        }

        // EXPERIMENTAL
        /*
        client.on("voiceStateUpdate", (oldMember, newMember) => {
            if(oldMember.channel !== null && this.queue.has(oldMember.guild.id) && this.queue.get(oldMember.guild.id).voiceChannel !== null) {
                if(oldMember.channel.id === this.queue.get(oldMember.guild.id).voiceChannel.id && oldMember.channel.members.size === 1 && oldMember.channel.members.get(client.user.id) !== null) {
                    oldMember.channel.leave();
                    this.queue.delete(oldMember.guild.id);
                }
            }
        });*/
    }

    public stop() {
        MusicService.instance = null;
        this.queue.forEach((q, id) => {
           if(q.voiceChannel !== null) q.voiceChannel.leave();
        });
    }

    public async execute(message: Message, url: string): Promise<MusicCommandStatus> {
        const voiceChannel: VoiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return new MusicCommandStatus("You need to be in a voice channel to play music!", true);
        }

        const permissions: Readonly<Permissions> = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return new MusicCommandStatus("I need the permissions to join and speak inside a voice channel!", true);
        }

        let songInfo: ytdl.videoInfo;
        try {
            songInfo = await ytdl.getInfo(url);
        } catch (err) {
            return new MusicCommandStatus(`Couldn't find the video '${url}'!`, true);
        }

        const song: Song = new Song(songInfo.videoDetails.title, songInfo.videoDetails.video_url);

        const serverQueue = this.queue.get(message.guild.id);
        if (!serverQueue) {
            this.queue.set(message.guild.id, {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            });
            this.queue.get(message.guild.id).songs.push(song);

            try {
                const connection: VoiceConnection = await voiceChannel.join();
                this.queue.get(message.guild.id).connection = connection;
                return this.play(message.guild.id, this.queue.get(message.guild.id).songs[0]);
            } catch (err) {
                this.queue.delete(message.guild.id);
                return new MusicCommandStatus("Failed to play", true, err);
            }
        } else {
            serverQueue.songs.push(song);
            return new MusicCommandStatus(`**${song.title}** was added to the queue.`, false);
        }
    }

    public skip(message: Message): MusicCommandStatus {
        if(!message.member.voice.channel) return new MusicCommandStatus("You need to be in a voice channel to play music!", true);

        const serverQueue = this.queue.get(message.guild.id);
        if(!serverQueue) return new MusicCommandStatus("There's nothing to skip!", true);

        if(serverQueue.songs.length > 1) {
            const nextSong: Song = serverQueue.songs[1];
            serverQueue.connection.dispatcher.end();
            return new MusicCommandStatus(`Skipped! Now playing: **${nextSong.title}**.`, false);
        } else {
            serverQueue.connection.dispatcher.end();
            return new MusicCommandStatus("There are no more songs in the queue. Bye bye...", false);
        }
    }

    public stopPlayback(message: Message): MusicCommandStatus {
        if(!message.member.voice.channel) return new MusicCommandStatus("You need to be in a voice channel to play music!", true);

        const serverQueue = this.queue.get(message.guild.id);
        if(!serverQueue) return new MusicCommandStatus("There's nothing to stop!", true);

        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        return new MusicCommandStatus("Stopped!", false);
    }

    public play(guildId: string, song: Song): MusicCommandStatus {
        const serverQueue = this.queue.get(guildId);
        if (!song) {
            serverQueue.voiceChannel.leave();
            this.queue.delete(guildId);
            return;
        }

        const dispatcher: StreamDispatcher = serverQueue.connection
            .play(ytdl(song.url))
            .on("finish", () => {
                serverQueue.songs.shift();
                this.play(guildId, serverQueue.songs[0]);
            })
            .on("error", (err) => {
                Logger.error("Internal error while trying to play music!");
            });

        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        return new MusicCommandStatus(`Now playing: **${song.title}**.`, false);
    }

    public static getInstance(): MusicService {
        return this.instance;
    }

}