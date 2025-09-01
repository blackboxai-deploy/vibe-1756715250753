'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Play, Heart, Download, Share2, Calendar, Clock, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Movie, Cast, Video, TVShow } from '@/types';
import { tmdbApi } from '@/lib/api/tmdb';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useContinueWatching } from '@/hooks/useContinueWatching';
import VideoPlayer from '@/components/player/VideoPlayer';
import MovieCard from './MovieCard';

interface MovieDetailsProps {
  movie: Movie | TVShow;
  type: 'movie' | 'tv';
}

export default function MovieDetails({ movie, type }: MovieDetailsProps) {
  const [cast, setCast] = useState<Cast[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [similar, setSimilar] = useState<(Movie | TVShow)[]>([]);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { addToContinueWatching } = useContinueWatching();

  const title = type === 'movie' ? (movie as Movie).title : (movie as TVShow).name;
  const releaseDate = type === 'movie' ? (movie as Movie).release_date : (movie as TVShow).first_air_date;
  const runtime = type === 'movie' ? (movie as Movie).runtime : (movie as TVShow).episode_run_time?.[0];

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const [creditsData, videosData, similarData] = await Promise.all([
          tmdbApi.getCredits(movie.id, type),
          tmdbApi.getVideos(movie.id, type),
          tmdbApi.getSimilar(movie.id, type)
        ]);

        setCast(creditsData.cast.slice(0, 10));
        setVideos(videosData.results.filter((video: Video) => video.site === 'YouTube'));
        setSimilar(similarData.results.slice(0, 12));
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movie.id, type]);

  const handlePlay = () => {
    addToContinueWatching({
      id: movie.id,
      type,
      title,
      poster_path: movie.poster_path,
      progress: 0,
      lastWatched: Date.now(),
      season: type === 'tv' ? selectedSeason : undefined,
      episode: type === 'tv' ? selectedEpisode : undefined,
      runtime: runtime || 0
    });
    setIsPlayerOpen(true);
  };

  const handleWatchlistToggle = () => {
    if (isInWatchlist(movie.id, type)) {
      removeFromWatchlist(movie.id, type);
    } else {
      addToWatchlist({
        id: movie.id,
        type,
        title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: type === 'movie' ? (movie as Movie).release_date : undefined,
        first_air_date: type === 'tv' ? (movie as TVShow).first_air_date : undefined,
        addedAt: Date.now()
      });
    }
  };

  const backdropUrl = movie.backdrop_path 
    ? `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`
    : '/placeholder-backdrop.jpg';

  const posterUrl = movie.poster_path
    ? `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
    : '/placeholder-poster.jpg';

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={backdropUrl}
            alt={title}
            fill
            className="object-cover"
            style={{
              filter: 'saturate(1.2) contrast(1.3)',
            }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex h-full items-end">
          <div className="container mx-auto px-4 pb-16">
            <div className="flex flex-col lg:flex-row gap-8 items-end">
              {/* Poster */}
              <div className="flex-shrink-0">
                <div className="relative w-64 h-96 rounded-2xl overflow-hidden bg-white p-2 shadow-2xl">
                  <Image
                    src={posterUrl}
                    alt={title}
                    fill
                    className="object-cover rounded-xl"
                    style={{ filter: 'saturate(1.3)' }}
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-black/80 text-white">
                      HD
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Movie Info */}
              <div className="flex-1 text-white">
                <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-shadow">
                  {title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{movie.vote_average.toFixed(1)}/10</span>
                  </div>
                  
                  {releaseDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(releaseDate).getFullYear()}</span>
                    </div>
                  )}
                  
                  {runtime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{runtime} min</span>
                    </div>
                  )}
                  
                  <Badge variant="outline" className="border-white/30 text-white">
                    {type === 'movie' ? 'Movie' : 'TV Show'}
                  </Badge>
                </div>

                {/* Genres */}
                {movie.genres && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {movie.genres.map((genre) => (
                      <Badge key={genre.id} variant="secondary" className="bg-white/20 text-white">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Overview */}
                <p className="text-lg text-gray-200 mb-8 max-w-3xl leading-relaxed">
                  {movie.overview}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    onClick={handlePlay}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8"
                  >
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Play Now
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleWatchlistToggle}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Heart className={`w-5 h-5 mr-2 ${isInWatchlist(movie.id, type) ? 'fill-current text-red-500' : ''}`} />
                    {isInWatchlist(movie.id, type) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="cast">Cast</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="similar">Similar</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-4">Movie Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">Full Name</h4>
                        <p>{title}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">Rating</h4>
                        <p>{movie.vote_average.toFixed(1)}/10</p>
                      </div>
                      {type === 'tv' && (
                        <>
                          <div>
                            <h4 className="font-semibold text-muted-foreground mb-2">Status</h4>
                            <p>{(movie as TVShow).status || 'Unknown'}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-muted-foreground mb-2">Seasons</h4>
                            <p>{(movie as TVShow).number_of_seasons || 'N/A'}</p>
                          </div>
                        </>
                      )}
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">Type</h4>
                        <p>{type === 'movie' ? 'Movie' : 'TV Show'}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">Released</h4>
                        <p>{releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">Country</h4>
                        <p>
                          {type === 'movie' 
                            ? (movie as Movie).production_countries?.[0]?.name || 'Unknown'
                            : (movie as TVShow).origin_country?.[0] || 'Unknown'
                          }
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">Runtime</h4>
                        <p>{runtime ? `${runtime} minutes` : 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* TV Show Seasons */}
                {type === 'tv' && (movie as TVShow).seasons && (
                  <Card className="mt-6">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-4">Seasons & Episodes</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Season</label>
                          <select
                            value={selectedSeason}
                            onChange={(e) => setSelectedSeason(Number(e.target.value))}
                            className="w-full p-2 border rounded-md bg-background"
                          >
                            {(movie as TVShow).seasons?.map((season) => (
                              <option key={season.id} value={season.season_number}>
                                Season {season.season_number}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Episode</label>
                          <select
                            value={selectedEpisode}
                            onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                            className="w-full p-2 border rounded-md bg-background"
                          >
                            {Array.from({ length: 20 }, (_, i) => i + 1).map((ep) => (
                              <option key={ep} value={ep}>
                                Episode {ep}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Additional Info</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-1">Language</h4>
                        <p className="capitalize">{movie.original_language}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-1">Popularity</h4>
                        <p>{Math.round(movie.popularity)}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-1">Vote Count</h4>
                        <p>{movie.vote_count.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cast" className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {cast.map((actor) => (
                <Card key={actor.id} className="overflow-hidden">
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={
                        actor.profile_path
                          ? `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/w300${actor.profile_path}`
                          : '/placeholder-person.jpg'
                      }
                      alt={actor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm mb-1">{actor.name}</h4>
                    <p className="text-xs text-muted-foreground">{actor.character}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm">{video.name}</h4>
                    <p className="text-xs text-muted-foreground">{video.type}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="similar" className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {similar.map((item) => (
                <MovieCard
                  key={item.id}
                  movie={item}
                  type={type}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Comments Section */}
      <div className="container mx-auto px-4 pb-12">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold mb-4">Comments</h3>
            <div id="disqus_thread"></div>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  var disqus_config = function () {
                    this.page.url = window.location.href;
                    this.page.identifier = '${type}-${movie.id}';
                  };
                  (function() {
                    var d = document, s = d.createElement('script');
                    s.src = 'https://dktechnozone.disqus.com/embed.js';
                    s.setAttribute('data-timestamp', +new Date());
                    (d.head || d.body).appendChild(s);
                  })();
                `
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Video Player Modal */}
      <Dialog open={isPlayerOpen} onOpenChange={setIsPlayerOpen}>
        <DialogContent className="max-w-6xl w-full h-[80vh]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <VideoPlayer
            movieId={movie.id}
            type={type}
            season={type === 'tv' ? selectedSeason : undefined}
            episode={type === 'tv' ? selectedEpisode : undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}