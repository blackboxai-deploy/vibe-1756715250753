"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Download, ExternalLink, Shield, ShieldOff } from "lucide-react";
import { StreamingServer } from "@/types";

const servers: StreamingServer[] = [
  {
    name: "Change Server If Not Playing",
    type: "tmdb",
    url: "https://fuhho374key.com/play/{imdb_id}",
    url_tv: "https://fuhho374key.com/play/{imdb_id}/{season}/{episode}"
  },
  {
    name: "All in one 🔥with download + 4k size",
    type: "tmdb",
    url: "https://iframe.pstream.mov/media/tmdb-movie-{tmdb_id}",
    url_tv: "https://iframe.pstream.mov/media/tmdb-tv-{tmdb_id}-{season}-{episode}"
  },
  {
    name: "alpha",
    type: "imdb",
    url: "https://vidsrc.to/embed/movie/{imdb_id}",
    url_tv: "https://vidsrc.to/embed/tv/{imdb_id}/{season}/{episode}"
  },
  {
    name: "beta",
    type: "imdb",
    url: "https://vidsrc.icu/embed/movie/{imdb_id}",
    url_tv: "https://vidsrc.icu/embed/tv/{imdb_id}/{season}/{episode}"
  },
  {
    name: "gama",
    type: "imdb",
    url: "https://vidsrc.cc/v2/embed/movie/{imdb_id}",
    url_tv: "https://vidsrc.cc/v2/embed/tv/{imdb_id}/{season}/{episode}"
  },
  {
    name: "penta",
    type: "imdb",
    url: "https://embed.su/embed/movie/{imdb_id}",
    url_tv: "https://embed.su/embed/tv/{imdb_id}/{season}/{episode}"
  },
  {
    name: "hexa",
    type: "imdb",
    url: "https://vidsrc.me/embed/movie/{imdb_id}",
    url_tv: "https://vidsrc.me/embed/tv/{imdb_id}/{season}/{episode}"
  },
  {
    name: "oxa fast",
    type: "imdb",
    url: "https://autoembed.pro/embed/movie/{imdb_id}",
    url_tv: "https://autoembed.pro/embed/tv/{imdb_id}/{season}/{episode}"
  },
  {
    name: "octa fast 8",
    type: "imdb",
    url: "https://vidfast.pro/movie/{imdb_id}",
    url_tv: "https://vidfast.pro/tv/{imdb_id}/{season}/{episode}"
  },
  {
    name: "low ads 9",
    type: "imdb",
    url: "https://player.autoembed.cc/embed/movie/{imdb_id}",
    url_tv: "https://player.autoembed.cc/embed/tv/{imdb_id}/{season}/{episode}"
  },
  {
    name: "Hd better 10",
    type: "imdb",
    url: "https://hyhd.org/embed/{imdb_id}",
    url_tv: "https://hyhd.org/embed/tv/{imdb_id}/{season}/{episode}"
  },
  {
    name: "11 movies",
    type: "imdb",
    url: "https://111movies.com/movie/{imdb_id}",
    url_tv: "https://111movies.com/tv/{imdb_id}/{season}/{episode}"
  },
  {
    name: "MultiEmbed",
    type: "tmdb",
    url: "https://multiembed.mov/?video_id={tmdb_id}&tmdb=1",
    url_tv: "https://multiembed.mov/?video_id={tmdb_id}&tmdb=1&s={season}&e={episode}"
  },
  {
    name: "MoviesAPI",
    type: "tmdb",
    url: "https://moviesapi.club/movie/{tmdb_id}",
    url_tv: "https://moviesapi.club/tv/{tmdb_id}-{season}-{episode}"
  },
  {
    name: "EmbedSU",
    type: "tmdb",
    url: "https://embed.su/embed/movie/{tmdb_id}",
    url_tv: "https://embed.su/embed/tv/{tmdb_id}/{season}/{episode}"
  },
  {
    name: "Hexa",
    type: "tmdb",
    url: "https://hexa.watch/watch/movie/{tmdb_id}",
    url_tv: "https://hexa.watch/watch/tv/{tmdb_id}/{season}/{episode}"
  },
  {
    name: "VidLink",
    type: "tmdb",
    url: "https://vidlink.pro/movie/{tmdb_id}",
    url_tv: "https://vidlink.pro/tv/{tmdb_id}/{season}/{episode}"
  },
  {
    name: "VidSrcXyz",
    type: "tmdb",
    url: "https://vidsrc.xyz/embed/movie/{tmdb_id}",
    url_tv: "https://vidsrc.xyz/embed/tv/{tmdb_id}/{season}/{episode}"
  },
  {
    name: "VidSrcRIP",
    type: "tmdb",
    url: "https://vidsrc.rip/embed/movie/{tmdb_id}",
    url_tv: "https://vidsrc.rip/embed/tv/{tmdb_id}/{season}/{episode}"
  },
  {
    name: "VidSrcSU",
    type: "tmdb",
    url: "https://vidsrc.su/embed/movie/{tmdb_id}",
    url_tv: "https://vidsrc.su/embed/tv/{tmdb_id}/{season}/{episode}"
  },
  {
    name: "VidSrcVIP",
    type: "tmdb",
    url: "https://vidsrc.vip/embed/movie/{tmdb_id}",
    url_tv: "https://vidsrc.vip/embed/tv/{tmdb_id}/{season}/{episode}"
  },
  {
    name: "2Embed",
    type: "tmdb",
    url: "https://www.2embed.cc/embed/{tmdb_id}",
    url_tv: "https://www.2embed.cc/embedtv/{tmdb_id}&s={season}&e={episode}"
  },
  {
    name: "123Embed",
    type: "tmdb",
    url: "https://play2.123embed.net/movie/{tmdb_id}",
    url_tv: "https://play2.123embed.net/tv/{tmdb_id}/{season}/{episode}"
  },
  {
    name: "SmashyStream",
    type: "tmdb",
    url: "https://player.smashy.stream/movie/{tmdb_id}",
    url_tv: "https://player.smashy.stream/tv/{tmdb_id}?s={season}&e={episode}"
  },
  {
    name: "VidEasy (4K)",
    type: "tmdb",
    url: "https://player.videasy.net/movie/{tmdb_id}?color=8834ec",
    url_tv: "https://player.videasy.net/tv/{tmdb_id}/{season}/{episode}?color=8834ec"
  },
  {
    name: "Vidify",
    type: "tmdb",
    url: "https://vidify.top/embed/movie/{tmdb_id}",
    url_tv: "https://vidify.top/embed/tv/{tmdb_id}/{season}/{episode}"
  },
  {
    name: "Flicky",
    type: "tmdb",
    url: "https://flicky.host/embed/movie/?id={tmdb_id}",
    url_tv: "https://flicky.host/embed/tv/{tmdb_id}/{season}/{episode}"
  },
  {
    name: "RiveStream",
    type: "tmdb",
    url: "https://rivestream.org/embed?type=movie&id={tmdb_id}",
    url_tv: "https://rivestream.org/embed?type=tv&id={tmdb_id}&season={season}&episode={episode}"
  },
  {
    name: "Vidora",
    type: "tmdb",
    url: "https://vidora.su/movie/{tmdb_id}",
    url_tv: "https://vidora.su/tv/{tmdb_id}/{season}/{episode}"
  },
  {
    name: "VidSrcCC",
    type: "tmdb",
    url: "https://vidsrc.cc/v2/embed/movie/{tmdb_id}?autoPlay=false",
    url_tv: "https://vidsrc.cc/v2/embed/tv/{tmdb_id}/{season}/{episode}?autoPlay=false"
  },
  {
    name: "StreamFlix",
    type: "tmdb",
    url: "https://watch.streamflix.one/movie/{tmdb_id}/watch?server=1",
    url_tv: "https://watch.streamflix.one/tv/{tmdb_id}/watch?server=1&season={season}&episode={episode}"
  },
  {
    name: "NebulaFlix",
    type: "tmdb",
    url: "https://nebulaflix.stream/movie?mt={tmdb_id}&server=1",
    url_tv: "https://nebulaflix.stream/show?st={tmdb_id}&season={season}&episode={episode}&server=1"
  },
  {
    name: "VidJoy",
    type: "tmdb",
    url: "https://vidjoy.pro/embed/movie/{tmdb_id}",
    url_tv: "https://vidjoy.pro/embed/tv/{tmdb_id}/{season}/{episode}"
  },
  {
    name: "VidZee",
    type: "tmdb",
    url: "https://player.vidzee.wtf/embed/movie/{tmdb_id}",
    url_tv: "https://player.vidzee.wtf/embed/tv/{tmdb_id}/{season}/{episode}"
  },
  {
    name: "Spenflix",
    type: "tmdb",
    url: "https://spencerdevs.xyz/movie/{tmdb_id}",
    url_tv: "https://spencerdevs.xyz/tv/{tmdb_id}/{season}/{episode}"
  },
  {
    name: "Frembed (FR)",
    type: "tmdb",
    url: "https://frembed.icu/api/film.php?id={tmdb_id}",
    url_tv: "https://frembed.icu/api/serie.php?id={tmdb_id}&sa={season}&epi={episode}"
  },
  {
    name: "UEmbed (premium)",
    type: "tmdb",
    url: "https://uembed.site/?id={tmdb_id}&apikey=thisisforsurenotapremiumkey_right?",
    url_tv: "https://uembed.site/?id={tmdb_id}&season={season}&episode={episode}&apikey=thisisforsurenotapremiumkey_right?"
  }
];

