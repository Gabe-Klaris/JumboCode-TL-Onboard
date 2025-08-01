'use client'
import React from 'react'

interface SeenProps {
    movieId: string;
}

const Seen = (data: SeenProps) => {
    const [movieSeen, setMovieSeen] = React.useState(false);

    async function setSeen(movieId: string) {
        const response = await fetch(`/api/seen?movieId=${movieId}`);
        if (response.ok) {
            const data = await response.json();
            setMovieSeen(data.seen);
        } else {
            console.error("Failed to fetch seen status");
        }
    }

    async function toggleSeen(movieId: string) {
        const response = await fetch(`/api/seen`, {
            method  : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ movieId }),
        });
        if (response.ok) {
            setMovieSeen(!movieSeen);
        } else {
            console.error("Failed to update seen status");
        }
    }

    const movieId = data.movieId;
    React.useEffect(() => {
        setSeen(movieId);
    }, [movieId]);


    return (
        <button onClick = {() => {
        toggleSeen(movieId);
        console.log(`Movie seen status: ${!movieSeen}`);
        }}
        className={`px-4 py-2 rounded-lg text-white ${movieSeen ? 'bg-green-500' : 'bg-gray-300'}`}>
        
            {movieSeen ? 'Seen' : 'Not Seen'}

        </button>
  )
}

export default Seen