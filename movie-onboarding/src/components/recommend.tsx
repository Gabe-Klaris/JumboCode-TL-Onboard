'use client'
import { Fragment } from "react";
import React from 'react'
import { ThumbsUp, ThumbsDown } from "lucide-react"

interface recommendedProps {
  movieId: string;
}


const Recommend = (data: recommendedProps) => {
  const [isRecommended, setRecommended] = React.useState<boolean | null>(null);

  const setRecommendation = async (movieId: string) => {
    const seen = await fetch(`/api/recommend?movieId=${movieId}`);
    if (seen.ok) {
      const data = await seen.json();
      setRecommended(data.recommendation);
    } else {
      console.error("Failed to fetch recommendation status");
    }
  }

  const toggleRecommendation = async (movieId: string, recommendation: boolean) => {
    const response = await fetch('/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ movieId, recommendation }),
    });

    if (response.ok) {
      setRecommended(recommendation);
    } else {
      console.error("Failed to update recommendation status");
    }
  }

  const movieId = data.movieId;
  React.useEffect(() => {
    setRecommendation(movieId);
  }, [movieId,]);
  return (
    <Fragment>
      <button onClick={() => {
        toggleRecommendation(movieId, true);
      }}
      className={`px-4 py-2 rounded-lg text-white ${isRecommended === true ? 'bg-green-500' : 'bg-gray-500'}`}>
        Recommend
        <ThumbsUp className="inline-block ml-2" />
      </button>
      <button onClick={() => {
        toggleRecommendation(movieId, false);
      }}
      className={`px-4 py-2 rounded-lg text-white ${isRecommended === false ? 'bg-red-500' : 'bg-gray-500'}`}>
        Don&apos;t Recommend
        <ThumbsDown className="inline-block ml-2" />
      </button>
  </Fragment>
  )
}

export default Recommend