interface ServerSelectorProps {
  selectedServer: string;
  onServerChange: (serverName: string) => void;
  sandboxEnabled: boolean;
  onSandboxToggle: (enabled: boolean) => void;
  tmdbId?: number;
  imdbId?: string;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
}

export default function ServerSelector({
  selectedServer,
  onServerChange,
  sandboxEnabled,
  onSandboxToggle,
  tmdbId,
  imdbId,
  mediaType,
  season,
  episode
}: ServerSelectorProps) {
  const [showAllServers, setShowAllServers] = useState(false);

  const getServerBadge = (serverName: string) => {
    if (serverName.includes('fast')) return <Badge variant="secondary" className="text-xs">Fast</Badge>;
    if (serverName.includes('low ads')) return <Badge variant="secondary" className="text-xs">Low Ads</Badge>;
    if (serverName.includes('4K') || serverName.includes('4k')) return <Badge variant="secondary" className="text-xs">4K</Badge>;
    if (serverName.includes('premium')) return <Badge variant="secondary" className="text-xs">Premium</Badge>;
    if (serverName.includes('🔥')) return <Badge variant="secondary" className="text-xs">Popular</Badge>;
    return null;
  };

  const buildDownloadUrl = (server: StreamingServer) => {
    if (!tmdbId && !imdbId) return null;
    
    let url = mediaType === 'movie' ? server.url : server.url_tv;
    
    if (server.type === 'tmdb' && tmdbId) {
      url = url.replace('{tmdb_id}', tmdbId.toString());
    } else if (server.type === 'imdb' && imdbId) {
      url = url.replace('{imdb_id}', imdbId);
    } else {
      return null;
    }
    
    if (mediaType === 'tv' && season && episode) {
      url = url.replace('{season}', season.toString());
      url = url.replace('{episode}', episode.toString());
    }
    
    return url;
  };

  const handleDownload = (server: StreamingServer) => {
    const url = buildDownloadUrl(server);
    if (url) {
      // Convert streaming URL to download URL
      const downloadUrl = url.replace('/embed/', '/dl/').replace('/movie/', '/dl/movie/').replace('/tv/', '/dl/tv/');
      window.open(downloadUrl, '_blank');
    }
  };

  const handleOpenInPopup = (server: StreamingServer) => {
    const url = buildDownloadUrl(server);
    if (url) {
      window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    }
  };

  const displayedServers = showAllServers ? servers : servers.slice(0, 8);

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Server Selection</h3>
        <div className="flex items-center space-x-2">
          {sandboxEnabled ? <Shield className="h-4 w-4 text-green-500" /> : <ShieldOff className="h-4 w-4 text-red-500" />}
          <Switch
            checked={sandboxEnabled}
            onCheckedChange={onSandboxToggle}
            id="sandbox-toggle"
          />
          <Label htmlFor="sandbox-toggle" className="text-sm">
            Sandbox {sandboxEnabled ? 'On' : 'Off'}
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="server-select">Choose Server:</Label>
        <Select value={selectedServer} onValueChange={onServerChange}>
          <SelectTrigger id="server-select">
            <SelectValue placeholder="Select a server" />
          </SelectTrigger>
          <SelectContent>
            {displayedServers.map((server, index) => (
              <SelectItem key={index} value={server.name}>
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{server.name}</span>
                  <div className="flex items-center space-x-1 ml-2">
                    {getServerBadge(server.name)}
                    <Badge variant="outline" className="text-xs">
                      {server.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!showAllServers && servers.length > 8 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAllServers(true)}
          className="w-full"
        >
          Show All {servers.length} Servers
        </Button>
      )}

      <div className="flex flex-wrap gap-2">
        {servers.map((server, index) => {
          if (server.name === selectedServer) {
            return (
              <div key={index} className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(server)}
                  className="flex items-center gap-1"
                >
                  <Download className="h-3 w-3" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenInPopup(server)}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open in Popup
                </Button>
              </div>
            );
          }
          return null;
        })}
      </div>

      {sandboxEnabled && (
        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
          <p className="font-medium">Sandbox Mode Active:</p>
          <p>• Blocks most ads and redirects</p>
          <p>• Some servers may not work properly</p>
          <p>• Disable if video doesn't load</p>
        </div>
      )}
    </div>
  );
}