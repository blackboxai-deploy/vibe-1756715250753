"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, Settings, X, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import { Movie, TVShow, StreamingServer } from '@/types';
import { servers } from '@/lib/servers';
import { getStorageItem, setStorageItem } from '@/lib/storage';

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  media: Movie | TVShow;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
  onProgress?: (progress: number) => void;
}

export default function VideoPlayer({
  isOpen,
  onClose,
  media,
  mediaType,
  season = 1,
  episode = 1,
  onProgress
}: VideoPlayerProps) {
  const [currentServerIndex, setCurrentServerIndex] = useState(0);
  const [sandboxEnabled, setSandboxEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  const currentServer = servers[currentServerIndex];

  useEffect(() => {
    // Load user preferences
    const preferences = getStorageItem('userPreferences', {
      sandboxEnabled: true,
      autoplay: true,
      defaultServer: servers[0].name
    });
    
    setSandboxEnabled(preferences.sandboxEnabled);
    setAutoplay(preferences.autoplay);
    
    // Find default server index
    const defaultServerIndex = servers.findIndex(s => s.name === preferences.defaultServer);
    if (defaultServerIndex !== -1) {
      setCurrentServerIndex(defaultServerIndex);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);
      setIframeKey(prev => prev + 1);
    }
  }, [isOpen, currentServerIndex, season, episode]);

  const buildStreamUrl = (server: StreamingServer): string => {
    const isTV = mediaType === 'tv';
    const template = isTV ? server.url_tv : server.url;
    
    let url = template;
    
    // Replace placeholders based on server type
    if (server.type === 'tmdb') {
      url = url.replace('{tmdb_id}', media.id.toString());
    } else {
      // For IMDB servers, we need the IMDB ID
      const imdbId = (media as any).imdb_id || `tt${media.id}`;
      url = url.replace('{imdb_id}', imdbId);
    }
    
    if (isTV) {
      url = url.replace('{season}', season.toString());
      url = url.replace('{episode}', episode.toString());
    }
    
    return url;
  };

  const currentStreamUrl = buildStreamUrl(currentServer);

  const handleServerChange = (serverName: string) => {
    const newIndex = servers.findIndex(s => s.name === serverName);
    if (newIndex !== -1) {
      setCurrentServerIndex(newIndex);
      
      // Save as default server
      const preferences = getStorageItem('userPreferences', {});
      setStorageItem('userPreferences', {
        ...preferences,
        defaultServer: serverName
      });
    }
  };

  const handleSandboxToggle = (enabled: boolean) => {
    setSandboxEnabled(enabled);
    setIframeKey(prev => prev + 1);
    
    // Save preference
    const preferences = getStorageItem('userPreferences', {});
    setStorageItem('userPreferences', {
      ...preferences,
      sandboxEnabled: enabled
    });
  };

  const handleAutoplayToggle = (enabled: boolean) => {
    setAutoplay(enabled);
    
    // Save preference
    const preferences = getStorageItem('userPreferences', {});
    setStorageItem('userPreferences', {
      ...preferences,
      autoplay: enabled
    });
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load video. Try switching servers.');
  };

  const handleNextServer = () => {
    const nextIndex = (currentServerIndex + 1) % servers.length;
    setCurrentServerIndex(nextIndex);
  };

  const handlePreviousServer = () => {
    const prevIndex = currentServerIndex === 0 ? servers.length - 1 : currentServerIndex - 1;
    setCurrentServerIndex(prevIndex);
  };

  const handleDownload = () => {
    const downloadUrl = mediaType === 'tv' 
      ? `https://dl.vidsrc.vip/tv/${media.id}/${season}/${episode}`
      : `https://dl.vidsrc.vip/movie/${media.id}`;
    
    window.open(downloadUrl, '_blank');
  };

  const handleOpenInNewTab = () => {
    window.open(currentStreamUrl, '_blank');
  };

  const getServerBadge = (server: StreamingServer) => {
    if (server.name.includes('4k') || server.name.includes('4K')) {
      return <Badge variant="secondary" className="text-xs">4K</Badge>;
    }
    if (server.name.includes('fast')) {
      return <Badge variant="outline" className="text-xs">Fast</Badge>;
    }
    if (server.name.includes('low ads')) {
      return <Badge variant="outline" className="text-xs">Low Ads</Badge>;
    }
    if (server.name.includes('🔥')) {
      return <Badge variant="destructive" className="text-xs">Premium</Badge>;
    }
    return null;
  };

  const mediaTitle = 'title' in media ? media.title : media.name;
  const episodeTitle = mediaType === 'tv' ? `S${season}E${episode}` : '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black border-gray-800">
        <DialogHeader className="p-4 pb-2 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-lg font-semibold">
              {mediaTitle} {episodeTitle}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:bg-white/10"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {showSettings && (
          <div className="absolute top-16 right-4 z-50 bg-gray-900 border border-gray-700 rounded-lg p-4 w-80">
            <h3 className="text-white font-semibold mb-3">Player Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sandbox" className="text-white text-sm">
                  Sandbox Mode (Ad Blocking)
                </Label>
                <Switch
                  id="sandbox"
                  checked={sandboxEnabled}
                  onCheckedChange={handleSandboxToggle}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="autoplay" className="text-white text-sm">
                  Autoplay
                </Label>
                <Switch
                  id="autoplay"
                  checked={autoplay}
                  onCheckedChange={handleAutoplayToggle}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p>Loading video...</p>
                <p className="text-sm text-gray-400 mt-2">Server: {currentServer.name}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="text-white text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <Button onClick={handleNextServer} className="bg-orange-600 hover:bg-orange-700">
                  Try Next Server
                </Button>
              </div>
            </div>
          )}

          <iframe
            key={iframeKey}
            src={currentStreamUrl}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox={sandboxEnabled ? "allow-scripts allow-same-origin allow-forms" : undefined}
            referrerPolicy="no-referrer"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        </div>

        <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Select value={currentServer.name} onValueChange={handleServerChange}>
                <SelectTrigger className="w-64 bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {servers.map((server, index) => (
                    <SelectItem 
                      key={index} 
                      value={server.name}
                      className="text-white hover:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <span>{server.name}</span>
                        {getServerBadge(server)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousServer}
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextServer}
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Tab
              </Button>
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-400">
            Server {currentServerIndex + 1} of {servers.length} • 
            {sandboxEnabled ? ' Sandbox Enabled' : ' Sandbox Disabled'} • 
            Type: {currentServer.type.toUpperCase()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}