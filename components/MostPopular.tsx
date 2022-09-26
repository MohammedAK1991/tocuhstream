import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { CircularProgress, Box, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import VideoCard from './VideoCard';

export default function MostPopular() {
  const [videoCards, setVideoCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  async function createVideoCards(videoItems: any[]) {
    let newVideoCards = [];
    for (const video of videoItems) {
      const videoId = video.id;
      const snippet = video.snippet;
      const channelId = snippet.channelId;
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`,
      );
      const channelImage = response.data.items[0].snippet.thumbnails.medium.url;

      const title = snippet.title;
      const image = snippet.thumbnails.medium.url;
      const views = video.statistics.viewCount;
      const timestamp = dayjs(snippet.publishedAt).format('DD/MM/YYYY');
      const channel = snippet.channelTitle;
      const description = snippet.description;

      newVideoCards.push({
        videoId,
        image,
        title,
        channel,
        views,
        timestamp,
        channelImage,
        description,
      });
    }
    setVideoCards(newVideoCards);
    setIsLoading(false);
  }

  useEffect(() => {
    axios
      .get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=6&regionCode=ES&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`,
      )
      .then((response) => {
        createVideoCards(response.data.items);
        setIsError(false);
      })
      .catch((error) => {
        console.log(error);
        setIsError(true);
      });
  }, []);

  if (isError) {
    return <Text p={4}>No Results found!</Text>;
  }
  return (
    <Box w="full" overflowY="scroll" overflowX="hidden" p="2">
      {isLoading ? <CircularProgress color="secondary" /> : null}
      <Box>
        {videoCards.map((item) => {
          return (
            <VideoCard
              key={item.videoId}
              title={item.title}
              image={item.image}
              views={item.views}
              timestamp={item.timestamp}
              channel={item.channel}
              channelImage={item.channelImage}
            />
          );
        })}
      </Box>
    </Box>
  );
}