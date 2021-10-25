"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicService = exports.MusicCommandStatus = exports.Song = void 0;
const service_1 = require("../service");
const ytdl = require("ytdl-core");
const logger_1 = require("../../utils/logger");
const servicehandler_1 = require("../servicehandler");
class Song {
    constructor(title, url) {
        this.title = title;
        this.url = url;
    }
}
exports.Song = Song;
class MusicCommandStatus {
    constructor(message, error, errorMessage = null) {
        this.message = message;
        this.error = error;
        this.errorMessage = errorMessage;
    }
}
exports.MusicCommandStatus = MusicCommandStatus;
class MusicService extends service_1.Service {
    constructor() {
        super(...arguments);
        this.queue = new Map();
    }
    init(client) {
        if (!MusicService.instance) {
            MusicService.instance = this;
        }
        else if (MusicService.instance != this) {
            servicehandler_1.ServiceHandler.unregister(this);
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
    stop() {
        MusicService.instance = null;
        this.queue.forEach((q, id) => {
            if (q.voiceChannel !== null)
                q.voiceChannel.leave();
        });
    }
    execute(message, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel) {
                return new MusicCommandStatus("You need to be in a voice channel to play music!", true);
            }
            const permissions = voiceChannel.permissionsFor(message.client.user);
            if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                return new MusicCommandStatus("I need the permissions to join and speak inside a voice channel!", true);
            }
            let songInfo;
            try {
                songInfo = yield ytdl.getInfo(url);
            }
            catch (err) {
                return new MusicCommandStatus(`Couldn't find the video '${url}'!`, true);
            }
            const song = new Song(songInfo.videoDetails.title, songInfo.videoDetails.video_url);
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
                    const connection = yield voiceChannel.join();
                    this.queue.get(message.guild.id).connection = connection;
                    return this.play(message.guild.id, this.queue.get(message.guild.id).songs[0]);
                }
                catch (err) {
                    this.queue.delete(message.guild.id);
                    return new MusicCommandStatus("Failed to play", true, err);
                }
            }
            else {
                serverQueue.songs.push(song);
                return new MusicCommandStatus(`**${song.title}** was added to the queue.`, false);
            }
        });
    }
    skip(message) {
        if (!message.member.voice.channel)
            return new MusicCommandStatus("You need to be in a voice channel to play music!", true);
        const serverQueue = this.queue.get(message.guild.id);
        if (!serverQueue)
            return new MusicCommandStatus("There's nothing to skip!", true);
        if (serverQueue.songs.length > 1) {
            const nextSong = serverQueue.songs[1];
            serverQueue.connection.dispatcher.end();
            return new MusicCommandStatus(`Skipped! Now playing: **${nextSong.title}**.`, false);
        }
        else {
            serverQueue.connection.dispatcher.end();
            return new MusicCommandStatus("There are no more songs in the queue. Bye bye...", false);
        }
    }
    stopPlayback(message) {
        if (!message.member.voice.channel)
            return new MusicCommandStatus("You need to be in a voice channel to play music!", true);
        const serverQueue = this.queue.get(message.guild.id);
        if (!serverQueue)
            return new MusicCommandStatus("There's nothing to stop!", true);
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        return new MusicCommandStatus("Stopped!", false);
    }
    play(guildId, song) {
        const serverQueue = this.queue.get(guildId);
        if (!song) {
            serverQueue.voiceChannel.leave();
            this.queue.delete(guildId);
            return;
        }
        const dispatcher = serverQueue.connection
            .play(ytdl(song.url))
            .on("finish", () => {
            serverQueue.songs.shift();
            this.play(guildId, serverQueue.songs[0]);
        })
            .on("error", (err) => {
            logger_1.Logger.error("Internal error while trying to play music!");
        });
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        return new MusicCommandStatus(`Now playing: **${song.title}**.`, false);
    }
    static getInstance() {
        return this.instance;
    }
}
exports.MusicService = MusicService;
//# sourceMappingURL=musicservice.js.map